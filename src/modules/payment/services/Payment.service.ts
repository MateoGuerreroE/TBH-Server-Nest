import { createHmac, timingSafeEqual } from 'node:crypto';
import { PaymentRepository } from '../../datasource/repositories/Payment.repository';
import { LoggingService } from '../../logging/index';
import { ProcessPaymentDTO, UpdateOrderDTO } from '../types/index';
import { Injectable } from '@nestjs/common';
import { BusinessError } from '../../../types/index';
import { MercadoLibreService } from './MercadoLibre.service';
import { OrderManagementService } from './OrderManagement.service';
import { validatePayload } from '../../../utils/response';
import { UserService } from '../../access/index';
import { AddressRepository } from '../../datasource/index';
import { ConfigService } from '../../config/index';
import {
  IN_FLIGHT_PAYMENT_STATUSES,
  mapPaymentStatus,
  roundCop,
} from '../types/util';
import type { ExternalPaymentData } from '../types/index';
import type {
  IOrderRecord,
  IPaymentRecord,
  IPaymentWithRelations,
} from 'tbh-shared-types';

/** Client fields we accept from the Payment Brick. Everything else is ours. */
const CLIENT_PAYMENT_FIELDS = [
  'token',
  'installments',
  'payment_method_id',
  'issuer_id',
  'payer',
  'transaction_details',
  'additional_info',
  'callback_url',
] as const;

@Injectable()
export class PaymentService {
  constructor(
    private readonly logger: LoggingService,
    private readonly paymentRepository: PaymentRepository,
    private readonly userService: UserService,
    private readonly orderManagementService: OrderManagementService,
    private readonly mercadoLibreService: MercadoLibreService,
    private readonly addressRepository: AddressRepository,
    private readonly configService: ConfigService,
  ) {}

  async getPaymentById(paymentId: string): Promise<IPaymentWithRelations> {
    const payment = await this.paymentRepository.getPaymentWithOrder(paymentId);
    if (!payment) {
      throw new BusinessError(
        'Payment not found',
        'No payment record found for the provided ID',
      );
    }
    return payment;
  }

  /**
   * The amount, description and reference are always built here from the
   * stored order. Only whitelisted instrument fields come from the browser.
   */
  private buildMpBody(
    clientData: ExternalPaymentData,
    orderId: string,
    amount: number,
  ): ExternalPaymentData {
    const body: Record<string, unknown> = {};
    for (const field of CLIENT_PAYMENT_FIELDS) {
      const value = (clientData as Record<string, unknown>)[field];
      if (value !== undefined) body[field] = value;
    }

    body.transaction_amount = amount;
    body.description = `Pedido ${orderId}`;
    body.external_reference = orderId;

    const apiUrl = this.configService.getPublicApiUrl();
    if (apiUrl) {
      body.notification_url = `${apiUrl.replace(/\/$/, '')}/payment/webhook`;
    }
    return body as unknown as ExternalPaymentData;
  }

