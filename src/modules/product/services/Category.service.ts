import { Injectable } from '@nestjs/common';
import { CategoryRepository } from '../../datasource';
import { LoggingService } from 'src/modules/logging';
import { BusinessError } from 'src/types';
import {
  ICategoryRecord,
  ICategoryWithRelations,
  ICreateCategory,
  IUpdateCategory,
} from 'tbh-shared-types';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly logger: LoggingService,
  ) {}

  async getAllCategories(): Promise<ICategoryRecord[]> {
    this.logger.debug(`Fetching all categories`);
    const categories = await this.categoryRepository.getAllCategories();
    this.logger.debug(`Found ${categories.length} categories`);
    return categories;
  }

  async getInitialCategories(): Promise<ICategoryWithRelations[]> {
    this.logger.debug(`Fetching initial categories with products`);
    const categories = await this.categoryRepository.getInitialCategories();
    this.logger.debug(`Found ${categories.length} initial categories`);
    return categories;
  }

  async updateCategoryBatch(
    data: IUpdateCategory[],
    updatedBy: string,
  ): Promise<boolean> {
    this.logger.debug(`Attempting to update ${data.length} categories`);
    this.logger.debug(`Verifying existence of categories to update`);
    const categoryIds = data.map((category) => category.categoryId);
    const checkResult =
      await this.categoryRepository.verifyCategoriesExist(categoryIds);

    if (checkResult !== data.length) {
      this.logger.error(
        `Not all categories received in batch were found, aborting operation`,
      );
      return false;
    }
    return this.categoryRepository.updateBatchCategories(data, updatedBy);
  }

  async createCategory(data: ICreateCategory): Promise<ICategoryRecord> {
    this.logger.debug(`Params: ${JSON.stringify(data)}`);
    // const admin = await this.
    return this.categoryRepository.createCategory(data);
  }

  async deleteCategory(
    categoryId: string,
    deletedBy: string,
  ): Promise<boolean> {
    try {
      this.logger.debug(`Deleting category with ID: ${categoryId}`);
      const category =
        await this.categoryRepository.getCategoryById(categoryId);

      if (!category) {
        this.logger.error(`Category with ID ${categoryId} does not exist`);
        throw new Error(`Category not found`);
      }
      return this.categoryRepository.deleteCategory(categoryId, deletedBy);
    } catch (error) {
      this.logger.error(`Error deleting category: ${error.message}`);
      throw new BusinessError('Failed to delete category', error.message);
    }
  }
}
