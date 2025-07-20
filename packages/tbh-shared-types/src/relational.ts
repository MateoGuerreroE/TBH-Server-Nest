import {
  IAddressRecord,
  IAdminRecord,
  ICategoryRecord,
  ICouponRecord,
  IDiscountCampaignRecord,
  IOrderItemRecord,
  IOrderRecord,
  IPaymentRecord,
  IProductRecord,
  ISubcategoryRecord,
  ITrendRecord,
  IUserRecord,
} from './entities';

export interface IUserWithRelations extends IUserRecord {
  updater?: IAdminRecord | null;
  addresses?: IAddressRecord[];
}

export interface IProductWithRelations extends IProductRecord {
  subCategory?: ISubCategoryWithRelations | null;
  discountCampaign?: IDiscountCampaignRecord | null;
}

export interface ITrendWithRelations extends ITrendRecord {
  product?: IProductWithRelations | null;
  admin?: IAdminRecord | null;
}

export interface ICategoryWithRelations extends ICategoryRecord {
  subCategories?: ISubCategoryWithRelations[];
}

export interface ISubCategoryWithRelations extends ISubcategoryRecord {
  category?: ICategoryRecord;
  products?: IProductRecord[];
}

export interface IDiscountCampaignWithRelations
  extends IDiscountCampaignRecord {
  products?: IProductWithRelations[];
}

export interface IOrderItemWithRelations extends IOrderItemRecord {
  order?: IOrderRecord;
  product?: IProductWithRelations;
}

export interface IOrderWithRelations extends IOrderRecord {
  items?: IOrderItemWithRelations[];
  coupon?: ICouponRecord | null;
  payment?: IPaymentRecord | null;
  user?: IUserRecord | null;
  address?: IAddressRecord;
}

export interface IPaymentWithRelations extends IPaymentRecord {
  order?: IOrderWithRelations;
}

export interface ICouponWithRelations extends ICouponRecord {
  orders?: IOrderWithRelations[];
}

export interface IAddressWithRelations {
  orders?: IOrderRecord[];
  user?: IUserRecord | null;
}
