import gql from 'graphql-tag';
const GET_CANCELABLE_ORDER = gql`
  query ($orderId: String!) {
    getCancelableOrder(orderId: $orderId) {
      order {
        isFullCancel
        __typename
      }
      __typename
    }
  }
`;

export default GET_CANCELABLE_ORDER;
