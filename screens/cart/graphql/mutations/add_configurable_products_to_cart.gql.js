import gql from "graphql-tag";

const ADD_CONFIGURABLE_PRODUCT_TO_CART = gql `
    mutation addConfigurableProductsToCart($cart_id: String!, $parent_sku : String!, $qty : Float!, $sku : String!){
       addConfigurableProductsToCart(
        input: {
            cart_id: $cart_id
            cart_items: [
                {
                    parent_sku: $parent_sku
                    data: {
                        quantity: $qty,
                        sku: $sku
                    }

                }
            ]
        }
        ) {
        cart {
          items {
            id
            quantity
            product {
              name
              sku
            }
            ... on ConfigurableCartItem {
              configurable_options {
                option_label
              }
            }
          }
        }
      }
}`;

export default ADD_CONFIGURABLE_PRODUCT_TO_CART;
