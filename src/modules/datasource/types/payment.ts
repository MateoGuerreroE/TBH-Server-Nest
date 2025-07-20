import { InferSelectModel } from 'drizzle-orm';
import { ExternalPaymentResponse } from 'src/modules/payment/types';
import { paymentTable } from '../schema/schema';
import { IOrderWithRelations } from 'tbh-shared-types';

export interface PaymentRecord {
  paymentId: string;
  paymentDate: Date;
  paymentAmount: string;
  status: string;
  orderId: string;
  updatedAt: Date;
  externalPaymentId: string;
  externalResponse: Record<string, any>; // ExternalPaymentResponse
}

export type Payment = InferSelectModel<typeof paymentTable>;

export interface PaymentWithOrder extends PaymentRecord {
  order: IOrderWithRelations;
}

export interface CreatePaymentData {
  paymentAmount: string;
  orderId: string;
  externalPaymentId: string;
  status: string;
  externalResponse: ExternalPaymentResponse;
}

export interface UpdatePaymentData {
  paymentId: string;
  paymentDate?: Date;
  status?: string;
  externalResponse?: ExternalPaymentResponse;
}
