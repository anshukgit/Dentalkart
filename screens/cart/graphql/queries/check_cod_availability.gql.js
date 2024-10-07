import gql from "graphql-tag";
const CHECK_COD_AVAILABILITY = gql`
	query checkcod($pincode: String!, $quoteId: String!){
		checkcod(pincode: $pincode, quoteId: $quoteId){
		  	type
		  	message
			message_arr
			cod_available
			service_available
		}
		 stateDetailFromPincode(pincode: $pincode){
			State
		    District
		    Country
		    Pincode
		 }

	}
`;


export default CHECK_COD_AVAILABILITY;
