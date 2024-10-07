import gql from "graphql-tag";
const ADD_TO_WISHLIST = gql`
    mutation addItem($product_ids: [Int!] , $wishlist_id :String){
        addProductToWishlist(product_ids: $product_ids, wishlist_id:$wishlist_id){
            wishlist_id
            wishlist_name
            products{
                product_id
                added_date
            }
        }
    }
`;
export default ADD_TO_WISHLIST;
