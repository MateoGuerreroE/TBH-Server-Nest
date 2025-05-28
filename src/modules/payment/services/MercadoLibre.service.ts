import { Injectable } from '@nestjs/common';
import MercadoPagoConfig, { Payment } from 'mercadopago';
import { ConfigService } from 'src/modules/config';
import { ExternalPaymentData, ExternalPaymentResponse } from '../types';
import { BusinessError } from 'src/types';

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
  ): Promise<ExternalPaymentResponse> {
    try {
      const paymentResult = await this.paymentClient.create({
        body: paymentData,
      });

      return paymentResult as ExternalPaymentResponse;
    } catch (error) {
      throw new BusinessError(
        'Unable to process payment',
        `ML Payment creation failed: ${error.message}`,
      );
    }
  }
}
