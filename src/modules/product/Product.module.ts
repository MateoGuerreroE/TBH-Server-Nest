import { Module } from '@nestjs/common';
import { LoggingModule } from '../logging';
import { CategoryService, ProductService } from './services';
import { ProductController } from './controller/Product.controller';
import { DatasourceModule } from '../datasource';
import { CategoryController } from './controller/Category.controller';

@Module({
  imports: [LoggingModule.forContext('ProductModule'), DatasourceModule],
  providers: [ProductService, CategoryService],
  controllers: [ProductController, CategoryController],
  exports: [],
})
export class ProductModule {}
