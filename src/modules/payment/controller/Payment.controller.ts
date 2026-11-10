import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaymentService } from '../services/Payment.service';
import { LoggingService } from '../../logging/index';
import {
  ControllerResponse,
  handleControllerError,
  SuccessResponse,
  validatePayload,
} from '../../../utils/response';
import { ProcessPaymentDTO } from '../types/index';
import { ControllerError } from '../../../types/index';
import type { IPaymentRecord } from 'tbh-shared-types';
import { Auth } from '../../access/auth/discriminator';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly logger: LoggingService,
  ) {}

  @Auth('visitor')
  @Post('process')
  async processPayment(
    @Body() body,
  ): Promise<ControllerResponse<IPaymentRecord>> {
    try {
      const payload = await validatePayload(ProcessPaymentDTO, body);
      const paymentResult = await this.paymentService.processPayment(payload);
      return SuccessResponse.send(paymentResult);
    } catch (error) {
      return handleControllerError(error, this.logger);
    }
  }

  @Auth('visitor')
  @Get(':paymentId')
  async getPaymentById(
    @Param('paymentId') paymentId: string,
  ): Promise<ControllerResponse<IPaymentRecord>> {
    try {
      if (!paymentId) {
        throw new ControllerError(
          'Validation Failed',
          'Payment ID is required',
        );
      }
      const payment = await this.paymentService.getPaymentById(paymentId);
      return SuccessResponse.send(payment);
    } catch (error) {
      return handleControllerError(error, this.logger);
    }
  }
}
