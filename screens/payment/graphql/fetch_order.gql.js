import gql from 'graphql-tag';

const FETCH_ORDER_DETAILS = gql`
  query fetchOrderV2(
    $order_id: String!
    $rzp_payment_id: String
    $rzp_order_id: String
  ) {
    fetchOrderV2(
      input: {
        order_id: $order_id
        rzp_payment_id: $rzp_payment_id
        rzp_order_id: $rzp_order_id
      }
    ) {
      order_id
      status
      order_detail_available
      can_refetch
      can_retry_payment
      amount
      currency
      order_created_at
      failure_wait_time
      error_msg
      reference_number
      merchant_id
    }
  }
`;

export default FETCH_ORDER_DETAILS;
