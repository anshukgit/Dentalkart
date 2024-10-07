import gql from 'graphql-tag';

const cartPriceFragment = gql`
  fragment cartPriceFragment on CartPricesV2 {
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
    overweight_delivery_charges {
      currency
      currency_symbol
      value
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
  }
`;

export default cartPriceFragment;
