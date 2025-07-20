export interface ICategoryFilters {
  categoryId?: string;
  subCategoryId?: string;
}

export interface IProductPublicFilters {
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
}

export type ProductFilters = IProductPublicFilters & ICategoryFilters;
