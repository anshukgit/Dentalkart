import gql from 'graphql-tag';

const UPDATE_CUSTOMER_REGISTRATION = gql`
  mutation UpdateCustomerRegistration(
    $id: Int!
    $isDefault: Boolean
    $registrationNo: String!
    $quoteId: String
  ) {
    updateCustomerRegistration(
      id: $id
      input: {isDefault: $isDefault, registrationNo: $registrationNo}
      quoteId: $quoteId
    ) {
      registration {
        customerEmail
        firstname
        id
        isDefault
        isGuest
        isVerified
        lastname
        registrationNo
      }
    }
  }
`;
export default UPDATE_CUSTOMER_REGISTRATION;
