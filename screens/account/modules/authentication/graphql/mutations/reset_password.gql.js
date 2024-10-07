import gql from 'graphql-tag';

const RESET_PASSWORD = gql`
  mutation verifyForgotPasswordOTP(
    $email_or_mobile: String
    $otp: String
    $newPassword: String
    $entityType: Entity_Type
    $actionType: Verify_Forgot_Password_OTP_Actions
  ) {
    verifyForgotPasswordOTP(
      input: {
        entity: $email_or_mobile
        entity_type: $entityType
        otp_or_password: $otp
        new_password: $newPassword
        action_type: $actionType
      }
    ) {
      message
      token
    }
  }
`;

// mutation checkEmail($email: String!, $otp: String!, $newPassword: String!){
//     resetPassword(input: {
//         email: $email,
//         reset_token: $otp,
//         new_password: $newPassword
//     })
// }

export default RESET_PASSWORD;
