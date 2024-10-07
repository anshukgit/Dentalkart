import gql from "graphql-tag";
import CART_FRAGMENT from '../fragments/cart_fagment.gql';

const REMOVE_COUPON = gql`
	mutation removeCouponFromCart($quoteId: String!){
	    dkremoveCouponFromCart(quoteId: $quoteId){
			...cartFields
	    }
	}
	${CART_FRAGMENT}
`;
export default REMOVE_COUPON;
