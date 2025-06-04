import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AccessModule } from './modules/access/Access.module';
import { PaymentModule } from './modules/payment';
import { ProductModule } from './modules/product';

@Module({
  imports: [AccessModule, PaymentModule, ProductModule],
  providers: [AppService],
})
export class AppModule {}
