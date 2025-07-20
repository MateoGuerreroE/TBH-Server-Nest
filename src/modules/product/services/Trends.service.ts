import { Injectable } from '@nestjs/common';
import { ProductRepository } from 'src/modules/datasource';
import { LoggingService } from 'src/modules/logging';
import { BusinessError } from 'src/types';
import { ITrendRecord, IUpdateTrend } from 'tbh-shared-types';

@Injectable()
export class TrendsService {
  constructor(
    private readonly trendsRepository: ProductRepository,
    private readonly logger: LoggingService,
  ) {}

  async getAllTrendProducts(): Promise<ITrendRecord[]> {
    return this.trendsRepository.getTrendingProducts();
  }

  async addProductToTrends(
    productId: string,
    createdBy: string,
  ): Promise<boolean> {
    try {
      await this.trendsRepository.addProductTrend(productId, createdBy);
      return true;
    } catch (e) {
      this.logger.error(e);
      throw new BusinessError(
        'Unable to add product as trend',
        (e as Error).message,
      );
    }
  }

  async updateTrendingProduct(
    trendsToUpdate: IUpdateTrend[],
    updatedBy: string,
  ): Promise<void> {
    try {
      const productIds = trendsToUpdate.map((trend) => trend.productId);
      const existentTrends =
        await this.trendsRepository.verifyTrendProductsExist(productIds);
      if (existentTrends !== productIds.length) {
        throw new BusinessError(
          'Unable to update trending products',
          'Some of the IDS received do not exist',
        );
      }
      await this.trendsRepository.updateTrends(trendsToUpdate, updatedBy);
    } catch (e) {
      this.logger.error(e);
      throw new BusinessError(
        'Unable to update trending products',
        (e as Error).message,
      );
    }
  }

  async removeTrendingProduct(productId: string): Promise<boolean> {
    try {
      return this.trendsRepository.removeProductTrend(productId);
    } catch (e) {
      this.logger.error(e);
      throw new BusinessError(
        'Unable to remove product from trends',
        (e as Error).message,
      );
    }
  }
}
