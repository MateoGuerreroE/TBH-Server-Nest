import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/index';
import {
  CouponRepository,
  OrderRepository,
  UserRepository,
  PaymentRepository,
  AddressRepository,
  ProductRepository,
  CategoryRepository,
  SubCategoryRepository,
  AdminRepository,
} from './repositories/index';
import { DataSourceClient } from './DataSourceClient';

@Module({
  imports: [ConfigModule],
  providers: [
    AdminRepository,
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
    AdminRepository,
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
