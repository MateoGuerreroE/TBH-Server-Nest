import { IProductDescription, IProductImage, IProductVideo } from './product';

export interface IUserRecord {
  userId: string;
  firstName: string;
  lastName: string;
  address: string | null;
  city: string | null;
  phone: string | null;
  avatarUrl: string | null;
  isEmailVerified: boolean;
  isEnabled: boolean;
  emailAddress: string;
  firebaseId: string | null;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string;
  deletedAt: Date | null;
  lastLoginAt: Date | null;
}

export interface IAdminRecord {
  adminId: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  isEnabled: boolean;
  emailAddress: string;
  firebaseId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  lastLoginAt: Date | null;
}

export interface IAddressRecord {
  addressId: string;
  userId: string;
  addressName: string;
  mainAddress: string;
  notes: string;
  city: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface ICouponRecord {
  couponId: string;
  couponCode: string;
  discountAmount: string;
  expiresAt: Date;
}

export interface IOrderRecord {
  orderId: string;
  orderDate: Date;
  orderProductTotal: string;
  addressId: string | null;
  taxes: string;
  paymentId: string | null;
  userId: string | null;
  couponId: string | null;
}

export interface IOrderItemRecord {
  orderItemId: string;
  orderId: string;
  productId: string;
  amount: string;
  priceAtPurchase: string;
}

export interface IProductRecord {
  productId: string;
  discountCampaignId: string | null;
  productName: string;
  productTags: string[];
  productPrice: string;
  discount: string;
  stock: number;
  externalId: string;
  productImages: IProductImage[];
  productDescription: IProductDescription;
  productVideos: IProductVideo[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  createdBy: string;
  updatedBy: string;
  subCategoryId: string;
}

export interface ISubcategoryRecord {
  subCategoryId: string;
  subCategoryName: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  isEnabled: boolean;
  categoryId: string;
}

export interface IPaymentRecord {
  paymentId: string;
  paymentDate: Date;
  paymentAmount: string;
  status: string;
  orderId: string;
  updatedAt: Date;
  externalPaymentId: string;
  externalResponse: Record<string, any>; // ExternalPaymentResponse
}

export interface ICategoryRecord {
  categoryId: string;
  categoryName: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  isEnabled: boolean;
}

export interface ITrendRecord {
  trendId: string;
  productId: string;
  isVisibleOnGrid: boolean;
  isVisibleOnCarousel: boolean;
  trendDiscount: string;
  addedAt: Date;
  updatedAt: Date;
  createdBy: string;
}

export interface IDiscountCampaignRecord {
  discountCampaignId: string;
  discountCampaignName: string;
  createdBy: string;
  updatedBy: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
