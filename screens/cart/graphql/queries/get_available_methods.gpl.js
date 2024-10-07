import gql from 'graphql-tag';

const GET_AVAILABLE_PAYMENT_METHOD = gql`
  query getAvailablePaymentMethodV4(
    $postcode: String!
    $country_code: String
    $products: ProductsInput
    $cart_data: CartInput
  ) {
    getAvailablePaymentMethodV4(
      postcode: $postcode
      country_code: $country_code
      products: $products
      cart_data: $cart_data
    ) {
      payment_methods {
        code
        title
        __typename
      }
      checkcod {
        product_id
        message
        message_arr
        cod_available
        service_available
        message_arr
        __typename
      }
      delivery_days {
        product_id
        delivery_days
        success_msg
        __typename
      }
      return_info {
        returnable
        return_period
        message
        message_arr
        __typename
      }
      max_delivery_days
      exp_delivery_days
      exp_dispatch_days
      __typename
    }
  }
`;

// query getAvailableMethodsV2(
//     $pincode: String!
//     $country_code: String!
//     $is_cod: Boolean!
//     $total_weight: Float!
//     $total_amount: Float!
//   ) {
//     GetAvailableMethodsV2(
//       pincode: $pincode
//       country_code: $country_code
//       is_cod: $is_cod
//       total_weight: $total_weight
//       total_amount: $total_amount
//     ) {
//       payment_methods {
//         code
//         title
//       }
//       checkcod {
//         message
//         message_arr
//         cod_available
//         service_available
//         message_arr
//       }
//     }
//   }

export default GET_AVAILABLE_PAYMENT_METHOD;
