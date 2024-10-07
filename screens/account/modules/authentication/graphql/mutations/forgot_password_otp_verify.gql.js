import gql from "graphql-tag";

const VERIFY_FORGOT_PASSWORD_OTP = gql`
    query forgotPassworOTPVerify($mobileNumber: String, $otp: String, $websiteId: Int){
        forgotPassworOTPVerify(mobileNumber: $mobileNumber, otp: $otp, websiteId: $websiteId)
            {
                message
                status
            }
    }
`;

export default VERIFY_FORGOT_PASSWORD_OTP;
