import gql from "graphql-tag";
const ADD_PRODUCT_TO_WISHLIST = gql`
    mutation AddProductToWishlist($wishlist_id: String!, $product_ids: [Int!]){
        addProductToWishlist(wishlist_id: $wishlist_id, product_ids: $product_ids){
            wishlist_id
            wishlist_name
            products{
                product_id
                added_date
            }
        }
    }
`
export default ADD_PRODUCT_TO_WISHLIST;
