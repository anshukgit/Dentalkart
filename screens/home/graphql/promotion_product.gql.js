import gql from 'graphql-tag';

const GET_ALL_PROMOTION_PRODUCT = gql`
  query {
    getAllItemPromotionProducts {
      product_sku
      free_product_sku
      free_product_quantity
      buy_qty
      parent_sku
      parent_id
    }
  }
`;
export default GET_ALL_PROMOTION_PRODUCT;
