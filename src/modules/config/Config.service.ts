import { Injectable } from '@nestjs/common';
import 'dotenv/config';
import { DataError } from '../../types/index';

@Injectable()
export class ConfigService {
  get<T>(key: string): T | undefined {
    return process.env[key] as T;
  }

  getDatabaseUrl(): string {
    const dbUrl = this.get<string>('DATABASE_URL');
    if (!dbUrl) throw new DataError('No database secret found');
    return dbUrl;
  }

  getFirebaseConfig() {
    return {
      projectId: 'tuhogarboreal',
      privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
      clientEmail: process.env.CLIENT_EMAIL,
    };
  }

  getJwtSecret() {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new DataError('No JWT Secret found');
    return secret;
  }

  getMLAccessKey(): string {
    const accessKey = this.get<string>('ML_ACCESS_TOKEN');
    if (!accessKey) throw new DataError('No Mercado Libre access key found');
    return accessKey;
  }

  /** Tax rate as a fraction (0.19 = 19%). Owned by the server. */
  getTaxRate(): number {
    const rate = parseFloat(this.get<string>('TAX_RATE') ?? '0.19');
    if (Number.isNaN(rate) || rate < 0 || rate >= 1) {
      throw new DataError('Invalid TAX_RATE');
    }
    return rate;
  }

  getMpWebhookSecret(): string | undefined {
    return this.get<string>('MP_WEBHOOK_SECRET');
  }

  /** Public base URL of this API, used for the MP notification_url. */
  getPublicApiUrl(): string | undefined {
    return this.get<string>('API_PUBLIC_URL');
  }
}
