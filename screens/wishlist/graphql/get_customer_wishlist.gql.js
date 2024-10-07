import gql from "graphql-tag";
const GET_CUSTOMER_WISHLIST_ITEMS = gql`
query{
        customer {
            wishlist{
                items_count
                sharing_code
                updated_at
                items {
                    id
                    description
                    qty
                    product {
                        id
                        sku
                        name
                        image{
                            label
                            url
                        }
                        media_gallery_entries{
                            id
                            file
                            types
                        }
                        url_key
                        url_path
                        type_id
                        stock_status
                        short_description{
                            html
                        }
                        special_price
                        manufacturer
                        average_rating
                        rating_count
                        msrp
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
                        price_range {
                            maximum_price {
                                regular_price {
                                    value
                                }
                            }
                        }
                    }
                }
            }
        }
    }
`;
export default GET_CUSTOMER_WISHLIST_ITEMS;
