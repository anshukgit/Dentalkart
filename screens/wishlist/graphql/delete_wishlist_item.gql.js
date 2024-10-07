import gql from "graphql-tag";
const DELETE_WISHLIST_ITEM = gql`
    mutation removeItem($wishlistItemId: Int!){
        dkRemoveItemFromWishlist(wishlistItemId: $wishlistItemId){
            items{
                id
                wishlist_id
                product_id
                qty
                description
                added_at
                sku
            }
        }
    }
`;
export default DELETE_WISHLIST_ITEM;
