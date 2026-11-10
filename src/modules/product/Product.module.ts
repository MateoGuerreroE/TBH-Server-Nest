import { Module } from '@nestjs/common';
import { LoggingModule } from '../logging/index';
import {
  CategoryService,
  ProductService,
  SubCategoryService,
  TrendsService,
} from './services/index';
import { DatasourceModule } from '../datasource/index';
import {
  CategoryController,
  ProductController,
  SubCategoryController,
  TrendsController,
} from './controller/index';

@Module({
  imports: [LoggingModule.forContext('ProductModule'), DatasourceModule],
  providers: [
    ProductService,
    CategoryService,
    SubCategoryService,
    TrendsService,
  ],
  controllers: [
    ProductController,
    CategoryController,
    SubCategoryController,
    TrendsController,
  ],
  exports: [],
})
export class ProductModule {}
