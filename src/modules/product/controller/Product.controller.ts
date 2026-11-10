import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ControllerResponse,
  handleControllerError,
  SuccessResponse,
  validatePayload,
} from '../../../utils/response';
import { ProductService } from '../services/index';
import { LoggingService } from '../../logging/index';
import {
  CreateProductDTO,
  UpdateProductBatchDTO,
  UpdateProductObjDTO,
} from '../types/index';
import type { IProductRecord } from 'tbh-shared-types';
import type { IAdminLoginData, ProductFilters } from 'tbh-shared-types';
import { Auth } from '../../access/auth/discriminator';
import { AdminAuthor } from '../../access/auth/index';

@Controller('product')
export class ProductController {
  constructor(
    private readonly logger: LoggingService,
    private readonly productService: ProductService,
  ) {}

  @Auth('visitor')
  @Get()
  async getAllProducts(): Promise<ControllerResponse<IProductRecord[]>> {
    const result = await this.productService.getAllProducts();
    return SuccessResponse.send(result);
  }

  @Auth('visitor')
  @Get('filter')
  async getFilteredProducts(
    @Query() filters: ProductFilters,
  ): Promise<ControllerResponse<IProductRecord[]>> {
    try {
      const result = await this.productService.getFilteredProducts({
        ...filters,
        paginationOptions: {
          page: filters['page'] || 1,
          pageSize: filters['size'] || 20,
        },
      });
      return SuccessResponse.send(result);
    } catch (e) {
      return handleControllerError(e, this.logger);
    }
  }

  @Auth('visitor')
  @Get(':productId')
  async getProductById(
    @Param() params: { productId: string },
  ): Promise<ControllerResponse<IProductRecord>> {
    try {
      const result = await this.productService.getProductById(params.productId);
      return SuccessResponse.send(result);
    } catch (e) {
      return handleControllerError(e, this.logger);
    }
  }

  @Auth('admin')
  @Post('create')
  async createProduct(
    @Body() product,
    @AdminAuthor() admin: IAdminLoginData,
  ): Promise<ControllerResponse<IProductRecord>> {
    try {
      const payload = await validatePayload(CreateProductDTO, product);
      const result = await this.productService.createProduct({
        ...payload,
        createdBy: admin.entityId,
      });
      return SuccessResponse.send(result);
    } catch (e) {
      return handleControllerError(e, this.logger);
    }
  }

  @Auth('admin')
  @Post('updateBatch')
  async updateProductBatch(
    @Body() productBatchUpdate,
    @AdminAuthor() admin: IAdminLoginData,
  ): Promise<ControllerResponse<boolean>> {
    try {
      const payload = await validatePayload(
        UpdateProductBatchDTO,
        productBatchUpdate,
      );
      const result = await this.productService.updateProductBatch(
        payload.productsToUpdate,
        admin.entityId,
      );

      return SuccessResponse.send(result);
    } catch (e) {
      return handleControllerError(e, this.logger);
    }
  }

  @Auth('admin')
  @Put('/objects/:productId')
  async updateProductObjects(
    @Body() productObjectsUpdate: UpdateProductObjDTO,
    @Param('productId') productId: string,
    @AdminAuthor() admin: IAdminLoginData,
  ): Promise<ControllerResponse<boolean>> {
    try {
      const payload = await validatePayload(
        UpdateProductObjDTO,
        productObjectsUpdate,
      );
      const result = await this.productService.updateProductObjects(
        productId,
        payload,
        admin.entityId,
      );

      return SuccessResponse.send(result);
    } catch (e) {
      return handleControllerError(e, this.logger);
    }
  }

  @Auth('admin')
  @Delete(':productId')
  async deleteProduct(
    @Param() params: { productId: string },
    @AdminAuthor() admin: IAdminLoginData,
  ): Promise<ControllerResponse<boolean>> {
    try {
      const result = await this.productService.deleteProduct(
        params.productId.trim(),
        admin.entityId,
      );
      return SuccessResponse.send(result);
    } catch (e) {
      return handleControllerError(e, this.logger);
    }
  }

  @Auth('admin')
  @Post('_dev/createProducts')
  async __devCreateProducts(
    @Body() products: { products: CreateProductDTO[] },
  ): Promise<ControllerResponse<number>> {
    try {
      const result = await this.productService.__devCreateProducts(
        products.products,
      );
      return SuccessResponse.send(result);
    } catch (e) {
      return handleControllerError(e, this.logger);
    }
  }
}
