import { Injectable } from '@nestjs/common';
import { MercadoPagoConfig, Payment } from 'mercadopago';
import { ConfigService } from '../../config/index';
import { ExternalPaymentData, ExternalPaymentResponse } from '../types/index';
import { BusinessError } from '../../../types/index';

@Injectable()
export class MercadoLibreService {
  private paymentClient: Payment;
  constructor(private readonly configService: ConfigService) {
    const client = new MercadoPagoConfig({
      accessToken: this.configService.getMLAccessKey(),
    });
    this.paymentClient = new Payment(client);
  }

  async createPayment(
    paymentData: ExternalPaymentData,
    idempotencyKey: string,
  ): Promise<ExternalPaymentResponse> {
    try {
      const paymentResult = await this.paymentClient.create({
        body: paymentData,
        requestOptions: { idempotencyKey },
      });

      return paymentResult as ExternalPaymentResponse;
    } catch (error) {
      throw new BusinessError(
        'Unable to process payment',
        `ML Payment creation failed: ${error.message}`,
      );
    }
  }

  /** Source of truth for webhooks: never trust the notification body. */
  async getPayment(paymentId: string): Promise<ExternalPaymentResponse> {
    try {
      const result = await this.paymentClient.get({ id: paymentId });
      return result as unknown as ExternalPaymentResponse;
    } catch (error) {
      throw new BusinessError(
        'Unable to fetch payment',
        `ML Payment lookup failed: ${error.message}`,
      );
    }
  }
}
