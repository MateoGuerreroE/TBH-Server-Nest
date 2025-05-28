import { Injectable } from '@nestjs/common';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '../schema/schema';
import { DataSourceClient } from '../DataSourceClient';
import {
  CreateOrderData,
  CreateOrderItemData,
  OrderRecord,
  OrderRecordWithProducts,
  OrderWithRelations,
  UpdateOrderData,
} from '../types';
import { eq } from 'drizzle-orm';

@Injectable()
export class OrderRepository {
  private client: NeonHttpDatabase<typeof schema>;
  constructor(private readonly datasource: DataSourceClient) {
    this.client = this.datasource.getClient();
  }

  async getAllOrders(): Promise<OrderRecord[]> {
    return this.client.query.orderTable.findMany({
      orderBy: (order, { desc }) => desc(order.orderDate),
    });
  }

  async getOrderById(orderId: string): Promise<OrderRecord | null> {
    return this.client.query.orderTable.findFirst({
      where: (order, { eq }) => eq(order.orderId, orderId),
    });
  }

  async getOrderWithProducts(
    orderId: string,
  ): Promise<OrderRecordWithProducts | null> {
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
  ): Promise<OrderWithRelations | null> {
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

  async createOrder(data: CreateOrderData): Promise<OrderRecord> {
    const result = await this.client
      .insert(schema.orderTable)
      .values(data)
      .returning();

    return result[0];
  }

  async updateOrder(data: UpdateOrderData): Promise<OrderRecord | null> {
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

  async createOrderItems(products: CreateOrderItemData[]): Promise<void> {
    await this.client.insert(schema.orderItemTable).values(products);
  }
}
