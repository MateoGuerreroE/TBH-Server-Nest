import { Injectable } from '@nestjs/common';
import * as schema from '../schema/schema';
import { DataSourceClient } from '../DataSourceClient';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { IAddressRecord, ICreateAddress } from 'tbh-shared-types';

@Injectable()
export class AddressRepository {
  private client: NeonHttpDatabase<typeof schema>;
  constructor(private readonly datasource: DataSourceClient) {
    this.client = this.datasource.getClient();
  }

  async createAddress(data: ICreateAddress): Promise<IAddressRecord> {
    const result = await this.client
      .insert(schema.addressTable)
      .values(data)
      .returning();

    return result[0];
  }
}
