import { Module } from '@nestjs/common';
import { LoggingModule } from '../logging';
import { DatasourceModule } from '../datasource';

import { AccessModule } from '../access';
import { ConfigModule } from '../config';
import { OrderController, PaymentController } from './controller';
import {
  MercadoLibreService,
  OrderManagementService,
  PaymentService,
} from './services';

@Module({
  imports: [
    LoggingModule.forContext('PaymentModule'),
    DatasourceModule,
    AccessModule,
    ConfigModule,
  ],
  controllers: [PaymentController, OrderController],
  providers: [PaymentService, OrderManagementService, MercadoLibreService],
  exports: [],
})
export class PaymentModule {}
