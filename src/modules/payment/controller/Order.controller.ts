import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { OrderManagementService } from '../services/OrderManagement.service';
import {
  ControllerResponse,
  handleControllerError,
  SuccessResponse,
  validatePayload,
} from '../../../utils/response';
import { CreateOrderDTO, UpdateOrderDTO } from '../types/index';
import { LoggingService } from '../../logging/index';
import { ControllerError } from '../../../types/index';
import type { IOrderWithRelations } from 'tbh-shared-types';
import type { IOrderRecord } from 'tbh-shared-types';
import { Auth } from '../../access/auth/discriminator';

@Controller('order')
export class OrderController {
  constructor(
    private readonly logger: LoggingService,
    private readonly orderManagementService: OrderManagementService,
  ) {}

  @Auth('visitor')
  @Post('create')
  async createOrder(
    @Body() body,
  ): Promise<ControllerResponse<IOrderWithRelations>> {
    try {
      const orderPayload = await validatePayload(CreateOrderDTO, body);
      const order =
        await this.orderManagementService.createInitialOrder(orderPayload);
      return SuccessResponse.send(order);
    } catch (e) {
      return handleControllerError(e, this.logger);
    }
  }

  @Auth('visitor')
  @Get(':orderId')
  async getOrderWithProducts(
    @Param('orderId') orderId: string,
  ): Promise<ControllerResponse<IOrderWithRelations>> {
    try {
      if (!orderId) {
        throw new ControllerError('Validation Failed', 'Order ID is required');
      }
      const order =
        await this.orderManagementService.getOrderWithProducts(orderId);
      return SuccessResponse.send(order);
    } catch (e) {
      return handleControllerError(e, this.logger);
    }
  }

  @Auth('visitor')
  @Put('update')
  async updateOrder(@Body() body): Promise<ControllerResponse<IOrderRecord>> {
    try {
      const updateOrderPayload = await validatePayload(UpdateOrderDTO, body);
      const updated =
        await this.orderManagementService.updateOrder(updateOrderPayload);

      return SuccessResponse.send(updated);
    } catch (e) {
      return handleControllerError(e, this.logger);
    }
  }
}
