export type ImageType = 'base' | 'sizing';
export type VideoType = 'main' | 'demo' | 'setup' | 'use';

export interface ICreateProduct {
  createdBy: string;
  productName: string;
  productPrice: number;
  discount: number;
  subCategoryId: string;
  stock?: number;
  productTags?: string[];
  externalId: string;
}

export interface IUpdateTrend {
  productId: string;
  isTrending?: boolean;
  trendScore?: number;
  updatedBy: string;
}

export interface BatchUpdate<T> {
  updates: T[];
  updatedBy: string;
}

export interface IUpdateProduct {
  productId: string;
  productName?: string;
  productTags?: string[];
  productPrice?: number;
  discount?: number;
  stock?: number;
  isActive?: boolean;
  subCategoryId?: string;
}

export interface IProductImage {
  url: string;
  isPrimary: boolean;
  altText?: string;
  type: ImageType;
}

export interface IProductVideo {
  url: string;
  videoType: VideoType;
}

export interface IProductDescription {
  short: string;
  content: string /*html*/;
}

export interface IUpdateProductOB {
  productImages?: IProductImage[];
  productVideos?: IProductVideo[];
  productDescriptions?: IProductDescription[];
}

export interface IUpdateCategory {
  categoryId: string;
  categoryName?: string;
  updatedBy: string;
  isEnabled?: boolean;
}

export interface ICreateCategory {
  categoryName: string;
  createdBy: string;
}

export interface ICreateSubCategory {
  subCategoryName: string;
  categoryId: string;
  createdBy: string;
}

export interface IUpdateSubCategory {
  subCategoryId: string;
  subCategoryName?: string;
  updatedBy: string;
  isEnabled?: boolean;
}
