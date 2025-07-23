import { ICategoryRecord, IProductRecord } from './entities';

export interface ICategoriesWithProducts extends ICategoryRecord {
  products: IProductRecord[];
}
