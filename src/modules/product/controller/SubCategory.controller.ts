import { Body, Controller, Get, Post } from '@nestjs/common';
import { SubCategoryService } from '../services/SubCategory.service';
import { LoggingService } from 'src/modules/logging';
import {
  ControllerResponse,
  handleControllerError,
  SuccessResponse,
  validatePayload,
} from 'src/utils/response';
import { SubCategoryRecord } from 'src/modules/datasource';
import { CreateSubCategoryDTO, UpdateSubCategoryBatchDTO } from '../types';

@Controller('subCategory')
export class SubCategoryController {
  constructor(
    private readonly subCategoryService: SubCategoryService,
    private readonly logger: LoggingService,
  ) {}

  @Get()
  async getSubCategories(): Promise<ControllerResponse<SubCategoryRecord[]>> {
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
  ): Promise<ControllerResponse<SubCategoryRecord>> {
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
}
