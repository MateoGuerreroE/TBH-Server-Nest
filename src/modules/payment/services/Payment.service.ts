import { PaymentRepository } from 'src/modules/datasource/repositories/Payment.repository';
import { LoggingService } from 'src/modules/logging';
import { ProcessPaymentDTO, UpdateOrderDTO } from '../types';
import {
  PaymentRecord,
  PaymentWithOrder,
} from 'src/modules/datasource/types/payment';
import { Injectable } from '@nestjs/common';
import { BusinessError } from 'src/types';
import { MercadoLibreService } from './MercadoLibre.service';
import { OrderManagementService } from './OrderManagement.service';
import { validatePayload } from 'src/utils/response';
import { UserService } from 'src/modules/access';
import { AddressRepository, OrderRecord } from 'src/modules/datasource';

@Injectable()
export class PaymentService {
  constructor(
    private readonly logger: LoggingService,
    private readonly paymentRepository: PaymentRepository,
    private readonly userService: UserService,
    private readonly orderManagementService: OrderManagementService,
    private readonly mercadoLibreService: MercadoLibreService,
    private readonly addressRepository: AddressRepository,
  ) {}

  async getPaymentById(paymentId: string): Promise<PaymentWithOrder> {
    const payment = await this.paymentRepository.getPaymentWithOrder(paymentId);
    if (!payment) {
      throw new BusinessError(
        'Payment not found',
        'No payment record found for the provided ID',
      );
    }
    return payment;
  }

  async processPayment(data: ProcessPaymentDTO): Promise<PaymentRecord> {
    try {
      const { payment, orderId, shipping, addressId } = data;
      const order =
        await this.orderManagementService.getOrderWithProducts(orderId);

      const paymentResponse =
        await this.mercadoLibreService.createPayment(payment);
      const paymentAmount =
        parseFloat(order.orderProductTotal) + parseFloat(order.taxes);

      const paymentRecord = await this.paymentRepository.createPayment({
        paymentAmount: paymentAmount.toString(),
        orderId: order.orderId,
        status: paymentResponse.status,
        externalPaymentId: paymentResponse.id.toString(),
        externalResponse: paymentResponse,
      });

      const matchUser = await this.userService.getUserByEmailAddress(
        shipping.emailAddress,
      );

      const orderModifications: Partial<OrderRecord> = {
        orderId: order.orderId,
        paymentId: paymentRecord.paymentId,
      };

      if (matchUser.isOk()) {
        orderModifications.userId = matchUser.value.userId;
      } else {
        this.logger.warn(
          `User with email ${shipping.emailAddress} not found, visitor user will be created under received shipping information`,
        );

        const createdUser = await this.userService.createUser({
          firstName: shipping.fullName.split(' ')[0],
          lastName: shipping.fullName.split(' ')[1] || '',
          emailAddress: shipping.emailAddress,
        });

        orderModifications.userId = createdUser.userId;
      }

      if (!addressId) {
        this.logger.warn(`Creating address for order ${order.orderId}`);

        const newAddress = await this.addressRepository.createAddress({
          addressName: `Address for order ${order.orderId}`,
          mainAddress: shipping.address,
          city: shipping.city,
          notes: shipping.notes,
          userId: orderModifications.userId,
        });

        orderModifications.addressId = newAddress.addressId;
      } else {
        this.logger.debug(
          `Using existing address ID ${addressId} for order ${order.orderId}`,
        );
        orderModifications.addressId = addressId;
      }

      const orderToModify = await validatePayload(
        UpdateOrderDTO,
        orderModifications,
      );

      await this.orderManagementService.modifyProcessedOrder(orderToModify);

      return paymentRecord;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(message);
      throw new BusinessError('Unable to process payment', message);
    }
  }
}
