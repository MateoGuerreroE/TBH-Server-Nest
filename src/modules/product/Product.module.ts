import { Module } from '@nestjs/common';
import { LoggingModule } from '../logging';
import {
  CategoryService,
  ProductService,
  SubCategoryService,
  TrendsService,
} from './services';
import { DatasourceModule } from '../datasource';
import {
  CategoryController,
  ProductController,
  SubCategoryController,
  TrendsController,
} from './controller';

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
