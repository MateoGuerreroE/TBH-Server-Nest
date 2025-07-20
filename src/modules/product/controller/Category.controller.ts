import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CategoryService } from '../services';
import {
  ControllerResponse,
  handleControllerError,
  SuccessResponse,
  validatePayload,
} from 'src/utils/response';
import { LoggingService } from 'src/modules/logging';
import { CategoryBatchUpdateDTO, CreateCategoryDTO } from '../types';
import { ICategoryRecord } from 'tbh-shared-types';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly logger: LoggingService,
  ) {}

  @Get()
  async getAllCategories(): Promise<ControllerResponse<ICategoryRecord[]>> {
    try {
      const categories = await this.categoryService.getAllCategories();
      return SuccessResponse.send(categories);
    } catch (error) {
      return handleControllerError(error, this.logger);
    }
  }

  @Get('initial')
  async getInitialCategories(): Promise<ControllerResponse<ICategoryRecord[]>> {
    try {
      const categories = await this.categoryService.getInitialCategories();
      return SuccessResponse.send(categories);
    } catch (error) {
      return handleControllerError(error, this.logger);
    }
  }

  @Post('create')
  async createCategory(
    @Body() data,
  ): Promise<ControllerResponse<ICategoryRecord>> {
    try {
      const payload = await validatePayload(CreateCategoryDTO, data);
      const categoryCreated =
        await this.categoryService.createCategory(payload);

      return SuccessResponse.send(categoryCreated);
    } catch (error) {
      return handleControllerError(error, this.logger);
    }
  }

  @Post('updateBatch')
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

  @Delete(':categoryId')
  async deleteCategory(
    @Param() params: { categoryId: string },
  ): Promise<ControllerResponse<boolean>> {
    try {
      this.logger.debug(`Deleting category with ID: ${params.categoryId}`);
      const result = await this.categoryService.deleteCategory(
        params.categoryId,
        'e7bc3690-48ee-424f-9ce3-2572372bdb66', // TODO: Replace with JWT user ID
      );
      return SuccessResponse.send(result);
    } catch (error) {
      return handleControllerError(error, this.logger);
    }
  }
}
