import gql from "graphql-tag";

const VERIFY_LOGIN_OTP = gql`
    query loginOTPVerify($mobileNumber: String, $otp: String, $websiteId: Int){
        loginOTPVerify(mobileNumber: $mobileNumber, otp: $otp, websiteId: $websiteId)
            {
                message
                status
                token
            }
    }
`;

export default VERIFY_LOGIN_OTP;
