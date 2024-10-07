import gql from "graphql-tag";
import toSource from "@helpers/toSource";

const ADD_BUNDLE_PRODUCT_TO_CART = (options) => (
    gql`
        mutation addBundleProductsToCart($cart_id: String!, $parent_sku : String!, $qty : Float!){
            addBundleProductsToCart(
                input: {
                    cart_id: $cart_id
                    cart_items: [
                        {
                            data: {
                                sku: $parent_sku
                                quantity: $qty
                            }
                            bundle_options: ${options.length>0 ? options.toSource() : `[]`}
                        },
                    ]

                }){
                    cart {
                        items {
                            id
                            quantity
                            product {
                                sku
                            }
                            ... on BundleCartItem {
                                 bundle_options {
                                    id
                                    label
                                    type
                                    values {
                                        id
                                        label
                                        price
                                        quantity
                                    }
                                }
                            }
                        }
                    }
                }
        }`
);

export default ADD_BUNDLE_PRODUCT_TO_CART;
