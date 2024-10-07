import gql from 'graphql-tag';
import {ProductListingFragment} from '../fragments/product_listing_fragment.gql.js';

const GUEST_NEW_CART = gql`
  query cartV2($cart_id: String!) {
    cartV2(cart_id: $cart_id) {
      total_quantity
      ...ProductListingFragment
      applied_coupons {
        code
      }
      prices {
        grand_total {
          value
          currency
          currency_symbol
        }
        subtotal_including_tax {
          value
          currency
          currency_symbol
        }
        subtotal_excluding_tax {
          value
          currency
          currency_symbol
        }
        subtotal_with_discount_excluding_tax {
          value
          currency
          currency_symbol
        }
        applied_taxes {
          amount {
            value
            currency
            currency_symbol
          }
          label
        }
        discount {
          amount {
            value
            currency
            currency_symbol
          }
          label
        }
        rewardsdiscount {
          amount {
            value
            currency
            currency_symbol
          }
          label
        }
        total_savings {
          value
          currency
          currency_symbol
        }
        overweight_delivery_charges {
          currency
          currency_symbol
          value
        }
      }
      global_errors
      shipping_addresses {
        available_shipping_methods {
          carrier_code
          carrier_title
          method_code
          method_title
          error_message
          amount {
            value
            currency
            currency_symbol
          }
          base_amount {
            value
            currency
            currency_symbol
          }
          price_excl_tax {
            value
            currency
            currency_symbol
          }
          price_incl_tax {
            value
            currency
            currency_symbol
          }
          available
        }
      }
    }
  }
  ${ProductListingFragment}
`;

export default GUEST_NEW_CART;
