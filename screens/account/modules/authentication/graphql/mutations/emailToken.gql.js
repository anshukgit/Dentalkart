import gql from 'graphql-tag';

const GENERATE_EMAIL_TOKEN = gql`
  mutation generateCustomerToken($email: String!, $password: String!) {
    generateCustomerToken(email: $email, password: $password) {
      token
    }
  }
`;

export default GENERATE_EMAIL_TOKEN;
