import { Module } from '@nestjs/common';
import { LoggingModule } from '../logging';
import { ProductService } from './services';
import { ProductController } from './controller/Product.controller';
import { DatasourceModule } from '../datasource';

@Module({
  imports: [LoggingModule.forContext('ProductModule'), DatasourceModule],
  providers: [ProductService],
  controllers: [ProductController],
  exports: [],
})
export class ProductModule {}
