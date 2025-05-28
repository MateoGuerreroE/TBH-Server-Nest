import { PaymentRepository } from 'src/modules/datasource/repositories/Payment.repository';
import { LoggingService } from 'src/modules/logging';
import { ProcessPaymentDTO, UpdateOrderDTO } from '../types';
import { PaymentRecord } from 'src/modules/datasource/types/payment';
import { Injectable } from '@nestjs/common';
import { BusinessError } from 'src/types';
import { MercadoLibreService } from './MercadoLibre.service';
import { OrderManagementService } from './OrderManagement.service';
import { validatePayload } from 'src/utils/response';

@Injectable()
export class PaymentService {
  constructor(
    private readonly logger: LoggingService,
    private readonly paymentRepository: PaymentRepository,
    private readonly orderManagementService: OrderManagementService,
    private readonly mercadoLibreService: MercadoLibreService,
  ) {}

  async getPaymentById(paymentId: string) {
    return this.paymentRepository.getPaymentById(paymentId);
  }

  async processPayment(data: ProcessPaymentDTO): Promise<PaymentRecord> {
    try {
      const { payment, orderId } = data;
      const order =
        await this.orderManagementService.getOrderWithProducts(orderId);

      const paymentResponse =
        await this.mercadoLibreService.createPayment(payment);
      const paymentAmount = order.orderProductTotal + order.taxes;

      const paymentRecord = await this.paymentRepository.createPayment({
        paymentAmount,
        orderId: order.orderId,
        status: paymentResponse.status,
        externalPaymentId: paymentResponse.id.toString(),
        externalResponse: paymentResponse,
      });

      // MISSING ADDRESS FLOW HERE USING SHIPPING DATA

      const orderToModify = await validatePayload(UpdateOrderDTO, {
        orderId: order.orderId,
        paymentId: paymentRecord.paymentId,
      });

      await this.orderManagementService.modifyProcessedOrder(orderToModify);

      return paymentRecord;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(message);
      throw new BusinessError('Unable to process payment', message);
    }
  }
}
