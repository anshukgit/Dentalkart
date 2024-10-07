import gql from "graphql-tag";
import toSource from "@helpers/toSource";
import CART_FRAGMENT from '../fragments/cart_fagment.gql';

const ADD_TO_CART = (options) => (
	gql`
		mutation addToCart(
			$type: String!,
			$sku: String!,
			$qty: Float!,
			$quoteId: String
		){
		    dkaddProductToCart(input: {
		    	type: $type,
		    	cartItem: {
		    		sku: $sku,
		    		qty: $qty
		    	},
		    	quoteId: $quoteId
		    	${options ? `options: ${options.toSource()}` : ''}
		    })
		    {
		    	...cartFields
		    }
		}
		${CART_FRAGMENT}
	`
);
export default ADD_TO_CART;
