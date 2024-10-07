import gql from 'graphql-tag';

const availablePaymentMethods = gql`
  fragment availablePaymentMethods on CartV2 {
    available_payment_methods {
      code
      title
    }
  }
`;

export default availablePaymentMethods;
