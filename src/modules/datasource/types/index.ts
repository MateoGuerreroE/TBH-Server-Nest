import type { ICreateOrder } from 'tbh-shared-types';

export type BaseCreateOrder = Omit<ICreateOrder, 'items'> & {
  orderId?: string;
  status?: string;
};
