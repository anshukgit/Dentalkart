import gql from 'graphql-tag';

const GET_FORGOT_PASSWORD_OTP = gql`
  mutation sendForgotPasswordOTP(
    $email_or_mobile: String
    $entityType: Entity_Type
    $actionType: Forgot_Password_OTP_Actions
  ) {
    sendForgotPasswordOTP(
      input: {
        entity: $email_or_mobile
        entity_type: $entityType
        action_type: $actionType
      }
    ) {
      message
      token
    }
  }
`;

// mutation forgotPassworOTP($mobileNumber: String, $websiteId: Int){
//     forgotPassworOTP(mobileNumber: $mobileNumber, websiteId: $websiteId){
//         status
//         message

//     }
// }

export default GET_FORGOT_PASSWORD_OTP;
