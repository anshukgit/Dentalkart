import gql from 'graphql-tag';

const GENERATE_MOBILE_NUMBER_TOKEN = gql`
  query login($mobileEmail: String, $password: String, $websiteId: Int) {
    login(
      mobileEmail: $mobileEmail
      password: $password
      websiteId: $websiteId
    ) {
      message
      status
      token
    }
  }
`;

export default GENERATE_MOBILE_NUMBER_TOKEN;
