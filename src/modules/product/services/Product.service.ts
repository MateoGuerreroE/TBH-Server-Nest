import { Injectable } from '@nestjs/common';
import { ProductRepository } from 'src/modules/datasource';
import { LoggingService } from 'src/modules/logging';
import { BusinessError } from 'src/types';
import { UpdateProductDTO, UpdateProductObjDTO } from '../types';
import { filterProductResult } from '../utils/utils';
import {
  ICreateProduct,
  IProductRecord,
  IProductWithRelations,
  ProductFilters,
} from 'tbh-shared-types';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly logger: LoggingService,
  ) {}

  async getAllProducts(): Promise<IProductRecord[]> {
    this.logger.debug('Fetching all products');
    return this.productRepository.getAllProduct();
  }

  async getFilteredProducts(
    filters: ProductFilters,
  ): Promise<IProductWithRelations[]> {
    const result: IProductWithRelations[] = [];

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

  async getProductById(productId: string): Promise<IProductRecord> {
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

  async createProduct(product: ICreateProduct): Promise<IProductRecord> {
    const productToCreate: ICreateProduct = {
      ...product,
      productTags: product.productTags || [],
      productPrice: product.productPrice,
      stock: product.stock || 0,
      discount: product.discount ? product.discount : 0,
    };

    this.logger.debug(
      `Creating product with name: ${product.productName} and price: ${product.productPrice}`,
    );

    return this.productRepository.createProductRecord(productToCreate);
  }

  async updateProductBatch(
    updatedProducts: UpdateProductDTO[],
    updatedBy: string,
  ): Promise<boolean> {
    const productIds = updatedProducts.map((p) => p.productId);
    this.logger.debug(`Verifying existence of products to update`);
    const existingProducts =
      await this.productRepository.verifyProductsExist(productIds);

    if (existingProducts !== updatedProducts.length) {
      this.logger.warn(
        `Not all products exist for update. Expected: ${updatedProducts.length}, Found: ${existingProducts}`,
      );
      throw new BusinessError(
        `Unable to update products`,
        `Some products do not exist or have no changes to apply`,
      );
    }

    this.logger.debug(`Updating products in batch`);
    const updates = await this.productRepository.updateBatchProducts(
      updatedProducts,
      updatedBy,
    );

    return updates;
  }

  async updateProductObjects(
    productId: string,
    objectsToUpdate: UpdateProductObjDTO,
    updatedBy: string,
  ) {
    if (Object.keys(objectsToUpdate).length === 0) {
      this.logger.warn(`No objects to update for product ID: ${productId}`);
      throw new BusinessError(
        `No objects to update`,
        `No objects provided for update in product with ID ${productId}`,
      );
    }
    const updates = await this.productRepository.updateProductObjects(
      productId,
      objectsToUpdate,
      updatedBy,
    );

    if (!updates) {
      this.logger.warn(`No updates made for product ID: ${productId}`);
      throw new BusinessError(
        `Unable to update product objects`,
        `Product with ID ${productId} does not exist or no changes were made`,
      );
    }

    return true;
  }

  async deleteProduct(productId: string, deletedBy: string): Promise<boolean> {
    try {
      this.logger.debug(`Deleting product with ID: ${productId}`);
      const product = await this.productRepository.getProductById(productId);
      if (!product) {
        this.logger.warn(`Product with ID ${productId} not found for deletion`);
        throw new BusinessError(
          `Unable to delete product`,
          `Product with ID ${productId} does not exist`,
        );
      }
      await this.productRepository.deleteProduct(productId, deletedBy);
      return true;
    } catch (e) {
      this.logger.warn(`Unable to delete product: ${e.message}`);
      return false;
    }
  }

  async __devCreateProducts(
    products: Omit<ICreateProduct, 'createdBy'>[],
  ): Promise<number> {
    this.logger.debug(`Creating multiple products in dev mode`);
    try {
      const result = await this.productRepository.__createProducts(
        products.map((p) => ({
          ...p,
          productTags: p.productTags || [],
          productPrice: p.productPrice,
          stock: p.stock || 0,
          discount: p.discount ? p.discount : 0,
          createdBy: process.env.MASTER_ADMIN_ID,
          updatedBy: process.env.MASTER_ADMIN_ID,
        })),
      );
      return result;
    } catch (e) {
      console.log(e);
      this.logger.error(`Error creating products in dev mode`);
      throw new BusinessError(
        `Unable to create products`,
        `An error occurred while creating products in dev mode`,
      );
    }
  }
}
