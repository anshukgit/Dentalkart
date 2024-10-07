import gql from 'graphql-tag';
import {ProductListingFragment} from '@screens/cart/graphql/fragments/product_listing_fragment.gql.js';
// import {ProductListingFragment} from '@screens/cart/graphql/fragments/product_listing_fragment.gql.js';
import cartPriceFragment from '@screens/cart/graphql/fragments/cartPriceFragment.gql';
import cartShippingAddressFragment from '@screens/cart/graphql/fragments/cartShippingAddressFragment.gql';
import availablePaymentMethods from '@screens/cart/graphql/fragments/availablePaymentMethods.gql';
const APPLY_REWARD_POINTS = gql`
  mutation dkApplyRewardPointsV2($rewardpoints: Int!) {
    dkApplyRewardPointsV2(rewardpoints: $rewardpoints) {
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
      # rewardsCartInfo {
      #   earn_points
      #   earn_points_value
      #   balance
      #   reward_term
      #   reward_icon_url
      #   exchange_rate_info
      #   exchange_rate
      #   exchange_rate_currency
      #   max_point_to_checkout
      #   max_point_message
      #   applied_points
      #   applied_points_value
      #   reward_gain_info
      #   currency
      # }
    }
  }
  ${ProductListingFragment}
  ${cartPriceFragment}
  ${cartShippingAddressFragment}
  ${availablePaymentMethods}
`;

export default APPLY_REWARD_POINTS;
