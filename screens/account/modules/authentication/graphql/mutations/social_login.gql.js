import gql from 'graphql-tag';

const SOCIAL_LOGIN = gql`
  mutation socialLogin($token: String!, $type: EntityType!) {
    socialLogin(input: {token: $token, entity_type: $type}) {
      message
      token
    }
  }
`;
// mutation generateSocialLoginCustomerToken(
//     $token: String!
//     $type: String!
//     $quoteId: String
//   ) {
//     dkgenerateSocialLoginCustomerToken(
//       token: $token
//       type: $type
//       quoteId: $quoteId
//     ) {
//       token
//     }
//   }
export default SOCIAL_LOGIN;
