import { Body, Controller, Post } from '@nestjs/common';
import { CategoryService } from '../services';
import {
  ControllerResponse,
  handleControllerError,
  SuccessResponse,
  validatePayload,
} from 'src/utils/response';
import { LoggingService } from 'src/modules/logging';
import { CategoryBatchUpdateDTO, CreateCategoryDTO } from '../types';
import { CategoryRecord } from 'src/modules/datasource';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly logger: LoggingService,
  ) {}

  @Post('create')
  async createCategory(
    @Body() data,
  ): Promise<ControllerResponse<CategoryRecord>> {
    try {
      const payload = await validatePayload(CreateCategoryDTO, data);
      const categoryCreated =
        await this.categoryService.createCategory(payload);

      return SuccessResponse.send(categoryCreated);
    } catch (error) {
      return handleControllerError(error, this.logger);
    }
  }

  @Post('batchUpdate')
  async updateCategoryBatch(
    @Body() data,
  ): Promise<ControllerResponse<boolean>> {
    try {
      const payload = await validatePayload(CategoryBatchUpdateDTO, data);
      const result = await this.categoryService.updateCategoryBatch(
        payload.categoriesToUpdate,
        payload.updatedBy,
      );

      return SuccessResponse.send(result);
    } catch (error) {
      return handleControllerError(error, this.logger);
    }
  }
}
