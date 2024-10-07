import gql from 'graphql-tag';
const GET_PROMOTION_BY_CART_VALUE = gql`
  query getAmountPromotionByCartValue($value: Float!) {
    getAmountPromotionByCartValue(value: $value) {
      message
    }
  }
`;

export default GET_PROMOTION_BY_CART_VALUE;
