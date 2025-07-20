import { ICreateOrder } from 'tbh-shared-types';

export * from './payment';
export * from './products';

export type BaseCreateOrder = Omit<ICreateOrder, 'items'>;
