import { Module } from '@nestjs/common';
import { LoggingModule } from '../logging';

@Module({
  imports: [LoggingModule.forContext('ProductModule')],
  providers: [],
  exports: [],
})
export class ProductModule {}
