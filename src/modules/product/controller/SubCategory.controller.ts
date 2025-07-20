import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { SubCategoryService } from '../services/SubCategory.service';
import { LoggingService } from 'src/modules/logging';
import {
  ControllerResponse,
  handleControllerError,
  SuccessResponse,
  validatePayload,
} from 'src/utils/response';
import { CreateSubCategoryDTO, UpdateSubCategoryBatchDTO } from '../types';
import { ISubcategoryRecord } from 'tbh-shared-types';

@Controller('subCategory')
export class SubCategoryController {
  constructor(
    private readonly subCategoryService: SubCategoryService,
    private readonly logger: LoggingService,
  ) {}

  @Get()
  async getSubCategories(): Promise<ControllerResponse<ISubcategoryRecord[]>> {
    try {
      const result = await this.subCategoryService.getAllSubCategories();
      return SuccessResponse.send(result);
    } catch (error) {
      return handleControllerError(error, this.logger);
    }
  }

  @Post('create')
  async createSubCategory(
    @Body() body,
  ): Promise<ControllerResponse<ISubcategoryRecord>> {
    try {
      const payload = await validatePayload(CreateSubCategoryDTO, body);

      const result = await this.subCategoryService.createSubCategory(payload);

      return SuccessResponse.send(result);
    } catch (error) {
      return handleControllerError(error, this.logger);
    }
  }

  @Post('updateBatch')
  async updateBatchSubcategories(
    @Body() body,
  ): Promise<ControllerResponse<boolean>> {
    try {
      const payload = await validatePayload(UpdateSubCategoryBatchDTO, body);
      const result =
        await this.subCategoryService.updateSubCategoryBatch(payload);

      return SuccessResponse.send(result);
    } catch (error) {
      return handleControllerError(error, this.logger);
    }
  }

  @Delete(':subCategoryId')
  async deleteSubCategory(
    @Param('subCategoryId') subCategoryId: string,
  ): Promise<ControllerResponse<boolean>> {
    try {
      const result = await this.subCategoryService.deleteSubCategory(
        subCategoryId,
        'e7bc3690-48ee-424f-9ce3-2572372bdb66', //! CHANGE FOR JWT WHEN IMPLEMENTED
      );
      return SuccessResponse.send(result);
    } catch (error) {
      return handleControllerError(error, this.logger);
    }
  }
}
