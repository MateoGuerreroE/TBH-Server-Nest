import { Module } from '@nestjs/common';
import { LoggingModule } from '../logging';
import { DatasourceModule } from '../datasource';

import { AccessModule } from '../access';
import { ConfigModule } from '../config';
import { OrderController, PaymentController } from './controller';
import {
  MercadoLibreService,
  OrderManagementService,
  PaymentService,
} from './services';
import { CouponController } from './controller/Coupon.controller';
import { CouponService } from './services/Coupon.service';

@Module({
  imports: [
    LoggingModule.forContext('PaymentModule'),
    DatasourceModule,
    AccessModule,
    ConfigModule,
  ],
  controllers: [PaymentController, OrderController, CouponController],
  providers: [
    PaymentService,
    OrderManagementService,
    MercadoLibreService,
    CouponService,
  ],
  exports: [],
})
export class PaymentModule {}
