import { Injectable } from '@nestjs/common';
import { DataSourceClient } from '../DataSourceClient';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '../schema/schema';
import { eq } from 'drizzle-orm';
import {
  ICreatePayment,
  IPaymentRecord,
  IPaymentWithRelations,
  IUpdatePayment,
} from 'tbh-shared-types';

@Injectable()
export class PaymentRepository {
  private client: NeonHttpDatabase<typeof schema>;
  constructor(private readonly dataClient: DataSourceClient) {
    this.client = this.dataClient.getClient();
  }

  async getPaymentById(paymentId: string): Promise<IPaymentRecord | null> {
    return this.client.query.paymentTable.findFirst({
      where: (payment, { eq }) => eq(payment.paymentId, paymentId),
    });
  }

  async getPaymentWithOrder(
    paymentId: string,
  ): Promise<IPaymentWithRelations | null> {
    return this.client.query.paymentTable.findFirst({
      where: (payment, { eq }) => eq(payment.paymentId, paymentId),
      with: {
        order: {
          with: {
            user: true,
            address: true,
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

  async createPayment(payment: ICreatePayment): Promise<IPaymentRecord> {
    const result = await this.client
      .insert(schema.paymentTable)
      .values(payment)
      .returning();

    return result[0];
  }

  async updatePayment(payload: IUpdatePayment): Promise<IPaymentRecord | null> {
    const { paymentId, ...updates } = payload;

    const update = await this.client
      .update(schema.paymentTable)
      .set(updates)
      .where(eq(schema.paymentTable.paymentId, paymentId))
      .returning();

    return update.length ? update[0] : null;
  }
}
