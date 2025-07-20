import { ICreateOrder } from 'tbh-shared-types';

export type BaseCreateOrder = Omit<ICreateOrder, 'items'>;
