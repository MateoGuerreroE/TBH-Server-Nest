import { UserRecord } from './access';
import { PaymentRecord } from './payment';
import { ProductRecord } from './products';

export interface OrderRecord {
  orderId: string;
  orderDate: Date;
  orderProductTotal: string;
  addressId: string | null;
  taxes: string;
  paymentId: string | null;
  userId: string | null;
  couponId: string | null;
}

export interface OrderItemRecord {
  orderItemId: string;
  orderId: string;
  productId: string;
  amount: string;
  priceAtPurchase: string;
}

export interface OrderItemWithProduct extends OrderItemRecord {
  product: ProductRecord;
}

export interface OrderRecordWithProducts extends OrderRecord {
  items: OrderItemWithProduct[];
}

export interface OrderWithRelations extends OrderRecordWithProducts {
  payment: PaymentRecord | null;
  coupon: any | null; // TODO Have this type when coupons are implemented
  user: UserRecord | null;
}

export interface CreateOrderData {
  orderProductTotal: string;
  taxes: string;
  userId?: string;
  couponId?: string;
}

export interface UpdateOrderData {
  orderId: string;
  userId?: string;
  addressId?: string;
  orderProductTotal?: string;
  taxes?: string;
  paymentId?: string | null;
  couponId?: string | null;
}

export interface CreateOrderItemData {
  orderId: string;
  productId: string;
  amount: string;
  priceAtPurchase: string;
}
