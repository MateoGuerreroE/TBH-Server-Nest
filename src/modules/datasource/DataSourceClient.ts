import { Injectable, Logger } from '@nestjs/common';
import { drizzle, NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { ConfigService } from '../config/index';
import * as schema from './schema/schema';

@Injectable()
export class DataSourceClient {
  private readonly logger = new Logger(DataSourceClient.name);
  dbClient: NeonHttpDatabase<typeof schema>;

  constructor(private readonly configService: ConfigService) {
    this.dbClient = drizzle(this.configService.getDatabaseUrl(), {
      schema,
      // logger: {
      //   logQuery: (query, params) => {
      //     this.logger.debug(`SQL Query: ${query}`);
      //     this.logger.debug(`Parameters: ${JSON.stringify(params)}`);
      //   },
      // },
    });
  }

  getClient() {
    return this.dbClient;
  }
}
