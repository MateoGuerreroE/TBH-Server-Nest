import { ExternalPaymentResponse, PaymentCreateRequest } from './external';

export interface IUpdatePayment {
  paymentId: string;
  status?: string;
  externalResponse?: ExternalPaymentResponse;
  paymentDate?: Date;
}

export interface IShippingData {
  fullName: string;
  emailAddress: string;
  city: string;
  address: string;
  notes: string | null;
  phone: string;
}

export interface IProcessPayment {
  orderId: string;
  payment: PaymentCreateRequest;
  shipping: IShippingData;
  addressId: string;
}

export interface ICreatePayment {
  paymentAmount: string;
  orderId: string;
  externalPaymentId: string;
  status: string;
  externalResponse: ExternalPaymentResponse;
}

/**
 * ORDER INFO
 */

export interface ICreateOrder {
  userId?: string;
  couponId?: string;
  taxes: number;
  orderProductTotal: number;
  items: IOrderItem[];
}

export interface IOrderItem {
  productId: string;
  amount: number;
  priceAtPurchase: number;
}

export interface IUpdateOrder {
  orderId: string;
  addressId?: string;
  orderProductTotal?: number;
  taxes?: number;
  userId?: string;
  paymentId?: string | null;
  couponId?: string | null;
}

export interface ICreateOrderItem {
  orderId: string;
  productId: string;
  amount: string;
  priceAtPurchase: string;
}

// COUPONS

export interface ICreateCoupon {
  couponCode: string;
  discountAmount: string;
  expiresAt?: Date;
}

export interface IUpdateCoupon {
  couponId: string;
  discountAmount?: string;
  expiresAt?: Date;
}

export interface ITrendUpdate {
  productId: string;
  isVisibleOnGrid?: boolean;
  isVisibleOnCarousel?: boolean;
}
