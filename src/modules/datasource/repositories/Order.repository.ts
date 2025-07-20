import { Injectable } from '@nestjs/common';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '../schema/schema';
import { DataSourceClient } from '../DataSourceClient';
import { eq } from 'drizzle-orm';
import {
  ICreateOrderItem,
  IOrderRecord,
  IOrderWithRelations,
  IUpdateOrder,
} from 'tbh-shared-types';
import { BaseCreateOrder } from '../types';

@Injectable()
export class OrderRepository {
  private client: NeonHttpDatabase<typeof schema>;
  constructor(private readonly datasource: DataSourceClient) {
    this.client = this.datasource.getClient();
  }

  async getAllOrders(): Promise<IOrderRecord[]> {
    return this.client.query.orderTable.findMany({
      orderBy: (order, { desc }) => desc(order.orderDate),
    });
  }

  async getOrderById(orderId: string): Promise<IOrderRecord | null> {
    return this.client.query.orderTable.findFirst({
      where: (order, { eq }) => eq(order.orderId, orderId),
    });
  }

  async getOrderWithProducts(
    orderId: string,
  ): Promise<IOrderWithRelations | null> {
    return this.client.query.orderTable.findFirst({
      where: (order, { eq }) => eq(order.orderId, orderId),
      with: {
        items: {
          with: {
            product: true,
          },
        },
      },
    });
  }

  async getOrderWithRelations(
    orderId: string,
  ): Promise<IOrderWithRelations | null> {
    return this.client.query.orderTable.findFirst({
      where: (order, { eq }) => eq(order.orderId, orderId),
      with: {
        items: {
          with: {
            product: true,
          },
        },
        payment: true,
        user: true,
        coupon: true,
        address: true,
      },
    });
  }

  async createOrder(data: BaseCreateOrder): Promise<IOrderRecord> {
    const result = await this.client
      .insert(schema.orderTable)
      .values(data)
      .returning();

    return result[0];
  }

  async updateOrder(data: IUpdateOrder): Promise<IOrderRecord | null> {
    const { orderId, ...updateData } = data;

    const result = await this.client
      .update(schema.orderTable)
      .set(updateData)
      .where(eq(schema.orderTable.orderId, orderId))
      .returning();

    if (result.length === 0) {
      return null;
    }

    return result[0];
  }

  async createOrderItems(products: ICreateOrderItem[]): Promise<void> {
    await this.client.insert(schema.orderItemTable).values(products);
  }
}
