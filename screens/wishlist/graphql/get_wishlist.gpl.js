import gql from "graphql-tag";
const GET_WISHLIST = gql`
query
    getWishlist($wishlist_ids: [String], $sharing_hash: [String]){
        getWishlist(wishlist_ids: $wishlist_ids, sharing_hash: $sharing_hash){
        wishlist_id
        hash_key
        wishlist_name
        default
        access_type
        products{
            product_id
            added_date
            }
        }
    }
`
export default GET_WISHLIST;
