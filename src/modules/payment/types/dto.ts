import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEmail,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { ExternalPaymentData, ExternalPaymentResponse } from './payment';
import { Exclude, Type } from 'class-transformer';
import {
  CreateCouponData,
  CreateOrderData,
  CreateOrderItemData,
  UpdateOrderData,
} from 'src/modules/datasource';

export class UpdatePaymentDTO {
  @IsUUID()
  paymentId: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsObject()
  @IsOptional()
  externalResponse?: ExternalPaymentResponse;

  @IsOptional()
  @IsDateString()
  paymentDate?: Date;
}

export class ShippingDTO {
  @IsString()
  fullName: string;

  @IsEmail()
  emailAddress: string;

  @IsString()
  city: string;

  @IsString()
  address: string;

  @ValidateIf((_, value) => value !== null)
  @IsString()
  @IsOptional()
  notes: string | null;

  @IsString()
  phone: string;
}

export class ProcessPaymentDTO {
  @IsUUID()
  orderId: string;

  @IsObject()
  payment: ExternalPaymentData;

  @ValidateNested()
  @Type(() => ShippingDTO)
  shipping: ShippingDTO;

  @IsUUID()
  @IsOptional()
  addressId?: string;
}

export class CreateOrderDTO {
  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsUUID()
  @IsOptional()
  couponId?: string;

  @IsNumber()
  taxes: number;

  @IsNumber()
  orderProductTotal: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDTO)
  items: OrderItemDTO[];

  getOrder(): CreateOrderData {
    return {
      orderProductTotal: this.orderProductTotal.toString(),
      taxes: this.taxes.toString(),
      userId: this.userId,
      couponId: this.couponId,
    };
  }
}

export class OrderItemDTO {
  @IsUUID()
  productId: string;

  @IsNumber()
  amount: number;

  @IsNumber()
  priceAtPurchase: number;

  @Exclude()
  getOrderItem(): Omit<CreateOrderItemData, 'orderId'> {
    return {
      productId: this.productId,
      amount: this.amount.toString(),
      priceAtPurchase: this.priceAtPurchase.toString(),
    };
  }
}

export class UpdateOrderDTO {
  @IsUUID()
  orderId: string;

  @IsUUID()
  @IsOptional()
  addressId?: string;

  @IsNumber()
  @IsOptional()
  orderProductTotal?: number;

  @IsNumber()
  @IsOptional()
  taxes?: number;

  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsUUID()
  @IsOptional()
  paymentId?: string | null;

  @IsUUID()
  @IsOptional()
  couponId?: string | null;

  @Exclude()
  getOrder(): UpdateOrderData {
    return {
      orderProductTotal: this.orderProductTotal?.toString(),
      userId: this.userId,
      couponId: this.couponId,
      taxes: this.taxes?.toString(),
      orderId: this.orderId,
      addressId: this.addressId,
      paymentId: this.paymentId,
    };
  }
}

export class CreateCouponDTO {
  @IsString()
  couponCode: string;

  @IsNumber()
  discountAmount: number;

  @IsDateString()
  expiresAt: string;

  @Exclude()
  getCoupon(): CreateCouponData {
    return {
      couponCode: this.couponCode,
      discountAmount: this.discountAmount.toString(),
      expiresAt: new Date(this.expiresAt),
    };
  }
}
