import gql from 'graphql-tag';

const DELETE_CUSTOMER_REGISTRATION = gql`
  mutation DeleteCustomerRegistration($id: Int!, $quoteId: String) {
    deleteCustomerRegistration(id: $id, quoteId: $quoteId) {
      message
    }
  }
`;
export default DELETE_CUSTOMER_REGISTRATION;
