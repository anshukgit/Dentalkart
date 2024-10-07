import gql from "graphql-tag";
const MOVE_PRODUCT_IN_WISHLIST = gql`
    mutation MoveProductWishlist($wishlist_id: String!, $target_wishlist_id:String!, $product_ids: [Int!]){
        moveProductWishlist(wishlist_id: $wishlist_id, target_wishlist_id:$target_wishlist_id, product_ids: $product_ids){
            wishlist_id
            target_wishlist_id
        }
    }
`
export default MOVE_PRODUCT_IN_WISHLIST;
