import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  Param,
  Post,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
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

  /**
   * Public on purpose (no @Auth): authenticity comes from the MP signature.
   * Returns 5xx on processing errors so Mercado Pago retries.
   */
  @Post('webhook')
  @HttpCode(200)
  async webhook(
    @Query('data.id') queryDataId: string | undefined,
    @Body() body: { data?: { id?: string | number }; type?: string } | undefined,
    @Headers('x-signature') signature: string | undefined,
    @Headers('x-request-id') requestId: string | undefined,
  ): Promise<{ received: true }> {
    const dataId = queryDataId ?? body?.data?.id?.toString();
    if (
      !dataId ||
      !this.paymentService.verifyWebhookSignature(signature, requestId, dataId)
    ) {
      throw new UnauthorizedException('Invalid webhook signature');
    }

    const topic = body?.type ?? 'payment';
    if (topic !== 'payment') return { received: true };

    try {
      await this.paymentService.syncPaymentFromMp(dataId);
    } catch (error) {
      this.logger.error(
        `Webhook sync failed for ${dataId}: ${(error as Error).message}`,
      );
      throw error;
    }
    return { received: true };
  }
}
