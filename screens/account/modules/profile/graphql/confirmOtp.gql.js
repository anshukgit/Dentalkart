import gql from "graphql-tag";
const  VERIFY_CONFIRMATION_OTP = gql`
    query verifyConfirmationOtp($type_value: String!, $entity_type: String!, $random_code: String!){
        verifyConfirmationOtp(type_value: $type_value, entity_type: $entity_type, random_code: $random_code)    
            {
                status
                message
            }
        }
    `;
export default VERIFY_CONFIRMATION_OTP;