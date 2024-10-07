import gql from 'graphql-tag';

const cartShippingAddressFragment = gql`
  fragment cartShippingAddressFragment on ShippingCartAddressV2 {
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
    country {
      code
    }
    customer_address_id
  }
`;

export default cartShippingAddressFragment;
