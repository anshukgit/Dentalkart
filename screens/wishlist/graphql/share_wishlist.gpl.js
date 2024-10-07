import gql from "graphql-tag";
const SHARE_WISHLIST = gql`
query
    ShareWishlist($wishlist_id: String!, $email: String, $mobile_no: Int){
        shareWishlist(wishlist_id: $wishlist_id, email: $email , mobile_no: $mobile_no ){
            url
        }
    }
`
export default SHARE_WISHLIST;
