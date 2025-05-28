import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { AccessModule } from './modules/access/Access.module';
import { PaymentModule } from './modules/payment';

@Module({
  imports: [AccessModule, PaymentModule],
  providers: [AppService],
})
export class AppModule {}
