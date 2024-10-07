import gql from "graphql-tag";

const GET_CAROUSEL_PRODUCTS = gql`
    query productData ($sku : [String]!){
        products(filter : {
            sku : {
                in : $sku
            }
        }, sort : {name: ASC})
        {
            items{
                id
                name
                image
                thumbnail
                url_key
                url_path
                type_id
                stock_status
                short_description
                special_price
                reward_point_product
                sku
                average_rating
                rating_count
                tier_prices{
                    qty
                    value
                    percentage_value
                }
                price{
                    regularPrice{
                        amount{
                            value
                            currency
                        }
                    }
                    minimalPrice{
                        amount{
                            value
                            currency
                        }
                    }
                    maximalPrice{
                        amount{
                            value
                            currency
                        }
                    }
                }
            }
        }
    }
`;

export default GET_CAROUSEL_PRODUCTS;
