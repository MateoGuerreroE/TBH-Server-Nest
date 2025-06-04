import { Injectable } from '@nestjs/common';
import { ProductRepository } from 'src/modules/datasource';
import {
  CreateProductData,
  ProductFilters,
  ProductRecord,
  ProductWithSubCategory,
} from 'src/modules/datasource/types/products';
import { LoggingService } from 'src/modules/logging';
import { BusinessError } from 'src/types';
import { CreateProductDTO } from '../types';
import { filterProductResult } from '../utils/utils';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly logger: LoggingService,
  ) {}

  async getAllProducts(): Promise<ProductRecord[]> {
    this.logger.debug('Fetching all products');
    return this.productRepository.getAllProduct();
  }

  async getFilteredProducts(
    filters: ProductFilters,
  ): Promise<ProductWithSubCategory[]> {
    const result: ProductWithSubCategory[] = [];

    if (filters.categoryId || filters.subCategoryId) {
      const { categoryId, subCategoryId } = filters;
      this.logger.debug(
        `Fetching products with categoryId: ${categoryId}, subCategoryId: ${subCategoryId}`,
      );
      const productList = categoryId
        ? await this.productRepository.getAllProductsFromCategoryId(categoryId)
        : await this.productRepository.getAllProductsWithSubCategoryId(
            subCategoryId,
          );

      if (categoryId && subCategoryId) {
        result.push(
          ...productList.filter(
            (p) =>
              p.subCategoryId === subCategoryId &&
              p.subCategory.categoryId === categoryId,
          ),
        );
      } else {
        result.push(...productList);
      }
    }

    if (filters.keyword || filters.minPrice || filters.maxPrice) {
      this.logger.debug('Applying public filters to products');
      const { keyword, minPrice, maxPrice } = filters;
      // If there're results mean there was a prev filter applied
      if (result.length) {
        return filterProductResult(result, {
          keyword,
          minPrice,
          maxPrice,
        });
      }
      return this.productRepository.getFilteredProducts({
        keyword,
        minPrice,
        maxPrice,
      });
    }
    return result;
  }

  async getProductById(productId: string): Promise<ProductRecord> {
    this.logger.debug(`Fetching product with ID: ${productId}`);
    const product = await this.productRepository.getProductById(productId);
    if (!product) {
      this.logger.warn(`Product with ID ${productId} not found`);
      throw new BusinessError(
        `Unable to find product`,
        `Product with ID ${productId} does not exist`,
      );
    }
    return product;
  }

  async createProduct(product: CreateProductDTO): Promise<ProductRecord> {
    const productToCreate: CreateProductData = {
      ...product,
      updatedBy: product.createdBy,
      productTags: product.productTags || [],
      productPrice: product.productPrice.toString(),
      stock: product.stock || 0,
      discount: product.discount ? product.discount.toString() : '0',
    };

    this.logger.debug(
      `Creating product with name: ${product.productName} and price: ${product.productPrice}`,
    );

    return this.productRepository.createProductRecord(productToCreate);
  }
}
