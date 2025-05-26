import { Injectable } from '@nestjs/common';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '../schema/schema';
import { DataSourceClient } from '../DataSourceClient';
import { ProductRecord, ProductWithSubCategory } from '../types/products';

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

  async getAllProductsWithSubCategory(): Promise<ProductWithSubCategory[]> {
    return this.client.query.productTable.findMany({
      with: {
        subCategory: true,
      },
    });
  }

  async getAllProductsWithSubCategoryId(
    subCategoryId: string,
  ): Promise<ProductRecord[]> {
    return this.client.query.productTable.findMany({
      where: (product, { eq }) => eq(product.subCategoryId, subCategoryId),
      with: {
        subCategory: {},
      },
    });
  }

  async getProductById(productId: string): Promise<ProductRecord | null> {
    return this.client.query.productTable.findFirst({
      where: (product, { eq }) => eq(product.productId, productId),
      with: {
        subCategory: {},
      },
    });
  }
}
