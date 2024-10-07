import gql from 'graphql-tag';

const CREATE_NEW_USER = gql`
  mutation createCustomerV2(
    $email: String
    $firstname: String!
    $lastname: String!
    $password: String!
    $mobile: String
    $referralCode: String
  ) {
    createCustomerV2(
      input: {
        firstname: $firstname
        lastname: $lastname
        password: $password
        email: $email
        mobile: $mobile
        referralCode: $referralCode
      }
    ) {
      id
      firstname
      lastname
      email
      mobile
      token
    }
  }
`;

//   mutation checkOTP($email: String!, $firstname: String!, $lastname: String!, $password: String!){
//     createCustomer(input: {
//         firstname: $firstname,
//         lastname: $lastname,
//         email: $email,
//         password: $password
//     }){
//         customer {
//             firstname
//             lastname
//             email
//         }
//     }
// }

export default CREATE_NEW_USER;
