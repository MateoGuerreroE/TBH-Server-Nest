export type OrderStatus = 'pending' | 'paid' | 'failed' | 'cancelled';

/** Statuses after which a new charge for the same order must not be made. */
export const IN_FLIGHT_PAYMENT_STATUSES = [
  'approved',
  'authorized',
  'pending',
  'in_process',
  'in_mediation',
];

export function mapPaymentStatus(mpStatus: string): OrderStatus {
  switch (mpStatus) {
    case 'approved':
      return 'paid';
    case 'rejected':
      return 'failed';
    case 'cancelled':
    case 'refunded':
    case 'charged_back':
      return 'cancelled';
    default:
      return 'pending';
  }
}

/** Whole-peso rounding (COP has no minor unit in practice). */
export const roundCop = (value: number): number => Math.round(value);

export interface OrderTotals {
  /** Product total after the coupon discount (stored in orderProductTotal). */
  productTotal: number;
  taxes: number;
  discount: number;
  total: number;
}

/**
 * Fixed-amount coupon (clamped to the subtotal), then tax on the discounted
 * amount. Works in whole pesos.
 */
export function computeTotals(
  subtotal: number,
  couponAmount: number,
  taxRate: number,
): OrderTotals {
  const discount = Math.min(Math.max(couponAmount, 0), subtotal);
  const productTotal = roundCop(subtotal - discount);
  const taxes = roundCop(productTotal * taxRate);
  return {
    productTotal,
    taxes,
    discount: roundCop(discount),
    total: productTotal + taxes,
  };
}
