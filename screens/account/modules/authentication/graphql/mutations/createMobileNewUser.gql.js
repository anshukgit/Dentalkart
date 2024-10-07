import gql from "graphql-tag";

const CREATE_NEW_MOBILE_USER = gql`
    mutation createCustomerAccount($customerEmail: String!, $firstname: String!, $lastname: String!, $password: String!, $mobileNumber: String, $otp: String, $websiteId: Int){
        createCustomerAccount(
            input: {
            	firstname: $firstname,
            	lastname: $lastname,
            	email: $customerEmail,
            	password: $password
            },
            mobileNumber: $mobileNumber,
            otp: $otp,
            websiteId: $websiteId
        ){
            customer {
                firstname
                lastname
                email
            }
            status
            message
            token
        }
    }
`;

export default CREATE_NEW_MOBILE_USER;
