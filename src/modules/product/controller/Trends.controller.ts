import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { TrendsService } from '../services/Trends.service';
import { LoggingService } from 'src/modules/logging';
import {
  ControllerResponse,
  handleControllerError,
  SuccessResponse,
  validatePayload,
} from 'src/utils/response';
import { UpdateTrendsBatchDTO } from '../types';
import { IAdminLoginData, ITrendRecord } from 'tbh-shared-types';
import { Auth } from 'src/modules/access/auth/discriminator';
import { AdminAuthor } from 'src/modules/access/auth';

@Controller('trends')
export class TrendsController {
  constructor(
    private readonly trendsService: TrendsService,
    private readonly logger: LoggingService,
  ) {}

  @Auth('visitor')
  @Get()
  async getAllTrends(): Promise<ControllerResponse<ITrendRecord[]>> {
    try {
      const trends = await this.trendsService.getAllTrendProducts();
      return SuccessResponse.send(trends);
    } catch (error) {
      return handleControllerError(error, this.logger);
    }
  }

  @Auth('admin')
  @Post('add/:productId')
  async addProductToTrends(
    @Param('productId') productId: string,
    @AdminAuthor() admin: IAdminLoginData,
  ): Promise<ControllerResponse<boolean>> {
    try {
      const result = await this.trendsService.addProductToTrends(
        productId,
        admin.entityId,
      );
      return SuccessResponse.send(result);
    } catch (error) {
      return handleControllerError(error, this.logger);
    }
  }

  @Auth('admin')
  @Post('update')
  async updateTrends(
    @Body() trendsToUpdate,
    @AdminAuthor() admin: IAdminLoginData,
  ): Promise<ControllerResponse<string>> {
    try {
      const payload = await validatePayload(
        UpdateTrendsBatchDTO,
        trendsToUpdate,
      );
      await this.trendsService.updateTrendingProduct(
        payload.productsToUpdate,
        admin.entityId,
      );
      return SuccessResponse.send('Success');
    } catch (e) {
      return handleControllerError(e, this.logger);
    }
  }

  @Auth('admin')
  @Delete(':productId')
  async removeTrendingProduct(
    @Param('productId') productId: string,
  ): Promise<ControllerResponse<boolean>> {
    try {
      const result = await this.trendsService.removeTrendingProduct(productId);
      return SuccessResponse.send(result);
    } catch (error) {
      return handleControllerError(error, this.logger);
    }
  }
}
