import gql from 'graphql-tag';

const GET_CUSTOMER_REGISTARTION = gql`
  query GetCustomerRegistration($id: Int, $quoteId: String) {
    getCustomerRegistrations(id: $id, quoteId: $quoteId) {
      config {
        moduleEnable
        registrationNoRequired
        message
      }
      registrations {
        id
        registrationNo
        customerEmail
        firstname
        lastname
        isDefault
        isVerified
        isGuest
      }
    }
  }
`;
export default GET_CUSTOMER_REGISTARTION;
