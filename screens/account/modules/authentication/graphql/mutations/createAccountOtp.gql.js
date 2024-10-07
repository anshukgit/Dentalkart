import gql from "graphql-tag";

const CREATE_ACCOUNT_OTP = gql`
    mutation createAccountOTP($mobileNumber: String, $websiteId: Int){
        createAccountOTP(mobileNumber: $mobileNumber, websiteId: $websiteId){
            status
            message

        }
    }
`;

export default CREATE_ACCOUNT_OTP;
