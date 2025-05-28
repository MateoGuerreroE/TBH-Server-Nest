export interface CouponRecord {
  couponId: string;
  couponCode: string;
  discountAmount: string;
  expiresAt: Date;
}

export interface CreateCouponData {
  couponCode: string;
  discountAmount: string;
  expiresAt?: Date;
}

export interface UpdateCouponData {
  couponId: string;
  discountAmount?: string;
  expiresAt?: Date;
}
