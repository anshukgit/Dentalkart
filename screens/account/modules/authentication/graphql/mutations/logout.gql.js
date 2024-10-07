import gql from 'graphql-tag';

const LOGOUT = gql`
  mutation {
    LogoutOrRevokeCustomerToken {
      message
      status
    }
  }
`;

// mutation{
//     revokeCustomerToken{
//         result
//     }
// }

export default LOGOUT;