  async processPayment(data: ProcessPaymentDTO): Promise<IPaymentRecord> {
    try {
      const { payment, orderId, shipping, addressId } = data;
      const order =
        await this.orderManagementService.getOrderWithProducts(orderId);

      const previous = await this.paymentRepository.getPaymentsByOrderId(
        orderId,
      );
      if (
        order.status === 'paid' ||
        previous.some((p) => IN_FLIGHT_PAYMENT_STATUSES.includes(p.status))
      ) {
        throw new BusinessError(
          'Unable to process payment',
          'This order already has a payment in progress or approved',
        );
      }

      // Resolve user and address first: a failure here must not happen after
      // money has been charged.
      const orderModifications = await this.resolveUserAndAddress(
        order.orderId,
        shipping,
        addressId,
      );

      const amount = roundCop(
        parseFloat(order.orderProductTotal) + parseFloat(order.taxes),
      );

      const paymentResponse = await this.mercadoLibreService.createPayment(
        this.buildMpBody(payment, order.orderId, amount),
        // a new key per attempt: a retry after a rejection is a new charge
        `${order.orderId}-${previous.length}`,
      );

      try {
        const paymentRecord = await this.paymentRepository.createPayment({
          paymentAmount: amount.toString(),
          orderId: order.orderId,
          status: paymentResponse.status,
          externalPaymentId: paymentResponse.id.toString(),
          externalResponse: paymentResponse,
        });

        await this.orderManagementService.modifyProcessedOrder(
          await validatePayload(UpdateOrderDTO, {
            ...orderModifications,
            orderId: order.orderId,
            paymentId: paymentRecord.paymentId,
          }),
        );
        await this.orderManagementService.setStatus(
          order.orderId,
          mapPaymentStatus(paymentResponse.status),
        );

        return paymentRecord;
      } catch (dbError) {
        // Money may have moved: the webhook reconciles via external_reference.
        this.logger.error(
          `Charged MP payment ${paymentResponse.id} (${paymentResponse.status}) for order ${order.orderId} but failed to persist: ${(dbError as Error).message}`,
        );
        throw dbError;
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(message);
      throw new BusinessError('Unable to process payment', message);
    }
  }

  private async resolveUserAndAddress(
    orderId: string,
    shipping: ProcessPaymentDTO['shipping'],
    addressId?: string,
  ): Promise<Partial<IOrderRecord>> {
    const modifications: Partial<IOrderRecord> = {};

    const matchUser = await this.userService.getUserByEmailAddress(
      shipping.emailAddress,
    );
    if (matchUser.isOk()) {
      modifications.userId = matchUser.value.userId;
    } else {
      this.logger.warn(
        `User with email ${shipping.emailAddress} not found, visitor user will be created under received shipping information`,
      );
      const createdUser = await this.userService.createUser({
        firstName: shipping.fullName.split(' ')[0],
        lastName: shipping.fullName.split(' ')[1] || '',
        emailAddress: shipping.emailAddress,
      });
      modifications.userId = createdUser.userId;
    }

    if (!addressId) {
      const newAddress = await this.addressRepository.createAddress({
        addressName: `Address for order ${orderId}`,
        mainAddress: shipping.address,
        city: shipping.city,
        notes: shipping.notes,
        userId: modifications.userId,
      });
      modifications.addressId = newAddress.addressId;
    } else {
      modifications.addressId = addressId;
    }
    return modifications;
  }

  // ---------------------------------------------------------------- webhook

  /**
   * Mercado Pago signs `id:<data.id>;request-id:<x-request-id>;ts:<ts>;`
   * with HMAC-SHA256. Fails closed when no secret is configured.
   */
  verifyWebhookSignature(
    xSignature: string | undefined,
    xRequestId: string | undefined,
    dataId: string,
  ): boolean {
    const secret = this.configService.getMpWebhookSecret();
    if (!secret || !xSignature) return false;

    const parts: Record<string, string> = {};
    for (const part of xSignature.split(',')) {
      const [key, ...rest] = part.trim().split('=');
      parts[key] = rest.join('=');
    }
    if (!parts.ts || !parts.v1) return false;

    const manifest =
      `id:${dataId.toLowerCase()};` +
      (xRequestId ? `request-id:${xRequestId};` : '') +
      `ts:${parts.ts};`;
    const expected = createHmac('sha256', secret).update(manifest).digest();

    let received: Buffer;
    try {
      received = Buffer.from(parts.v1, 'hex');
    } catch {
      return false;
    }
    return (
      received.length === expected.length && timingSafeEqual(received, expected)
    );
  }

  /** Re-fetches the payment from MP and syncs the local payment and order. */
  async syncPaymentFromMp(externalPaymentId: string): Promise<void> {
    const mpPayment =
      await this.mercadoLibreService.getPayment(externalPaymentId);

    const existing =
      await this.paymentRepository.getPaymentByExternalId(externalPaymentId);

    let orderId: string;
    if (existing) {
      orderId = existing.orderId;
      await this.paymentRepository.updatePayment({
        paymentId: existing.paymentId,
        status: mpPayment.status,
        externalResponse: mpPayment,
      });
    } else {
      // Charge succeeded but the original request failed to persist it.
      const reference = (mpPayment as unknown as Record<string, unknown>)
        .external_reference as string | undefined;
      if (!reference) {
        this.logger.warn(
          `MP payment ${externalPaymentId} has no external_reference, ignoring`,
        );
        return;
      }
      const order =
        await this.orderManagementService.getOrderWithProducts(reference);
      orderId = order.orderId;
      const created = await this.paymentRepository.createPayment({
        paymentAmount: mpPayment.transaction_amount.toString(),
        orderId,
        status: mpPayment.status,
        externalPaymentId,
        externalResponse: mpPayment,
      });
      if (!order.paymentId) {
        await this.orderManagementService.modifyProcessedOrder(
          await validatePayload(UpdateOrderDTO, {
            orderId,
            paymentId: created.paymentId,
          }),
        );
      }
    }

    await this.orderManagementService.setStatus(
      orderId,
      mapPaymentStatus(mpPayment.status),
    );
  }
}
