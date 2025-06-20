import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CouponRecord } from 'src/modules/datasource';
import {
  ControllerResponse,
  handleControllerError,
  SuccessResponse,
  validatePayload,
} from 'src/utils/response';
import { CouponService } from '../services/Coupon.service';
import { LoggingService } from 'src/modules/logging';
import { CreateCouponDTO } from '../types';
import { ControllerError } from 'src/types';

@Controller('coupon')
export class CouponController {
  constructor(
    private readonly couponService: CouponService,
    private readonly logger: LoggingService,
  ) {}
  @Post('create')
  async createCoupon(@Body() body): Promise<ControllerResponse<CouponRecord>> {
    try {
      const payload = await validatePayload(CreateCouponDTO, body);
      const coupon = await this.couponService.createCoupon(payload);
      return SuccessResponse.send(coupon);
    } catch (e) {
      return handleControllerError(e, this.logger);
    }
  }

  @Get('validate')
  async validateCoupon(
    @Query('couponCode') couponCode: string,
  ): Promise<ControllerResponse<CouponRecord>> {
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
