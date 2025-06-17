import { Module } from '@nestjs/common';
import { ConfigModule } from '../config';
import {
  CouponRepository,
  OrderRepository,
  UserRepository,
  PaymentRepository,
  AddressRepository,
  ProductRepository,
  CategoryRepository,
  SubCategoryRepository,
} from './repositories';
import { DataSourceClient } from './DataSourceClient';

@Module({
  imports: [ConfigModule],
  providers: [
    SubCategoryRepository,
    ProductRepository,
    UserRepository,
    AddressRepository,
    DataSourceClient,
    PaymentRepository,
    OrderRepository,
    CouponRepository,
    CategoryRepository,
  ],
  exports: [
    SubCategoryRepository,
    ProductRepository,
    AddressRepository,
    CategoryRepository,
    UserRepository,
    PaymentRepository,
    OrderRepository,
    CouponRepository,
  ],
})
export class DatasourceModule {}
