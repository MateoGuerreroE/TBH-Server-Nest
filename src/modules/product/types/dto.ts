import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import {
  CategoryToUpdate,
  ImageType,
  UpdateProductAttributeData,
  VideoType,
} from 'src/modules/datasource';

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

export class UpdateProductBatchDTO {
  @IsArray()
  @ArrayMinSize(1)
  productsToUpdate: UpdateProductDTO[];

  @IsUUID()
  updatedBy: string;
}

export class UpdateProductDTO {
  @IsUUID()
  productId: string;

  @IsOptional()
  @IsString()
  productName?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  productTags?: string[];

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  productPrice?: number;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  discount?: number;

  @IsOptional()
  @IsNumber()
  stock?: number;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsUUID()
  subCategoryId?: string;
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

export class CategoryBatchUpdateDTO {
  @IsArray()
  @ArrayMinSize(1)
  categoriesToUpdate: CategoryToUpdate[];

  @IsUUID()
  updatedBy: string;
}

export class ProductBatchUpdateDTO {}

export class CreateCategoryDTO {
  @IsString()
  categoryName: string;

  @IsUUID()
  createdBy: string;
}
