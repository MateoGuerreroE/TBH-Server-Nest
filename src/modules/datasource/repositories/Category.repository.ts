import { Injectable } from '@nestjs/common';
import * as schema from '../schema/schema';
import { DataSourceClient } from '../DataSourceClient';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { CategoryRecord, CategoryToCreate, CategoryToUpdate } from '../types';
import { eq, inArray, sql } from 'drizzle-orm';
import { generateBatchSQL } from '../utils/utils';

@Injectable()
export class CategoryRepository {
  private client: NeonHttpDatabase<typeof schema>;
  constructor(private readonly datasource: DataSourceClient) {
    this.client = this.datasource.getClient();
  }

  async getAllCategories(): Promise<CategoryRecord[]> {
    return this.client.query.categoryTable.findMany({
      with: {
        subCategories: {},
      },
    });
  }

  async createCategory(data: CategoryToCreate): Promise<CategoryRecord> {
    const result = await this.client
      .insert(schema.categoryTable)
      .values({
        ...data,
        updatedBy: data.createdBy,
      })
      .returning();

    return result[0];
  }

  async updateCategory(data: CategoryToUpdate): Promise<CategoryRecord | null> {
    const { categoryId, ...updatedData } = data;
    const result = await this.client
      .update(schema.categoryTable)
      .set(updatedData)
      .where(eq(schema.categoryTable.categoryId, categoryId))
      .returning();

    return result[0] ?? null;
  }

  async updateBatchCategories(
    data: CategoryToUpdate[],
    updatedBy: string,
  ): Promise<boolean> {
    const batchSQL = generateBatchSQL<CategoryToUpdate>(
      'categories',
      'categoryId',
      data,
      updatedBy,
    );

    const updates = await this.client.execute(batchSQL);
    return !!updates.rowCount;
  }

  async deleteCategory(
    categoryId: string,
    updatedBy: string,
  ): Promise<boolean> {
    const result = await this.client
      .update(schema.categoryTable)
      .set({ deletedAt: new Date(), updatedBy })
      .where(eq(schema.categoryTable.categoryId, categoryId));

    return !!result.rowCount;
  }

  async verifyCategoriesExist(categoryIds: string[]): Promise<number> {
    const countResult = await this.client
      .select({
        count: sql<number>`count(*)`,
      })
      .from(schema.categoryTable)
      .where(inArray(schema.categoryTable.categoryId, categoryIds));

    return Number(countResult[0]?.count ?? 0);
  }
}
