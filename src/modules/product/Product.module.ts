import { Module } from '@nestjs/common';
import { LoggingModule } from '../logging';
import { CategoryService, ProductService } from './services';
import { ProductController } from './controller/Product.controller';
import { DatasourceModule } from '../datasource';
import { CategoryController } from './controller/Category.controller';
import { SubCategoryController } from './controller';
import { SubCategoryService } from './services/SubCategory.service';

@Module({
  imports: [LoggingModule.forContext('ProductModule'), DatasourceModule],
  providers: [ProductService, CategoryService, SubCategoryService],
  controllers: [ProductController, CategoryController, SubCategoryController],
  exports: [],
})
export class ProductModule {}
