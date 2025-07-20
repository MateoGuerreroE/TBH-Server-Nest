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
import { ITrendRecord } from 'tbh-shared-types';

@Controller('trends')
export class TrendsController {
  constructor(
    private readonly trendsService: TrendsService,
    private readonly logger: LoggingService,
  ) {}

  @Get()
  async getAllTrends(): Promise<ControllerResponse<ITrendRecord[]>> {
    try {
      const trends = await this.trendsService.getAllTrendProducts();
      return SuccessResponse.send(trends);
    } catch (error) {
      return handleControllerError(error, this.logger);
    }
  }

  @Post('add/:productId')
  async addProductToTrends(
    @Param('productId') productId: string,
  ): Promise<ControllerResponse<boolean>> {
    try {
      const result = await this.trendsService.addProductToTrends(
        productId,
        'e7bc3690-48ee-424f-9ce3-2572372bdb66',
      );
      return SuccessResponse.send(result);
    } catch (error) {
      return handleControllerError(error, this.logger);
    }
  }

  @Post('update')
  async updateTrends(
    @Body() trendsToUpdate,
  ): Promise<ControllerResponse<string>> {
    try {
      const payload = await validatePayload(
        UpdateTrendsBatchDTO,
        trendsToUpdate,
      );
      await this.trendsService.updateTrendingProduct(
        payload.productsToUpdate,
        payload.updatedBy,
      );
      return SuccessResponse.send('Success');
    } catch (e) {
      return handleControllerError(e, this.logger);
    }
  }

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
