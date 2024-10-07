import gql from 'graphql-tag';

const GET_CAROUSEL_PRODUCTS = gql`
    query productData ($sku : [String], $id:[Int]){
        productData (sku : $sku, id:$id){
            id
                name
                thumbnail_url
                url_key
                type_id
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

export default GET_CAROUSEL_PRODUCTS
