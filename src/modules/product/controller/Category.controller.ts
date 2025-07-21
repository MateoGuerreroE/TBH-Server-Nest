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
import { IAdminLoginData, ICategoryRecord } from 'tbh-shared-types';
import { Auth } from 'src/modules/access/auth/discriminator';
import { AdminAuthor } from 'src/modules/access/auth';

@Controller('category')
export class CategoryController {
  constructor(
    private readonly categoryService: CategoryService,
    private readonly logger: LoggingService,
  ) {}

  @Auth('visitor')
  @Get()
  async getAllCategories(): Promise<ControllerResponse<ICategoryRecord[]>> {
    try {
      const categories = await this.categoryService.getAllCategories();
      return SuccessResponse.send(categories);
    } catch (error) {
      return handleControllerError(error, this.logger);
    }
  }

  @Auth('visitor')
  @Get('initial')
  async getInitialCategories(): Promise<ControllerResponse<ICategoryRecord[]>> {
    try {
      const categories = await this.categoryService.getInitialCategories();
      return SuccessResponse.send(categories);
    } catch (error) {
      return handleControllerError(error, this.logger);
    }
  }

  @Auth('admin')
  @Post('create')
  async createCategory(
    @Body() data,
    @AdminAuthor() admin: IAdminLoginData,
  ): Promise<ControllerResponse<ICategoryRecord>> {
    try {
      const payload = await validatePayload(CreateCategoryDTO, data);
      const categoryCreated = await this.categoryService.createCategory({
        ...payload,
        createdBy: admin.entityId,
      });

      return SuccessResponse.send(categoryCreated);
    } catch (error) {
      return handleControllerError(error, this.logger);
    }
  }

  @Auth('admin')
  @Post('updateBatch')
  async updateCategoryBatch(
    @Body() data,
    @AdminAuthor() admin: IAdminLoginData,
  ): Promise<ControllerResponse<boolean>> {
    try {
      const payload = await validatePayload(CategoryBatchUpdateDTO, data);
      const result = await this.categoryService.updateCategoryBatch(
        payload.categoriesToUpdate,
        admin.entityId,
      );

      return SuccessResponse.send(result);
    } catch (error) {
      return handleControllerError(error, this.logger);
    }
  }

  @Auth('admin')
  @Delete(':categoryId')
  async deleteCategory(
    @Param() params: { categoryId: string },
    @AdminAuthor() admin: IAdminLoginData,
  ): Promise<ControllerResponse<boolean>> {
    try {
      this.logger.debug(`Deleting category with ID: ${params.categoryId}`);
      const result = await this.categoryService.deleteCategory(
        params.categoryId,
        admin.entityId,
      );
      return SuccessResponse.send(result);
    } catch (error) {
      return handleControllerError(error, this.logger);
    }
  }
}
