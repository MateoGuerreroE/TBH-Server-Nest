export interface AddressToCreate {
  userId: string;
  addressName: string;
  mainAddress: string;
  notes: string;
  city: string;
}

export type AddressRecord = {
  addressId: string;
  userId: string;
  addressName: string;
  mainAddress: string;
  notes: string;
  city: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};
