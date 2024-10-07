import gql from "graphql-tag";
import CART_FRAGMENT from '../fragments/cart_fagment.gql';

const UPDATE_CART_ITEM = gql`
	mutation updateItem($itemId: Int!, $qty: Int!, $quoteId: String!){
        dkupdateCart(itemId: $itemId, qty: $qty, quoteId: $quoteId){
		    ...cartFields
 		}
    }
    ${CART_FRAGMENT}
`;

export default UPDATE_CART_ITEM;
