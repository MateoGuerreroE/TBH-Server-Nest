import { Injectable } from '@nestjs/common';
import { SubCategoryRepository } from 'src/modules/datasource';
import { LoggingService } from 'src/modules/logging';
import { BusinessError } from 'src/types';
import {
  BatchUpdate,
  ICreateSubCategory,
  ISubcategoryRecord,
  IUpdateSubCategory,
} from 'tbh-shared-types';

@Injectable()
export class SubCategoryService {
  constructor(
    private readonly logger: LoggingService,
    private readonly subCategoryRepo: SubCategoryRepository,
  ) {}

  async getAllSubCategories() {
    this.logger.debug('Fetching all subcategories');
    return this.subCategoryRepo.getAllSubcategories();
  }

  async createSubCategory(
    data: ICreateSubCategory,
  ): Promise<ISubcategoryRecord> {
    this.logger.debug(`Creating subcategory`);
    const subCategory = await this.subCategoryRepo.createSubcategory(data);
    this.logger.debug(
      `Subcategory created with ID: ${subCategory.subCategoryId}`,
    );
    return subCategory;
  }

  async updateSubCategoryBatch(
    data: BatchUpdate<IUpdateSubCategory>,
  ): Promise<boolean> {
    this.logger.debug(`Validating batch of subcategories`);
    const subCategoryIds = data.updates.map((sc) => sc.subCategoryId);
    const result =
      await this.subCategoryRepo.verifySubCategoriesExist(subCategoryIds);

    if (result !== data.updates.length) {
      this.logger.error(`One or more Subcategories received do not exist`);
      throw new BusinessError('Subcategories do not exist', 'INVALID');
    }

    return this.subCategoryRepo.updateBatchSubcategories(
      data.updates,
      data.updatedBy,
    );
  }

  async deleteSubCategory(
    subCategoryId: string,
    deletedBy: string,
  ): Promise<boolean> {
    try {
      this.logger.debug(`Deleting subcategory with ID: ${subCategoryId}`);
      const subCategory =
        await this.subCategoryRepo.getSubCategoryById(subCategoryId);

      if (!subCategory) {
        this.logger.error(`Sub Category with ID ${subCategory} does not exist`);

        throw new Error('Subcategory not found');
      }
      const result = await this.subCategoryRepo.deleteSubCategory(
        subCategoryId,
        deletedBy,
      );

      return result;
    } catch (e) {
      throw new BusinessError(
        'Unable to delete category',
        (e as Error).message,
      );
    }
  }
}
