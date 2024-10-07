import gql from "graphql-tag";
const UPDATE_WISHLIST = gql`
    mutation UpdateWishlist($wishlist_id: String!, $wishlist_name: String, $access_type: String){
        updateWishlist(wishlist_id: $wishlist_id, wishlist_name: $wishlist_name, access_type: $access_type ){
            wishlist_id
            wishlist_name
        }
    }
`
export default UPDATE_WISHLIST;
