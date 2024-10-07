import gql from "graphql-tag";

const GET_CUSTOMER_CART_ID = gql`
    query{
        customerCart{
           id
            items {
                id
                product {
                    name
                    sku
                }
                  quantity

            }
        }
    }
`;
export default GET_CUSTOMER_CART_ID;
