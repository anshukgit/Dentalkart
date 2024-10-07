import gql from "graphql-tag";
import CART_FRAGMENT from '../fragments/cart_fagment.gql';

const APPLY_COUPON = gql`
	mutation applyCoupon($code: String!, $quoteId: String!){
    	dkapplyCouponToCart(input: {
    		coupon_code: $code
    	}, quoteId: $quoteId)
    	{
			...cartFields
	    }
	}
	${CART_FRAGMENT}
`;
export default APPLY_COUPON;
