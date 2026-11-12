import {
  ArrayMinSize,
  IsInt,
  Max,
  Min,
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
import type { ExternalPaymentData, ExternalPaymentResponse } from './payment';
import { Exclude, Type } from 'class-transformer';
import type {
  ICreateCoupon,
  IUpdateOrder,
} from 'tbh-shared-types';

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

export class OrderItemDTO {
  @IsUUID()
  productId: string;

  @IsInt()
  @Min(1)
  @Max(999)
  amount: number;
}

/**
 * Prices, discounts and taxes are never accepted from the client: the server
 * recomputes everything from the database (see OrderManagementService).
 */
export class CreateOrderDTO {
  @IsString()
  @IsOptional()
  couponCode?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => OrderItemDTO)
  items: OrderItemDTO[];
}

/** Internal only: no route accepts this from a client any more. */
export class UpdateOrderDTO {
  @IsUUID()
  orderId: string;

  @IsUUID()
  @IsOptional()
  addressId?: string;

  @IsUUID()
  @IsOptional()
  userId?: string;

  @IsUUID()
  @IsOptional()
  paymentId?: string | null;

  @Exclude()
  getOrder(): IUpdateOrder {
    return {
      orderId: this.orderId,
      userId: this.userId,
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
  getCoupon(): ICreateCoupon {
    return {
      couponCode: this.couponCode,
      discountAmount: this.discountAmount.toString(),
      expiresAt: new Date(this.expiresAt),
    };
  }
}
