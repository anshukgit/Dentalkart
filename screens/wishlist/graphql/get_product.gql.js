import gql from "graphql-tag";

const GET_PRODUCT = gql`
    query ProductData ($id : [Int], $sku:[String]){
        productData(id: $id, sku:$sku)
        {
            average_rating
            id
            image_url
            manufacturer
            name
            rating_count
            reward_point_product
            short_description
            sku
            special_price
            thumbnail_url
            url_key
            type_id
            tier_prices{
                qty
                value
                percentage_value
            }
            price{
                regularPrice{
                    amount{
                        currency_symbol
                        value
                        currency
                    }
                }
                minimalPrice{
                    amount{
                        currency_symbol
                        value
                        currency
                    }
                }
                maximalPrice{
                    amount{
                        currency_symbol
                        value
                        currency
                    }
                }
            }
        }
    }
`;

export default GET_PRODUCT;
