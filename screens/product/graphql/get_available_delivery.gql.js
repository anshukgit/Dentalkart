import gql from 'graphql-tag';

const GET_AVAILABLE_DELIVERY = gql`
  query getAvailablePaymentMethodV4(
    $postcode: String!
    $country_code: String
    $products: ProductsInput
  ) {
    getAvailablePaymentMethodV4(
      postcode: $postcode
      country_code: $country_code
      products: $products
    ) {
      payment_methods {
        code
        title
        __typename
      }
      checkcod {
        cod_available
        message
        message_arr
        product_id
        service_available
        type
      }
      delivery_days {
        delivery_days
        product_id
        success_msg
      }
      payment_methods {
        code
        title
      }
      return_info {
        message
        message_arr
        return_period
        returnable
      }
    }
  }
`;

export default GET_AVAILABLE_DELIVERY;
