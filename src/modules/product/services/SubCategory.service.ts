import { Injectable } from '@nestjs/common';
import {
  SubCategoryRecord,
  SubCategoryRepository,
} from 'src/modules/datasource';
import { LoggingService } from 'src/modules/logging';
import { CreateSubCategoryDTO, UpdateSubCategoryBatchDTO } from '../types';
import { BusinessError } from 'src/types';

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
    data: CreateSubCategoryDTO,
  ): Promise<SubCategoryRecord> {
    this.logger.debug(`Creating subcategory`);
    const subCategory = await this.subCategoryRepo.createSubcategory(data);
    this.logger.debug(
      `Subcategory created with ID: ${subCategory.subCategoryId}`,
    );
    return subCategory;
  }

  async updateSubCategoryBatch(
    data: UpdateSubCategoryBatchDTO,
  ): Promise<boolean> {
    this.logger.debug(`Validating batch of subcategories`);
    const subCategoryIds = data.subCategoriesToUpdate.map(
      (sc) => sc.subCategoryId,
    );
    const result =
      await this.subCategoryRepo.verifySubCategoriesExist(subCategoryIds);

    if (result !== data.subCategoriesToUpdate.length) {
      this.logger.error(`One or more Subcategories received do not exist`);
      throw new BusinessError('Subcategories do not exist', 'INVALID');
    }

    return this.subCategoryRepo.updateBatchSubcategories(
      data.subCategoriesToUpdate,
      data.updatedBy,
    );
  }
}
