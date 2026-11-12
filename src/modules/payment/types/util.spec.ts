import { computeTotals, mapPaymentStatus } from './util';

describe('computeTotals', () => {
  it('adds 19% tax on the product total', () => {
    expect(computeTotals(100000, 0, 0.19)).toEqual({
      productTotal: 100000,
      taxes: 19000,
      discount: 0,
      total: 119000,
    });
  });

  it('applies a fixed coupon before tax', () => {
    const t = computeTotals(100000, 10000, 0.19);
    expect(t.productTotal).toBe(90000);
    expect(t.taxes).toBe(17100);
    expect(t.total).toBe(107100);
  });

  it('never discounts below zero', () => {
    const t = computeTotals(5000, 999999, 0.19);
    expect(t.productTotal).toBe(0);
    expect(t.total).toBe(0);
  });

  it('rounds to whole pesos', () => {
    expect(computeTotals(3500.99, 0, 0.19).total).toBe(4166);
  });
});

describe('mapPaymentStatus', () => {
  it.each([
    ['approved', 'paid'],
    ['rejected', 'failed'],
    ['cancelled', 'cancelled'],
    ['in_process', 'pending'],
    ['pending', 'pending'],
  ])('%s -> %s', (mp, expected) => {
    expect(mapPaymentStatus(mp)).toBe(expected);
  });
});
