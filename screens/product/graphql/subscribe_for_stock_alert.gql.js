import gql from "graphql-tag";

const SUBSCRIBE_FOR_STOCK_ALERT=gql`
    mutation subscribeForStockAlert($productid: Int!){
        subscribeForStockAlert(product_id:$productid){
            message
        }
    }
`;

export default SUBSCRIBE_FOR_STOCK_ALERT;
