import gql from "graphql-tag";

const BUY_AGAIN = gql`
    query{
        buyAgain{
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
            type_id
            tier_prices{
                customer_group_id
                qty
                value
                percentage_value
                website_id
              }
            is_in_stock
          }
    }
`;

export default BUY_AGAIN;
