import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  ControllerResponse,
  handleControllerError,
  SuccessResponse,
  validatePayload,
} from '../../../utils/response';
import { CouponService } from '../services/Coupon.service';
import { LoggingService } from '../../logging/index';
import { CreateCouponDTO } from '../types/index';
import { ControllerError } from '../../../types/index';
import type { ICouponRecord } from 'tbh-shared-types';
import { Auth } from '../../access/auth/discriminator';

@Controller('coupon')
export class CouponController {
  constructor(
    private readonly couponService: CouponService,
    private readonly logger: LoggingService,
  ) {}

  @Auth('admin')
  @Post('create')
  async createCoupon(@Body() body): Promise<ControllerResponse<ICouponRecord>> {
    try {
      const payload = await validatePayload(CreateCouponDTO, body);
      const coupon = await this.couponService.createCoupon(payload);
      return SuccessResponse.send(coupon);
    } catch (e) {
      return handleControllerError(e, this.logger);
    }
  }

  @Auth('visitor')
  @Get('validate')
  async validateCoupon(
    @Query('couponCode') couponCode: string,
  ): Promise<ControllerResponse<ICouponRecord>> {
    try {
      if (!couponCode) {
        throw new ControllerError(
          'Invalid coupon code',
          'Coupon code is required',
        );
      }
      const coupon = await this.couponService.getCouponByCode(couponCode);
      return SuccessResponse.send(coupon);
    } catch (e) {
      return handleControllerError(e, this.logger);
    }
  }
}
