import gql from 'graphql-tag';

const RESEND_SIGNUP_OTP = gql`
  mutation resendSignupOtp($email: String!) {
    resendSignupOtp(email: $email)
  }
`;

export default RESEND_SIGNUP_OTP;
