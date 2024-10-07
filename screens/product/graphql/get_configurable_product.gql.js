import gql from "graphql-tag";

const GET_CONFIGURABLE_PRODUCT_QUERY = gql`
    query productData ($sku : String){
        products(filter : {
            sku : {
                eq : $sku
            }
        })
        {
            items{
                ... on ConfigurableProduct {
                    configurable_options {
                        attribute_code
                        attribute_id
                        id
                        label
                        position
                        use_default
                        product_id
                        values {
                            default_label
                            label
                            store_label
                            use_default_value
                            value_index
                        }
                    }
                    variants {
                        product{
                            id
                            sku
                            name
                            special_price
                            stock_status
                            weight
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
                            arch
                            burretention
                            capsules
                            code
                            color
                            concentration
                            pd_expiry_date
                            dispatch_date
                            expiry
                            flavour
                            head
                            is_cod
                            kit
                            length
                            liberal_link
                            molar
                            molartube
                            packsize
                            pinkblue_link
                            reciprocation
                            scalertips
                            shade
                            size
                            toothnumber
                            trays
                        }
                    }
                }
            }
        }
    }
`;

export default GET_CONFIGURABLE_PRODUCT_QUERY;
