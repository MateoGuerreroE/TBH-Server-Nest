import type {
  IPaginationOptions,
  IProductPublicFilters,
  IProductWithRelations,
} from 'tbh-shared-types';

export function filterProductResult(
  productList: IProductWithRelations[],
  filters: IProductPublicFilters,
): IProductWithRelations[] {
  const { keyword, minPrice, maxPrice } = filters;
  let result = productList;

  if (keyword) {
    const keywordLower = keyword.toLowerCase();
    const includes = (value?: string | null) =>
      !!value && value.toLowerCase().includes(keywordLower);

    result = result.filter(
      (product) =>
        includes(product.productName) ||
        includes(product.productDescription?.short) ||
        includes(product.productDescription?.content) ||
        (product.productTags ?? []).some((tag) => includes(tag)),
    );
  }

  if (minPrice || maxPrice) {
    const min = Number(minPrice) || 0;
    const max = Number(maxPrice) || Infinity;
    result = result.filter((product) => {
      const price = parseFloat(product.productPrice);
      return price >= min && price <= max;
    });
  }

  return result;
}

/** Slices an already-filtered list with the same page/pageSize semantics as the DB helper. */
export function paginateInMemory<T>(
  list: T[],
  options?: IPaginationOptions,
): T[] {
  if (!options) return list;
  const pageSize = Number(options.pageSize ?? 20);
  const offset = Math.max((Number(options.page) - 1) * pageSize, 0);
  return list.slice(offset, offset + pageSize);
}
