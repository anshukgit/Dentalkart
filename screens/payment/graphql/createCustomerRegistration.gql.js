import gql from 'graphql-tag';

const CREATE_CUSTOMER_REGISTRATION = gql`
  mutation CreateCustomerRegistration(
    $registrationNo: String!
    $quoteId: String
  ) {
    createCustomerRegistration(
      input: {registrationNo: $registrationNo}
      quoteId: $quoteId
    ) {
      registration {
        customerEmail
        id
        isDefault
        isGuest
        isVerified
        registrationNo
      }
    }
  }
`;
export default CREATE_CUSTOMER_REGISTRATION;
