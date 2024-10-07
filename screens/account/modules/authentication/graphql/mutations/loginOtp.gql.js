import gql from "graphql-tag";

const GET_LOGIN_OTP = gql`
    mutation loginOTP($mobileNumber: String!, $websiteId: Int!){
        loginOTP(mobileNumber: $mobileNumber, websiteId: $websiteId){
            status
            message

        }
    }
`;

export default GET_LOGIN_OTP;
