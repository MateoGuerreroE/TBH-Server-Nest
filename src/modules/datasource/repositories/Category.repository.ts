import { Injectable } from '@nestjs/common';
import * as schema from '../schema/schema';
import { DataSourceClient } from '../DataSourceClient';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import { eq, inArray, sql } from 'drizzle-orm';
import { generateBatchSQL } from '../utils/utils';
import {
  ICategoryRecord,
  ICategoryWithRelations,
  ICreateCategory,
  IUpdateCategory,
} from 'tbh-shared-types';

@Injectable()
export class CategoryRepository {
  private client: NeonHttpDatabase<typeof schema>;
  constructor(private readonly datasource: DataSourceClient) {
    this.client = this.datasource.getClient();
  }

  async getAllCategories(): Promise<ICategoryRecord[]> {
    return this.client.query.categoryTable.findMany({
      where: (category, { isNull }) => isNull(category.deletedAt),
      with: {
        subCategories: {},
      },
    });
  }

  async getInitialCategories(): Promise<ICategoryWithRelations[]> {
    return this.client.query.categoryTable.findMany({
      where: (category, { isNull }) => isNull(category.deletedAt),
      with: {
        subCategories: {
          with: {
            products: {
              limit: 5,
              orderBy: (product, { desc }) => desc(product.createdAt),
            },
          },
        },
      },
    });
  }

  async getCategoryById(categoryId: string): Promise<ICategoryRecord | null> {
    const result = await this.client.query.categoryTable.findFirst({
      where: eq(schema.categoryTable.categoryId, categoryId),
      with: {
        subCategories: {},
      },
    });

    return result ?? null;
  }

  async createCategory(data: ICreateCategory): Promise<ICategoryRecord> {
    const result = await this.client
      .insert(schema.categoryTable)
      .values({
        ...data,
        updatedBy: data.createdBy,
      })
      .returning();

    return result[0];
  }

  async updateBatchCategories(
    data: IUpdateCategory[],
    updatedBy: string,
  ): Promise<boolean> {
    const batchSQL = generateBatchSQL<IUpdateCategory>(
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
      .set({ deletedAt: new Date(), updatedBy, isEnabled: false })
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
