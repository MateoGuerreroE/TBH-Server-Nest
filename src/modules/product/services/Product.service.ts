import { Injectable } from '@nestjs/common';
import { ProductRepository } from 'src/modules/datasource';
import { ProductRecord } from 'src/modules/datasource/types/products';
import { LoggingService } from 'src/modules/logging';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly logger: LoggingService,
  ) {}

  async getAllProducts(): Promise<ProductRecord[]> {
    this.logger.debug('Fetching all products');
    return this.productRepository.getAllProduct();
  }
}
