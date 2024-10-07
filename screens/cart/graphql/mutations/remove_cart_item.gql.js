import gql from 'graphql-tag';
import {ProductListingFragment} from '../fragments/product_listing_fragment.gql.js';
import cartPriceFragment from '@screens/cart/graphql/fragments/cartPriceFragment.gql';
import cartShippingAddressFragment from '@screens/cart/graphql/fragments/cartShippingAddressFragment.gql';
import availablePaymentMethods from '@screens/cart/graphql/fragments/availablePaymentMethods.gql';

const REMOVE_CART_ITEM = gql`
  mutation removeItem($cart_id: String!, $cart_item_id: Int!) {
    removeItemFromCartV2(
      input: {cart_id: $cart_id, cart_item_id: $cart_item_id}
    ) {
      cart {
        global_errors
        total_quantity
        applied_coupons {
          code
        }
        ...ProductListingFragment
        prices {
          ...cartPriceFragment
        }
        shipping_addresses {
          ...cartShippingAddressFragment
        }
        ...availablePaymentMethods
      }
    }
  }
  ${ProductListingFragment}
  ${cartPriceFragment}
  ${cartShippingAddressFragment}
  ${availablePaymentMethods}
`;

export default REMOVE_CART_ITEM;
