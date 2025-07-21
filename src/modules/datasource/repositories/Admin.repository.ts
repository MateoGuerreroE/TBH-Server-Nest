import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '../schema/schema';
import { DataSourceClient } from '../DataSourceClient';
import { IAdminRecord } from 'tbh-shared-types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AdminRepository {
  private client: NeonHttpDatabase<typeof schema>;
  constructor(private readonly datasource: DataSourceClient) {
    this.client = this.datasource.getClient();
  }

  async getAdminById(adminId: string): Promise<IAdminRecord | null> {
    const result = await this.client.query.adminTable.findFirst({
      where: (admin, { eq }) => eq(admin.adminId, adminId),
    });

    return result ?? null;
  }
}
