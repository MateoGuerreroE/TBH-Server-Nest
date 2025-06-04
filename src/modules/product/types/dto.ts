import { Type } from 'class-transformer';
import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateProductDTO {
  @IsUUID()
  createdBy: string;

  @IsString()
  productName: string;

  @Type(() => Number)
  @IsNumber()
  productPrice: number;

  @Type(() => Number)
  @IsNumber()
  discount: number;

  @IsString()
  externalId: string;

  @IsUUID()
  subCategoryId: string;

  @IsOptional()
  @IsNumber()
  stock?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  productTags?: string[];
}
