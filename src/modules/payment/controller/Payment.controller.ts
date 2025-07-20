import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PaymentService } from '../services/Payment.service';
import { LoggingService } from 'src/modules/logging';
import {
  ControllerResponse,
  handleControllerError,
  SuccessResponse,
  validatePayload,
} from 'src/utils/response';
import { ProcessPaymentDTO } from '../types';
import { ControllerError } from 'src/types';
import { IPaymentRecord } from 'tbh-shared-types';

@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly logger: LoggingService,
  ) {}

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
