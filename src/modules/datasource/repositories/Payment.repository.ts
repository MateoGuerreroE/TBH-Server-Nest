import { Injectable } from '@nestjs/common';
import { DataSourceClient } from '../DataSourceClient';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '../schema/schema';
import {
  CreatePaymentData,
  PaymentRecord,
  PaymentWithOrder,
  UpdatePaymentData,
} from '../types/payment';
import { eq } from 'drizzle-orm';

@Injectable()
export class PaymentRepository {
  private client: NeonHttpDatabase<typeof schema>;
  constructor(private readonly dataClient: DataSourceClient) {
    this.client = this.dataClient.getClient();
  }

  async getPaymentById(paymentId: string): Promise<PaymentRecord | null> {
    return this.client.query.paymentTable.findFirst({
      where: (payment, { eq }) => eq(payment.paymentId, paymentId),
    });
  }

  async getPaymentWithOrder(
    paymentId: string,
  ): Promise<PaymentWithOrder | null> {
    return this.client.query.paymentTable.findFirst({
      where: (payment, { eq }) => eq(payment.paymentId, paymentId),
      with: {
        order: {
          with: {
            items: {
              with: {
                product: true,
              },
            },
          },
        },
      },
    });
  }

  async createPayment(payment: CreatePaymentData): Promise<PaymentRecord> {
    const result = await this.client
      .insert(schema.paymentTable)
      .values(payment)
      .returning();

    return result[0];
  }

  async updatePayment(
    payload: UpdatePaymentData,
  ): Promise<PaymentRecord | null> {
    const { paymentId, ...updates } = payload;

    const update = await this.client
      .update(schema.paymentTable)
      .set(updates)
      .where(eq(schema.paymentTable.paymentId, paymentId))
      .returning();

    return update.length ? update[0] : null;
  }
}
