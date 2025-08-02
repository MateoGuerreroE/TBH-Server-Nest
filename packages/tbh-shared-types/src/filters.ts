export interface ICategoryFilters {
  categoryId?: string;
  subCategoryId?: string;
}

export interface IPaginationOptions {
  page: number;
  pageSize: number;
}

export interface IProductPublicFilters {
  keyword?: string;
  minPrice?: number;
  maxPrice?: number;
  paginationOptions?: IPaginationOptions;
}

export type ProductFilters = IProductPublicFilters & ICategoryFilters;
