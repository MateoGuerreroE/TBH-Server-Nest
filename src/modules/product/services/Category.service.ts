import { Injectable } from '@nestjs/common';
import {
  CategoryRecord,
  CategoryRepository,
  CategoryToCreate,
  CategoryToUpdate,
} from '../../datasource';
import { LoggingService } from 'src/modules/logging';

@Injectable()
export class CategoryService {
  constructor(
    private readonly categoryRepository: CategoryRepository,
    private readonly logger: LoggingService,
  ) {}

  async getAllCategories(): Promise<CategoryRecord[]> {
    this.logger.debug(`Fetching all categories`);
    const categories = await this.categoryRepository.getAllCategories();
    this.logger.debug(`Found ${categories.length} categories`);
    return categories;
  }

  async updateCategoryBatch(
    data: CategoryToUpdate[],
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

  async createCategory(data: CategoryToCreate): Promise<CategoryRecord> {
    this.logger.debug(`Params: ${JSON.stringify(data)}`);
    // const admin = await this.
    return this.categoryRepository.createCategory(data);
  }
}
