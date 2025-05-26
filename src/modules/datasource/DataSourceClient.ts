import { Injectable } from '@nestjs/common';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { ConfigService } from '../config';
import * as schema from './schema/schema';

@Injectable()
export class DataSourceClient {
  dbClient: NeonHttpDatabase<typeof schema>;
  constructor(private readonly configService: ConfigService) {
    this.dbClient = drizzle(this.configService.getDatabaseUrl(), { schema });
  }

  getClient() {
    return this.dbClient;
  }
}
