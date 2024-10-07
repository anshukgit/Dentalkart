import gql from "graphql-tag";

const RESET_PASSWORD_MOBILE = gql`
    mutation resetPasswordOtp($mobileNumber: String, $otp: String, $password: String, $websiteId: Int){
        resetPasswordOtp(mobileNumber: $mobileNumber, otp: $otp, password: $password, websiteId: $websiteId){
            status
            message

        }
    }
`;

export default RESET_PASSWORD_MOBILE;
