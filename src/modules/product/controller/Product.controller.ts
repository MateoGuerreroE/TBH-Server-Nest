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
} from 'src/utils/response';
import { ProductService } from '../services';
import { LoggingService } from 'src/modules/logging';
import {
  CreateProductDTO,
  UpdateProductBatchDTO,
  UpdateProductObjDTO,
} from '../types';
import { IProductRecord } from 'packages/tbh-shared-types/dist';
import { IAdminLoginData, ProductFilters } from 'tbh-shared-types';
import { Auth } from 'src/modules/access/auth/discriminator';
import { AdminAuthor } from 'src/modules/access/auth';

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
  @Get(':productId([0-9a-fA-F-]{36})')
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

  @Auth('visitor')
  @Get('filter')
  async getFilteredProducts(
    @Query() filters: ProductFilters,
  ): Promise<ControllerResponse<IProductRecord[]>> {
    try {
      const result = await this.productService.getFilteredProducts(filters);
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
