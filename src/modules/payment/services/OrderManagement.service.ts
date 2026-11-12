import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import {
  CouponRepository,
  OrderRepository,
  ProductRepository,
} from '../../datasource/index';
import { ConfigService } from '../../config/index';
import { CreateOrderDTO, UpdateOrderDTO } from '../types/index';
import { BusinessError, CustomError } from '../../../types/index';
import type { IOrderWithRelations } from 'tbh-shared-types';
import { computeTotals } from '../types/util';

@Injectable()
export class OrderManagementService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productRepository: ProductRepository,
    private readonly couponRepository: CouponRepository,
    private readonly configService: ConfigService,
  ) {}

  async getOrderWithProducts(orderId: string): Promise<IOrderWithRelations> {
    const order = await this.orderRepository.getOrderWithProducts(orderId);
    if (!order) {
      throw new BusinessError(
        'Unable to get order',
        `Order not found with ID: ${orderId}`,
      );
    }
    return order;
  }

  async getCompleteOrder(orderId: string): Promise<IOrderWithRelations> {
    const order = await this.orderRepository.getOrderWithRelations(orderId);
    if (!order) {
      throw new BusinessError(
        'Unable to get order',
        `Order not found with ID: ${orderId}`,
      );
    }
    return order;
  }

  /**
   * Builds an order entirely from database data. The client only chooses
   * products, quantities and an optional coupon code.
   */
  async createInitialOrder(
    dto: CreateOrderDTO,
  ): Promise<IOrderWithRelations> {
    try {
      // merge duplicate lines of the same product
      const quantities = new Map<string, number>();
      for (const item of dto.items) {
        quantities.set(
          item.productId,
          (quantities.get(item.productId) ?? 0) + item.amount,
        );
      }

      const products = await this.productRepository.getPurchasableProducts([
        ...quantities.keys(),
      ]);
      const byId = new Map(products.map((p) => [p.productId, p]));

      for (const productId of quantities.keys()) {
        if (!byId.has(productId)) {
          throw new BusinessError(
            'Product unavailable',
            `Product ${productId} does not exist or is not for sale`,
          );
        }
      }

      const subtotal = [...quantities].reduce(
        (sum, [productId, amount]) =>
          sum + parseFloat(byId.get(productId).productPrice) * amount,
        0,
      );

      let couponId: string | undefined;
      let couponAmount = 0;
      if (dto.couponCode) {
        const coupon = await this.couponRepository.getCouponByCode(
          dto.couponCode,
        );
        if (!coupon || coupon.expiresAt.getTime() < Date.now()) {
          throw new BusinessError(
            'Invalid coupon',
            `Coupon ${dto.couponCode} is invalid or expired`,
          );
        }
        couponId = coupon.couponId;
        couponAmount = parseFloat(coupon.discountAmount);
      }

      const totals = computeTotals(
        subtotal,
        couponAmount,
        this.configService.getTaxRate(),
      );

      const orderId = randomUUID();
      await this.orderRepository.createOrderWithItems(
        {
          orderId,
          orderProductTotal: totals.productTotal.toString(),
          taxes: totals.taxes.toString(),
          couponId,
          status: 'pending',
        },
        [...quantities].map(([productId, amount]) => ({
          productId,
          amount: amount.toString(),
          priceAtPurchase: byId.get(productId).productPrice,
        })),
      );

      return this.orderRepository.getOrderWithProducts(orderId);
    } catch (e) {
      if (e instanceof CustomError) throw e;
      throw new BusinessError(
        'Unable to create order',
        (e as Error).message ?? 'Unknown error',
      );
    }
  }

  async setStatus(orderId: string, status: string): Promise<void> {
    await this.orderRepository.setOrderStatus(orderId, status);
  }

  /** Internal use only (no HTTP route): links payment, user and address. */
  async modifyProcessedOrder(updateOrder: UpdateOrderDTO): Promise<void> {
    const updated = await this.orderRepository.updateOrder(
      updateOrder.getOrder(),
    );
    if (!updated) {
      throw new BusinessError(
        'Unable to modify order',
        `Failed to update order: ${updateOrder.orderId}`,
      );
    }
  }
}
