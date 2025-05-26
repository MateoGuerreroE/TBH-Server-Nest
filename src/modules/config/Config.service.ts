import { Injectable } from '@nestjs/common';
import 'dotenv/config';
import { DataError } from 'src/types';

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
}
