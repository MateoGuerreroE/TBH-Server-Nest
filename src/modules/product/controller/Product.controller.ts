import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ProductFilters, ProductRecord } from 'src/modules/datasource';
import {
  ControllerResponse,
  handleControllerError,
  SuccessResponse,
  validatePayload,
} from 'src/utils/response';
import { ProductService } from '../services';
import { LoggingService } from 'src/modules/logging';
import { CreateProductDTO } from '../types';

@Controller('product')
export class ProductController {
  constructor(
    private readonly logger: LoggingService,
    private readonly productService: ProductService,
  ) {}

  @Get()
  async getAllProducts(): Promise<ControllerResponse<ProductRecord[]>> {
    const result = await this.productService.getAllProducts();
    return SuccessResponse.send(result);
  }

  @Get(':productId([0-9a-fA-F-]{36})')
  async getProductById(
    @Param() params: { productId: string },
  ): Promise<ControllerResponse<ProductRecord>> {
    try {
      const result = await this.productService.getProductById(params.productId);
      return SuccessResponse.send(result);
    } catch (e) {
      return handleControllerError(e, this.logger);
    }
  }

  @Get('filter')
  async getFilteredProducts(
    @Query() filters: ProductFilters,
  ): Promise<ControllerResponse<ProductRecord[]>> {
    try {
      const result = await this.productService.getFilteredProducts(filters);
      return SuccessResponse.send(result);
    } catch (e) {
      return handleControllerError(e, this.logger);
    }
  }

  @Post('create')
  async createProduct(
    @Body() product,
  ): Promise<ControllerResponse<ProductRecord>> {
    try {
      const payload = await validatePayload(CreateProductDTO, product);
      const result = await this.productService.createProduct(payload);
      return SuccessResponse.send(result);
    } catch (e) {
      return handleControllerError(e, this.logger);
    }
  }
}
