import { jest } from '@jest/globals';
import { createHmac } from 'node:crypto';

// firebase-admin (pulled in via UserService) is not loadable under jest ESM
jest.unstable_mockModule('../../access/index', () => ({ UserService: class {} }));
const { PaymentService } = await import('./Payment.service');

const SECRET = 'test-secret';
const O = '33333333-3333-4333-8333-333333333333';
const P = '44444444-4444-4444-8444-444444444444';

function build(overrides: Record<string, unknown> = {}) {
  const mp = {
    createPayment: jest.fn().mockResolvedValue({ id: 99, status: 'approved' }),
    getPayment: jest.fn(),
  };
  const payments = {
    getPaymentsByOrderId: jest.fn().mockResolvedValue([]),
    createPayment: jest.fn().mockResolvedValue({ paymentId: P }),
    getPaymentByExternalId: jest.fn(),
    updatePayment: jest.fn(),
  };
  const orders = {
    getOrderWithProducts: jest.fn().mockResolvedValue({
      orderId: O,
      status: 'pending',
      orderProductTotal: '100000',
      taxes: '19000',
      paymentId: null,
      ...overrides,
    }),
    modifyProcessedOrder: jest.fn(),
    setStatus: jest.fn(),
  };
  const users = {
    getUserByEmailAddress: jest.fn().mockResolvedValue({
      isOk: () => true,
      value: { userId: '11111111-1111-4111-8111-111111111111' },
    }),
  };
  const addresses = {
    createAddress: jest
      .fn()
      .mockResolvedValue({ addressId: '22222222-2222-4222-8222-222222222222' }),
  };
  const config = {
    getMpWebhookSecret: () => SECRET,
    getPublicApiUrl: () => 'https://api.example.com/',
  };
  const logger = { error: jest.fn(), warn: jest.fn(), debug: jest.fn() };
  const service = new PaymentService(
    logger as never,
    payments as never,
    users as never,
    orders as never,
    mp as never,
    addresses as never,
    config as never,
  );
  return { service, mp, payments, orders };
}

const dto = (payment: Record<string, unknown> = {}) =>
  ({
    orderId: O,
    payment: { token: 'tok', transaction_amount: 1, ...payment },
    shipping: {
      fullName: 'Ana Perez',
      emailAddress: 'a@b.co',
      city: 'Bogota',
      address: 'Cra 1',
      notes: null,
      phone: '1',
    },
  }) as never;

describe('PaymentService.processPayment', () => {
  it('charges the server-side total, ignoring the client amount', async () => {
    const { service, mp } = build();
    await service.processPayment(dto({ transaction_amount: 1 }));
    const [body, key] = mp.createPayment.mock.calls[0];
    expect(body.transaction_amount).toBe(119000);
    expect(body.external_reference).toBe(O);
    expect(body.notification_url).toBe('https://api.example.com/payment/webhook');
    expect(key).toBe(`${O}-0`);
  });

  it('drops non-whitelisted client fields', async () => {
    const { service, mp } = build();
    await service.processPayment(dto({ binary_mode: true, capture: false }));
    const [body] = mp.createPayment.mock.calls[0];
    expect(body.binary_mode).toBeUndefined();
    expect(body.capture).toBeUndefined();
    expect(body.token).toBe('tok');
  });

  it('refuses an order that is already paid', async () => {
    const { service, mp } = build({ status: 'paid' });
    await expect(service.processPayment(dto())).rejects.toThrow(/in progress/);
    expect(mp.createPayment).not.toHaveBeenCalled();
  });

  it('refuses when an in-flight payment exists', async () => {
    const { service, mp, payments } = build();
    payments.getPaymentsByOrderId.mockResolvedValue([{ status: 'pending' }]);
    await expect(service.processPayment(dto())).rejects.toThrow(/in progress/);
    expect(mp.createPayment).not.toHaveBeenCalled();
  });

  it('allows a retry after a rejection with a new idempotency key', async () => {
    const { service, mp, payments } = build();
    payments.getPaymentsByOrderId.mockResolvedValue([{ status: 'rejected' }]);
    await service.processPayment(dto());
    expect(mp.createPayment.mock.calls[0][1]).toBe(`${O}-1`);
  });

  it('marks the order paid on approval', async () => {
    const { service, orders } = build();
    await service.processPayment(dto());
    expect(orders.setStatus).toHaveBeenCalledWith(O, 'paid');
  });
});

describe('PaymentService.verifyWebhookSignature', () => {
  const sign = (id: string, reqId: string, ts: string) =>
    createHmac('sha256', SECRET)
      .update(`id:${id};request-id:${reqId};ts:${ts};`)
      .digest('hex');

  it('accepts a valid signature (id lower-cased)', () => {
    const { service } = build();
    const v1 = sign('abc123', 'req-1', '1700000000');
    expect(
      service.verifyWebhookSignature(`ts=1700000000,v1=${v1}`, 'req-1', 'ABC123'),
    ).toBe(true);
  });

  it('rejects a tampered id, bad hex and missing header', () => {
    const { service } = build();
    const v1 = sign('abc123', 'req-1', '1700000000');
    expect(
      service.verifyWebhookSignature(`ts=1700000000,v1=${v1}`, 'req-1', 'other'),
    ).toBe(false);
    expect(
      service.verifyWebhookSignature('ts=1,v1=zz', 'req-1', 'abc123'),
    ).toBe(false);
    expect(service.verifyWebhookSignature(undefined, 'req-1', 'abc123')).toBe(
      false,
    );
  });
});
