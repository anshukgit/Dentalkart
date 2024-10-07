import gql from 'graphql-tag';

const ADD_VIRTUAL_PRODUCT_TO_CART = gql`
  mutation addVirtualProductsToCartV2(
    $cart_id: String!
    $cart_items: [VirtualProductCartItemInput]!
  ) {
    addVirtualProductsToCartV2(
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

export default ADD_VIRTUAL_PRODUCT_TO_CART;
