import { Injectable } from '@nestjs/common';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '../schema/schema';
import { DataSourceClient } from '../DataSourceClient';
import {
  CreateProductData,
  ProductPublicFilters,
  ProductRecord,
  ProductWithSubCategory,
  ProductWithSubCategoryAndCategory,
  UpdateProductAttributeData,
  UpdateProductObjectData,
} from '../types/products';
import { eq, inArray, sql } from 'drizzle-orm';
import { generateBatchSQL } from '../utils/utils';
import { PgDialect } from 'drizzle-orm/pg-core';

@Injectable()
export class ProductRepository {
  private client: NeonHttpDatabase<typeof schema>;
  constructor(private readonly datasource: DataSourceClient) {
    this.client = this.datasource.getClient();
  }

  async getAllProduct(): Promise<ProductRecord[]> {
    return this.client.query.productTable.findMany({
      with: {
        subCategory: {},
      },
    });
  }

  async getAllProductsWithSubCategoryId(
    subCategoryId: string,
  ): Promise<ProductWithSubCategory[]> {
    return this.client.query.productTable.findMany({
      where: (product, { eq }) => eq(product.subCategoryId, subCategoryId),
      with: {
        subCategory: true,
      },
    });
  }

  async getAllProductsFromCategoryId(
    categoryId: string,
  ): Promise<ProductWithSubCategory[]> {
    const subCategories = await this.client.query.subcategoryTable.findMany({
      where: (subcategory, { eq }) => eq(subcategory.categoryId, categoryId),
      with: {
        category: true,
      },
    });

    return this.client.query.productTable.findMany({
      where: (product, { inArray }) =>
        inArray(
          product.subCategoryId,
          subCategories.map((sc) => sc.subCategoryId),
        ),
      with: {
        subCategory: true,
      },
    });
  }

  async getProductById(
    productId: string,
  ): Promise<ProductWithSubCategoryAndCategory | null> {
    return this.client.query.productTable.findFirst({
      where: eq(schema.productTable.productId, productId),
      with: {
        subCategory: {
          with: {
            category: true,
          },
        },
      },
    });
  }

  async createProductRecord(
    productData: CreateProductData,
  ): Promise<ProductRecord> {
    const newProduct = await this.client
      .insert(schema.productTable)
      .values(productData)
      .returning();

    return newProduct[0];
  }

  async getFilteredProducts(
    filters: ProductPublicFilters,
  ): Promise<ProductWithSubCategory[]> {
    console.log(`Applying filters: ${JSON.stringify(filters)}`);
    return this.client.query.productTable.findMany({
      where: (product, { and }) =>
        and(
          ...(filters.keyword
            ? [
                sql`(
            (${product.productDescription} ->> 'short') ILIKE ${`%${filters.keyword}%`} OR
            (${product.productDescription} ->> 'content') ILIKE ${`%${filters.keyword}%`} OR
            ${product.productTags} @> ARRAY[${filters.keyword}]
          )`,
              ]
            : []),
          ...(filters.minPrice || filters.maxPrice
            ? [
                sql`${product.productPrice} >= ${filters.minPrice ?? 0}`,
                sql`${product.productPrice} <= ${filters.maxPrice ?? 999999}`,
              ]
            : []),
        ),

      with: {
        subCategory: true,
      },
    });
  }

  async updateBatchProducts(
    products: UpdateProductAttributeData[],
    updatedBy: string,
  ): Promise<boolean> {
    const batchSQL = generateBatchSQL<UpdateProductAttributeData>(
      'products',
      'productId',
      products,
      updatedBy,
    );

    const test = new PgDialect();
    const printable = test.sqlToQuery(batchSQL);
    console.log(printable.sql, printable.params);

    const updates = await this.client.execute(batchSQL);
    return !!updates.rowCount;
  }

  async verifyProductsExist(productIds: string[]): Promise<number> {
    const countResult = await this.client
      .select({
        count: sql<number>`count(*)`,
      })
      .from(schema.productTable)
      .where(inArray(schema.productTable.productId, productIds));

    return Number(countResult[0]?.count ?? 0);
  }

  async updateProductObjects(
    productId: string,
    objects: UpdateProductObjectData,
  ): Promise<ProductRecord | null> {
    const updatedProduct = await this.client
      .update(schema.productTable)
      .set({ ...objects, updatedAt: new Date() })
      .where(eq(schema.productTable.productId, productId))
      .returning();

    return updatedProduct[0] || null;
  }

  async deleteProduct(productId: string, author?: string): Promise<void> {
    await this.client
      .update(schema.productTable)
      .set({
        isActive: false,
        deletedAt: new Date(),
        updatedBy: author ?? 'SYSTEM',
      })
      .where(eq(schema.productTable.productId, productId))
      .returning();

    return;
  }
}
