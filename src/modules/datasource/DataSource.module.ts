import { Module } from '@nestjs/common';
import { ConfigModule } from '../config';
import {
  CouponRepository,
  OrderRepository,
  UserRepository,
  PaymentRepository,
  AddressRepository,
  ProductRepository,
} from './repositories';
import { DataSourceClient } from './DataSourceClient';

@Module({
  imports: [ConfigModule],
  providers: [
    ProductRepository,
    UserRepository,
    AddressRepository,
    DataSourceClient,
    PaymentRepository,
    OrderRepository,
    CouponRepository,
  ],
  exports: [
    ProductRepository,
    AddressRepository,
    UserRepository,
    PaymentRepository,
    OrderRepository,
    CouponRepository,
  ],
})
export class DatasourceModule {}
