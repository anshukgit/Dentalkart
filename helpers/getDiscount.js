export default function getDiscount(product) {
  const regularPrice = product?.price?.regularPrice?.amount?.value;
  const minimalPrice = product?.price?.minimalPrice?.amount?.value;
  // const maximalPrice = product.price.maximalPrice.amount.value;
  const product_type = product.type_id;
  let discount = 0;
  if (
    product_type === 'simple' ||
    product_type === 'configurable' ||
    product_type === 'bundle'
  ) {
    discount = (((regularPrice - minimalPrice) * 100) / regularPrice).toFixed(
      1,
    );
  }
  return discount;
}
