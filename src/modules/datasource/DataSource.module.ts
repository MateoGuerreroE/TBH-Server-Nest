import { Module } from '@nestjs/common';
import { ConfigModule } from '../config';
import {
  CouponRepository,
  OrderRepository,
  UserRepository,
  PaymentRepository,
} from './repositories';
import { DataSourceClient } from './DataSourceClient';

@Module({
  imports: [ConfigModule],
  providers: [
    UserRepository,
    DataSourceClient,
    PaymentRepository,
    OrderRepository,
    CouponRepository,
  ],
  exports: [
    UserRepository,
    PaymentRepository,
    OrderRepository,
    CouponRepository,
  ],
})
export class DatasourceModule {}
