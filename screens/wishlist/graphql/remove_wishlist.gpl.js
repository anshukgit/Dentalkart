import gql from "graphql-tag";
const REMOVE_WISHLIST = gql`
    mutation RemoveWishlist($wishlist_id: String!, $product_ids: [Int]){
        removeWishlist(wishlist_id: $wishlist_id, product_ids: $product_ids){
            wishlist_id
        }
    }
`
export default REMOVE_WISHLIST;
