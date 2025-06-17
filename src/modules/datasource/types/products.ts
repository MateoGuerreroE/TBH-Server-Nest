export type ProductDescription = {
  short: string;
  content: string;
};

export type ImageType = 'color' | 'sizing';
export type VideoType = 'main' | 'demo' | 'setup' | 'use';

export type ProductImage = {
  url: string;
  isPrimary: boolean;
  altText?: string;
  type: ImageType;
  color: string;
};

export type ProductVideo = {
  url: string;
  videoType: VideoType;
};

export interface ProductRecord {
  productId: string;
  productName: string;
  productTags: string[];
  productPrice: string;
  discount: string;
  stock: number;
  externalId: string;
  productImages: ProductImage[];
  productDescription: ProductDescription;
  productVideos: ProductVideo[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdBy: string;
  updatedBy: string;
  subCategoryId: string;
  subCategory?: SubcategoryRecord | null;
}

export interface CategoryRecord {
  categoryId: string;
  categoryName: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  isEnabled: boolean;
}

export interface CategoryToCreate {
  categoryName: string;
  createdBy: string;
}

export interface CategoryToUpdate {
  categoryId: string;
  categoryName?: string;
  updatedBy: string;
  isEnabled?: boolean;
}

export interface SubcategoryRecord {
  subCategoryId: string;
  subCategoryName: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  isEnabled: boolean;
  categoryId: string;
}

export interface ProductWithSubCategory extends ProductRecord {
  subCategory: SubcategoryRecord;
}

export interface CategoryWithSubCategories extends CategoryRecord {
  subCategories: SubcategoryRecord[];
}

export interface SubCategoryWithProducts extends SubcategoryRecord {
  products: ProductRecord[];
}

export interface CategoryWithSubCategoriesAndProducts extends CategoryRecord {
  subCategories: SubCategoryWithProducts[];
}

export interface ProductWithSubCategoryAndCategory extends ProductRecord {
  subCategory: SubcategoryRecord & {
    category: CategoryRecord;
  };
}

// Mutation types
export interface CreateProductData {
  productName: string;
  productPrice: string;
  discount: string;
  stock: number;
  productTags: string[];
  externalId: string;
  createdBy: string;
  updatedBy: string;
  subCategoryId: string;
}

export interface UpdateProductAttributeData {
  productId: string;
  productName?: string;
  productPrice?: number;
  discount?: number;
  stock?: number;
  productTags?: string[];
  isActive?: boolean;
  subCategoryId?: string;
}

export interface UpdateProductObjectData {
  productImages?: ProductImage[];
  productVideos?: ProductVideo[];
  productDescription?: ProductDescription;
}

export interface CategoryFilters {
  categoryId?: string;
  subCategoryId?: string;
}

export interface ProductPublicFilters {
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
}

export type ProductFilters = ProductPublicFilters & CategoryFilters;

export interface SubCategoryRecord {
  subCategoryId: string;
  subCategoryName: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  isEnabled: boolean;
  categoryId: string;
  updatedBy: string;
  createdBy: string;
}

export interface SubCategoryWithRelations extends SubCategoryRecord {
  category: CategoryRecord | null;
  products: ProductRecord[] | null;
}

export interface SubCategoryToCreate {
  subCategoryName: string;
  categoryId: string;
  createdBy: string;
}

export interface SubCategoryToUpdate {
  subCategoryId: string;
  subCategoryName?: string;
  isEnabled?: boolean;
  categoryId?: string;
}
