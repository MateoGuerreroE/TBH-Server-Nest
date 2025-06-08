import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { ImageType, VideoType } from 'src/modules/datasource';

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

export class ProductImageDTO {
  @IsString()
  url: string;

  @IsBoolean()
  isPrimary: boolean;

  @IsOptional()
  @IsString()
  altText?: string;

  @IsString()
  @IsIn(['color', 'sizing'])
  type: ImageType;

  @IsString()
  color: string;
}

export class ProductVideoDTO {
  @IsString()
  url: string;

  @IsString()
  videoType: VideoType;
}

export class ProductDescriptionDTO {
  @IsString()
  short: string;

  @IsString()
  content: string;
}

export class UpdateProductObjDTO {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductImageDTO)
  productImages?: ProductImageDTO[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProductVideoDTO)
  productVideos?: ProductVideoDTO[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ProductDescriptionDTO)
  productDescription?: ProductDescriptionDTO;
}
