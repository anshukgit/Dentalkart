import gql from 'graphql-tag';
import {ProductListingFragment} from '../fragments/product_listing_fragment.gql.js';
import cartPriceFragment from '../fragments/cartPriceFragment.gql';
import cartShippingAddressFragment from '../fragments/cartShippingAddressFragment.gql';
import availablePaymentMethods from '../fragments/availablePaymentMethods.gql';
const APPLY_COUPON = gql`
  mutation applyCoupon($cart_id: String!, $coupon_code: String!) {
    applyCouponToCartV2(input: {cart_id: $cart_id, coupon_code: $coupon_code}) {
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
// getRewardsCartInfo {
//         earn_points
//         earn_points_value
//         balance
//         reward_term
//         reward_icon_url
//         exchange_rate_info
//         exchange_rate
//         exchange_rate_currency
//         max_point_to_checkout
//         max_point_message
//         applied_points
//         applied_points_value
//         reward_gain_info
//         currency
//       }
export default APPLY_COUPON;
