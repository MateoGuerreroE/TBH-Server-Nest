import { IProductPublicFilters, IProductWithRelations } from 'tbh-shared-types';

export function filterProductResult(
  productList: IProductWithRelations[],
  filters: IProductPublicFilters,
): IProductWithRelations[] {
  const { keyword, minPrice, maxPrice } = filters;
  this.logger.debug(
    `Filtering products with keyword: ${keyword}, minPrice: ${maxPrice}, maxPrice: ${maxPrice}`,
  );
  const result: IProductWithRelations[] = [];

  if (keyword) {
    const keywordLower = keyword.toLowerCase();
    const matchesKeyword = (product: IProductWithRelations) => {
      return (
        product.productName.toLowerCase().includes(keywordLower) ||
        product.productDescription.short.toLowerCase().includes(keywordLower) ||
        product.productDescription.content
          .toLowerCase()
          .includes(keywordLower) ||
        product.productTags.some((tag) =>
          tag.toLowerCase().includes(keywordLower),
        )
      );
    };

    result.push(...productList.filter((p) => matchesKeyword(p)));
  }

  if (minPrice || maxPrice) {
    if (result.length) {
      return result.filter(
        (p) =>
          parseFloat(p.productPrice) >= (minPrice || 0) &&
          parseFloat(p.productPrice) <= (maxPrice || Infinity),
      );
    }
    return productList.filter(
      (p) =>
        parseFloat(p.productPrice) >= (minPrice || 0) &&
        parseFloat(p.productPrice) <= (maxPrice || Infinity),
    );
  }

  return result;
}
