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
import { CategoryToUpdate, ImageType, VideoType } from 'src/modules/datasource';

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
  @IsOptional()
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

export class UpdateTrendsBatchDTO {
  @IsArray()
  @ArrayMinSize(1)
  productsToUpdate: UpdateTrendDTO[];

  @IsUUID()
  updatedBy: string;
}

export class UpdateTrendDTO {
  @IsUUID()
  productId: string;

  @IsOptional()
  @IsBoolean()
  isTrending?: boolean;

  @IsOptional()
  @IsNumber({ maxDecimalPlaces: 2 })
  trendScore?: number;

  @IsUUID()
  updatedBy: string;
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
  @IsIn(['base', 'sizing'])
  type: ImageType;
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

export class CreateSubCategoryDTO {
  @IsString()
  subCategoryName: string;

  @IsUUID()
  categoryId: string;

  @IsUUID()
  createdBy: string;
}

export class UpdateSubCategoryDTO {
  @IsUUID()
  subCategoryId: string;

  @IsOptional()
  @IsString()
  subCategoryName?: string;

  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;
}

export class UpdateSubCategoryBatchDTO {
  @IsArray()
  @ArrayMinSize(1)
  subCategoriesToUpdate: UpdateSubCategoryDTO[];

  @IsUUID()
  updatedBy: string;
}
