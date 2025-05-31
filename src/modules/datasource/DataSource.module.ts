import { Module } from '@nestjs/common';
import { ConfigModule } from '../config';
import {
  CouponRepository,
  OrderRepository,
  UserRepository,
  PaymentRepository,
  AddressRepository,
} from './repositories';
import { DataSourceClient } from './DataSourceClient';

@Module({
  imports: [ConfigModule],
  providers: [
    UserRepository,
    AddressRepository,
    DataSourceClient,
    PaymentRepository,
    OrderRepository,
    CouponRepository,
  ],
  exports: [
    AddressRepository,
    UserRepository,
    PaymentRepository,
    OrderRepository,
    CouponRepository,
  ],
})
export class DatasourceModule {}
