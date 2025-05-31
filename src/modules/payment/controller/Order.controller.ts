import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { OrderManagementService } from '../services/OrderManagement.service';
import {
  ControllerResponse,
  handleControllerError,
  SuccessResponse,
  validatePayload,
} from 'src/utils/response';
import { OrderRecord, OrderRecordWithProducts } from 'src/modules/datasource';
import { CreateOrderDTO, UpdateOrderDTO } from '../types';
import { LoggingService } from 'src/modules/logging';
import { ControllerError } from 'src/types';

@Controller('order')
export class OrderController {
  constructor(
    private readonly logger: LoggingService,
    private readonly orderManagementService: OrderManagementService,
  ) {}

  @Post('create')
  async createOrder(
    @Body() body,
  ): Promise<ControllerResponse<OrderRecordWithProducts>> {
    try {
      const orderPayload = await validatePayload(CreateOrderDTO, body);
      const order =
        await this.orderManagementService.createInitialOrder(orderPayload);
      return SuccessResponse.send(order);
    } catch (e) {
      return handleControllerError(e, this.logger);
    }
  }

  @Get(':orderId')
  async getOrderWithProducts(
    @Param('orderId') orderId: string,
  ): Promise<ControllerResponse<OrderRecordWithProducts>> {
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

  @Put('update')
  async updateOrder(@Body() body): Promise<ControllerResponse<OrderRecord>> {
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
