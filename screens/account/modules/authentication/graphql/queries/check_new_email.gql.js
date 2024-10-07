import gql from "graphql-tag";

const CHECK_NEW_EMAIL = gql`
    query checkEmail($email: String!){
        checkCustomerEmail(email: $email){
	        is_exist
	        code
	    }
    }
`;

export default CHECK_NEW_EMAIL;