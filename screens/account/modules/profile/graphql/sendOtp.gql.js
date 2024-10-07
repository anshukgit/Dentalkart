import gql from "graphql-tag";
const  SEND_CONFIRMATION_OTP = gql`
	mutation sendConfirmationOtp(
        $type_value: String, 
        $entity_type: String
        ){
    	sendConfirmationOtp(
            input: {
                type_value: $type_value
                entity_type:$entity_type
            } 
        ){
            status
            message
        }
	}
`;
export default SEND_CONFIRMATION_OTP;