import gql from 'graphql-tag';

// import ProductListingFragment from '../fragments/product_listing_fragment.gql';
import {ProductListingFragment} from '../fragments/product_listing_fragment.gql.js';
import cartPriceFragment from '../fragments/cartPriceFragment.gql';
import cartShippingAddressFragment from '../fragments/cartShippingAddressFragment.gql';
import availablePaymentMethods from '../fragments/availablePaymentMethods.gql';

const SET_SHIPPING_ADDRESS_ON_CART = gql`
  mutation setShippingAddressesOnCartV2(
    $firstname: String
    $lastname: String
    $postcode: String
    $telephone: String
    $alternate_mobile: String
    $street: [String]
    $country_id: String!
    $region_id: Int
    $region: String
    $region_code: String
    $city: String
    $cart_id: String!
    $customer_address_id: Int
  ) {
    setShippingAddressesOnCartV2(
      input: {
        cart_id: $cart_id
        shipping_addresses: [
          {
            address: {
              firstname: $firstname
              lastname: $lastname
              street: $street
              city: $city
              region: $region
              region_code: $region_code
              region_id: $region_id
              postcode: $postcode
              country_code: $country_id
              telephone: $telephone
              alternate_mobile: $alternate_mobile
              save_in_address_book: false
            }
            customer_address_id: $customer_address_id
          }
        ]
      }
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
export default SET_SHIPPING_ADDRESS_ON_CART;
