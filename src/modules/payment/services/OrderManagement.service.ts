import { Injectable } from '@nestjs/common';
import {
  CreateOrderItemData,
  OrderRecord,
  OrderRecordWithProducts,
  OrderRepository,
  OrderWithRelations,
} from 'src/modules/datasource';
import { CreateOrderDTO, UpdateOrderDTO } from '../types';
import { BusinessError, CustomError } from 'src/types';

@Injectable()
export class OrderManagementService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async getOrderWithProducts(
    orderId: string,
  ): Promise<OrderRecordWithProducts> {
    const order = await this.orderRepository.getOrderWithProducts(orderId);
    if (!order) {
      throw new BusinessError(
        'Unable to get order',
        `Order not found with ID: ${orderId}`,
      );
    }
    return order;
  }

  async getCompleteOrder(orderId: string): Promise<OrderWithRelations> {
    const order = await this.orderRepository.getOrderWithRelations(orderId);
    if (!order) {
      throw new BusinessError(
        'Unable to get order',
        `Order not found with ID: ${orderId}`,
      );
    }
    return order;
  }

  async createInitialOrder(
    initialOrder: CreateOrderDTO,
  ): Promise<OrderRecordWithProducts> {
    try {
      const { items } = initialOrder;
      const order = await this.orderRepository.createOrder(
        initialOrder.getOrder(),
      );

      const orderId = order.orderId;
      const orderItems: CreateOrderItemData[] = items.map((item) => ({
        orderId,
        ...item.getOrderItem(),
      }));

      await this.orderRepository.createOrderItems(orderItems);

      return this.orderRepository.getOrderWithProducts(orderId);
    } catch (e) {
      const message =
        e instanceof CustomError
          ? e.cause
          : ((e as Error).message ?? 'Unknown error');
      throw new BusinessError('Unable to create order', message);
    }
  }

  async modifyProcessedOrder(updateOrder: UpdateOrderDTO): Promise<void> {
    try {
      const { orderId } = updateOrder;

      const existingOrder = await this.orderRepository.getOrderById(orderId);
      if (!existingOrder) {
        throw new BusinessError(
          'Unable to modify order',
          `Order not found: ${orderId}`,
        );
      }

      const updatedOrder = await this.orderRepository.updateOrder(
        updateOrder.getOrder(),
      );

      if (!updatedOrder) {
        throw new BusinessError(
          'Unable to modify order',
          `Failed to update order: ${orderId}`,
        );
      }
    } catch (e) {
      const message = e instanceof CustomError ? e.cause : 'Unknown error';
      throw new BusinessError('Unable to modify order', message);
    }
  }

  async updateOrder(updateOrder: UpdateOrderDTO): Promise<OrderRecord> {
    try {
      const { orderId } = updateOrder;

      const existingOrder = await this.orderRepository.getOrderById(orderId);
      if (!existingOrder) {
        throw new BusinessError(
          'Unable to update order',
          `Order not found: ${orderId}`,
        );
      }

      return this.orderRepository.updateOrder(updateOrder.getOrder());
    } catch (e) {
      const message = e instanceof CustomError ? e.cause : 'Unknown error';
      throw new BusinessError('Unable to update order', message);
    }
  }
}
