import gql from "graphql-tag";
const CREATE_WISHLIST = gql`
    mutation CreateWishlist($wishlist_name: String!, $access_type: String!){
        createWishlist(wishlist_name: $wishlist_name, access_type: $access_type){
            wishlist_id
            customer_id
            access_type
            wishlist_name
        }
    }
`
export default CREATE_WISHLIST;
