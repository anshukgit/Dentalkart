import gql from "graphql-tag";

const GET_BUNDLE_PRODUCT_QUERY = gql`
    query productData ($sku : String){
        products(filter : {
            sku : {
                eq : $sku
            }
        })
        {
            items{
                ... on BundleProduct{
                    dynamic_price
                    short_description{
                        html
                    }
                    items{
                        title
                        type
                        required
                        option_id
                        sku
                        position
                        options{
                            label
                            qty
                            price
                            id
                            position
                            is_default
                            price_type
                            can_change_quantity
                        }
                    }
                }
            }
        }
    }
`;

export default GET_BUNDLE_PRODUCT_QUERY;
