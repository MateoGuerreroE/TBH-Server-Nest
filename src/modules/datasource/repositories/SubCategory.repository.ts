import { Injectable } from '@nestjs/common';
import * as schema from '../schema/schema';
import { DataSourceClient } from '../DataSourceClient';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import {
  SubCategoryRecord,
  SubCategoryToCreate,
  SubCategoryToUpdate,
} from '../types';
import { eq, inArray, sql } from 'drizzle-orm';
import { generateBatchSQL } from '../utils/utils';

@Injectable()
export class SubCategoryRepository {
  private client: NeonHttpDatabase<typeof schema>;
  constructor(private readonly datasource: DataSourceClient) {
    this.client = this.datasource.getClient();
  }

  async getAllSubcategories(): Promise<SubCategoryRecord[]> {
    return this.client.query.subcategoryTable.findMany({
      with: {
        category: {},
      },
    });
  }

  async createSubcategory(
    data: SubCategoryToCreate,
  ): Promise<SubCategoryRecord> {
    const result = await this.client
      .insert(schema.subcategoryTable)
      .values({
        ...data,
        updatedBy: data.createdBy,
      })
      .returning();

    return result[0];
  }

  async updateBatchSubcategories(
    data: SubCategoryToUpdate[],
    updatedBy: string,
  ): Promise<boolean> {
    const batchSQL = generateBatchSQL<SubCategoryToUpdate>(
      'categories',
      'categoryId',
      data,
      updatedBy,
    );

    const updates = await this.client.execute(batchSQL);
    return !!updates.rowCount;
  }

  async deleteSubCategory(
    subCategoryId: string,
    updatedBy: string,
  ): Promise<boolean> {
    const result = await this.client
      .update(schema.subcategoryTable)
      .set({ deletedAt: new Date(), updatedBy })
      .where(eq(schema.subcategoryTable.subCategoryId, subCategoryId));

    return !!result.rowCount;
  }

  async verifySubCategoriesExist(subCategoryIds: string[]): Promise<number> {
    const countResult = await this.client
      .select({
        count: sql<number>`count(*)`,
      })
      .from(schema.subcategoryTable)
      .where(inArray(schema.subcategoryTable.subCategoryId, subCategoryIds));

    return Number(countResult[0]?.count ?? 0);
  }
}
