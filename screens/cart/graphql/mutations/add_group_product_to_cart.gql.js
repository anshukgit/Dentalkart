import gql from 'graphql-tag';
import toSource from '@helpers/toSource';

const ADD_GROUP_PRODUCTS_TO_CART = options =>
  gql`
        mutation addSimpleProductsToCartV2($cart_id : String!){
            addSimpleProductsToCartV2(
                input: {
                  cart_id: $cart_id
                  cart_items : ${options.length > 0 ? options.toSource() : `[]`}
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
   }`;
export default ADD_GROUP_PRODUCTS_TO_CART;
