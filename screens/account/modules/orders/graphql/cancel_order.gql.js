import gql from 'graphql-tag';

const CANCEL_ORDER = gql`
  mutation cancelOrderV2(
    $fullOrderCancel: Int
    $orderId: String!
    $reason: Int
  ) {
    cancelOrderV2(
      input: {
        fullOrderCancel: $fullOrderCancel
        orderId: $orderId
        reason: $reason
      }
    ) {
      cancelOrder {
        orderId
        errors
        __typename
      }
      __typename
    }
  }
`;
export default CANCEL_ORDER;
