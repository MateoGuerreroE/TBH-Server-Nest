export interface ProductRecord {
  productId: string;
  productCup: string;
  productName: string;
  productDescription: string;
  productPrice: string;
  productEan: string | null;
  productImages: string[];
  productVideos: string[];
  isEnabled: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  subCategoryId: string;
}

export interface CategoryRecord {
  categoryId: string;
  categoryName: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  isEnabled: boolean;
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
