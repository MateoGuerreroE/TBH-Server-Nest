import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SubCategoryService } from '../services/SubCategory.service';
import { LoggingService } from '../../logging/index';
import {
  ControllerResponse,
  handleControllerError,
  SuccessResponse,
  validatePayload,
} from '../../../utils/response';
import {
  CreateSubCategoryDTO,
  UpdateSubCategoryBatchDTO,
} from '../types/index';
import type {
  IAdminLoginData,
  ISubcategoryRecord,
  IUpdateSubCategory,
} from 'tbh-shared-types';
import { Auth } from '../../access/auth/discriminator';
import { AdminAuthor } from '../../access/auth/index';

@Controller('subCategory')
export class SubCategoryController {
  constructor(
    private readonly subCategoryService: SubCategoryService,
    private readonly logger: LoggingService,
  ) {}

  @Auth('visitor')
  @Get()
  async getSubCategories(): Promise<ControllerResponse<ISubcategoryRecord[]>> {
    try {
      const result = await this.subCategoryService.getAllSubCategories();
      return SuccessResponse.send(result);
    } catch (error) {
      return handleControllerError(error, this.logger);
    }
  }

  @Auth('admin')
  @Post('create')
  async createSubCategory(
    @Body() body,
    @AdminAuthor() admin: IAdminLoginData,
  ): Promise<ControllerResponse<ISubcategoryRecord>> {
    try {
      const payload = await validatePayload(CreateSubCategoryDTO, body);

      const result = await this.subCategoryService.createSubCategory({
        ...payload,
        createdBy: admin.entityId,
      });

      return SuccessResponse.send(result);
    } catch (error) {
      return handleControllerError(error, this.logger);
    }
  }

  @Auth('admin')
  @Post('updateBatch')
  async updateBatchSubcategories(
    @Body() body,
    @AdminAuthor() admin: IAdminLoginData,
  ): Promise<ControllerResponse<boolean>> {
    try {
      const payload = await validatePayload(UpdateSubCategoryBatchDTO, body);
      const result = await this.subCategoryService.updateSubCategoryBatch({
        updates: payload.subCategoriesToUpdate as IUpdateSubCategory[],
        updatedBy: admin.entityId,
      });

      return SuccessResponse.send(result);
    } catch (error) {
      return handleControllerError(error, this.logger);
    }
  }

  @Auth('admin')
  @Delete(':subCategoryId')
  async deleteSubCategory(
    @Param('subCategoryId') subCategoryId: string,
    @AdminAuthor() admin: IAdminLoginData,
  ): Promise<ControllerResponse<boolean>> {
    try {
      const result = await this.subCategoryService.deleteSubCategory(
        subCategoryId,
        admin.entityId,
      );
      return SuccessResponse.send(result);
    } catch (error) {
      return handleControllerError(error, this.logger);
    }
  }
}
