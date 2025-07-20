import { Injectable } from '@nestjs/common';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '../schema/schema';
import { DataSourceClient } from '../DataSourceClient';
import { eq } from 'drizzle-orm';
import { ICouponRecord, ICreateCoupon, IUpdateCoupon } from 'tbh-shared-types';

@Injectable()
export class CouponRepository {
  private client: NeonHttpDatabase<typeof schema>;
  constructor(private readonly datasource: DataSourceClient) {
    this.client = this.datasource.getClient();
  }

  async getAllCoupons(): Promise<ICouponRecord[]> {
    return this.client.query.couponTable.findMany({
      orderBy: (coupon, { desc }) => desc(coupon.expiresAt),
    });
  }

  async getCouponById(couponId: string): Promise<ICouponRecord | null> {
    return this.client.query.couponTable.findFirst({
      where: (coupon, { eq }) => eq(coupon.couponId, couponId),
    });
  }

  async getCouponByCode(couponCode: string): Promise<ICouponRecord | null> {
    return this.client.query.couponTable.findFirst({
      where: (coupon, { eq }) => eq(coupon.couponCode, couponCode),
    });
  }

  async createCoupon(data: ICreateCoupon): Promise<ICouponRecord> {
    const result = await this.client
      .insert(schema.couponTable)
      .values({
        ...data,
        expiresAt: data.expiresAt || new Date(Date.now() + 86400 * 1000),
      })
      .returning();
    return result[0];
  }

  async updateCoupon(data: IUpdateCoupon): Promise<ICouponRecord | null> {
    const { couponId, ...updateData } = data;
    const result = await this.client
      .update(schema.couponTable)
      .set(updateData)
      .where(eq(schema.couponTable.couponId, couponId))
      .returning();
    return result[0] || null;
  }
}
