import gql from "graphql-tag";
import CART_FRAGMENT from '../fragments/cart_fagment.gql';

const GET_CART = gql`
	query cart($quoteId: String!){
		dkcart(quoteId: $quoteId){
			...cartFields
	  	}
	}
	${CART_FRAGMENT}
`;

export default GET_CART;
