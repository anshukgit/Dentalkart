import gql from 'graphql-tag';

const ADD_MULTIPLE_PRODUCTS_TO_CART = gql`
  mutation addSimpleProductsToCartV2(
    $cart_id: String!
    $cart_items: [SimpleProductCartItemInputV2]!
  ) {
    addSimpleProductsToCartV2(
      input: {cart_id: $cart_id, cart_items: $cart_items}
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

export default ADD_MULTIPLE_PRODUCTS_TO_CART;
