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

@Injectable()
export class ProductRepository {
  private client: NeonHttpDatabase<typeof schema>;
  constructor(private readonly datasource: DataSourceClient) {
    this.client = this.datasource.getClient();
  }

  async getAllProduct(): Promise<ProductRecord[]> {
    return this.client.query.productTable.findMany({
      where: (product, { isNull }) => isNull(product.deletedAt),
      with: {
        subCategory: {},
      },
    });
  }

  async getAllProductsWithSubCategoryId(
    subCategoryId: string,
  ): Promise<ProductWithSubCategory[]> {
    return this.client.query.productTable.findMany({
      where: (product, { and, eq, isNull }) =>
        and(
          eq(product.subCategoryId, subCategoryId),
          isNull(product.deletedAt),
        ),
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

  async __createProducts(productData: CreateProductData[]): Promise<number> {
    const insertedProducts = await this.client
      .insert(schema.productTable)
      .values(productData);

    return insertedProducts.rowCount;
  }

  async createProductRecord(
    productData: CreateProductData,
  ): Promise<ProductRecord> {
    const newProduct = await this.client
      .insert(schema.productTable)
      .values(productData)
      .returning();

    return this.client.query.productTable.findFirst({
      where: eq(schema.productTable.productId, newProduct[0].productId),
      with: {
        subCategory: true,
      },
    });
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
        updatedBy: author ?? 'e7bc3690-48ee-424f-9ce3-2572372bdb66', //! TODO REMOVE THIS
      })
      .where(eq(schema.productTable.productId, productId))
      .returning();

    return;
  }
}
