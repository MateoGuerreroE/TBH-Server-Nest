import { Module } from '@nestjs/common';
import { LoggingModule } from '../logging/index';
import { DatasourceModule } from '../datasource/index';

import { AccessModule } from '../access/index';
import { ConfigModule } from '../config/index';
import { OrderController, PaymentController } from './controller/index';
import {
  MercadoLibreService,
  OrderManagementService,
  PaymentService,
} from './services/index';
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
