import gql from 'graphql-tag';

const VERIFY_OTP = gql`
  mutation verifyOTP(
    $email_or_Mobile: String
    $otp_or_password: String!
    $entityType: Entity_Type
    $actionType: Verify_OTP_Actions
  ) {
    verifyOTP(
      input: {
        entity_type: $entityType
        entity: $email_or_Mobile
        otp_or_password: $otp_or_password
        action_type: $actionType
      }
    ) {
      message
      token
    }
  }
`;

// mutation checkOTP($email: String!, $otp: String!){
//     confirmSignupOtp(email: $email, otp: $otp)
// }
export default VERIFY_OTP;
