import { Injectable } from '@nestjs/common';
import { CouponRepository } from '../../datasource/index';
import { LoggingService } from '../../logging/index';
import { BusinessError } from '../../../types/index';
import { CreateCouponDTO } from '../types/index';
import type { ICouponRecord } from 'tbh-shared-types';

@Injectable()
export class CouponService {
  constructor(
    private readonly couponRepository: CouponRepository,
    private readonly logger: LoggingService,
  ) {}

  async getCouponByCode(couponCode: string): Promise<ICouponRecord> {
    const coupon = await this.couponRepository.getCouponByCode(couponCode);
    if (!coupon) {
      this.logger.error('No coupon found');
      throw new BusinessError(
        'Unable to fetch coupon',
        `Coupon not found with code: ${couponCode}`,
      );
    }

    return coupon;
  }

  async createCoupon(data: CreateCouponDTO): Promise<ICouponRecord> {
    try {
      const coupon = await this.couponRepository.createCoupon(data.getCoupon());
      return coupon;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(message);
      throw new BusinessError('Unable to create coupon', message);
    }
  }
}
