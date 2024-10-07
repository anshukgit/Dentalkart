import gql from 'graphql-tag';

const ADD_SIMPLE_PRODUCT_TO_CART = gql`
  mutation addSimpleProductsToCartV2(
    $cart_id: String!
    $qty: Float!
    $sku: String!
    $referral_code: String
  ) {
    addSimpleProductsToCartV2(
      input: {
        cart_id: $cart_id
        cart_items: [
          {data: {quantity: $qty, sku: $sku, referral_code: $referral_code}}
        ]
      }
    ) {
      cart {
        items {
          id
          product {
            name
            sku
          }
          quantity
        }
      }
    }
  }
`;

export default ADD_SIMPLE_PRODUCT_TO_CART;
