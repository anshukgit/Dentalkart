import gql from "graphql-tag";

const VERIFY_CREATE_ACCOUNT_OTP = gql`
    query createAccountOTPVerify($mobileNumber: String, $otp: String, $websiteId: Int){
        createAccountOTPVerify(mobileNumber: $mobileNumber, otp: $otp , websiteId: $websiteId)
            {
                message
                status
                
            }
    }
`;

export default VERIFY_CREATE_ACCOUNT_OTP;
