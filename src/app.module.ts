import { Module } from '@nestjs/common';
import { AccessModule } from './modules/access/Access.module';
import { PaymentModule } from './modules/payment';
import { ProductModule } from './modules/product';

@Module({
  imports: [AccessModule, PaymentModule, ProductModule],
  providers: [],
})
export class AppModule {}
