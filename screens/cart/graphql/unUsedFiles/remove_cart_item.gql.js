import gql from "graphql-tag";
import CART_FRAGMENT from '../fragments/cart_fagment.gql';

const REMOVE_CART_ITEM = gql`
	mutation removeItem($itemId: Int!, $quoteId: String!){
        dkremoveFromCart(itemId: $itemId, quoteId: $quoteId){
		    ...cartFields
        }
    }
    ${CART_FRAGMENT}
`;

export default REMOVE_CART_ITEM;
