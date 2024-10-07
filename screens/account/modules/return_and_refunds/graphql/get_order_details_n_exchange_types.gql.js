import gql from "graphql-tag";
import ORDER_DETAILS_FIELDS_FRAGMENT from './fragments/order_details.fragment.gql';
import EXCHANGE_TYPE_FRAGMENT from './fragments/exchange_type.fragment.gql';


const GET_ORDER_DETAILS_N_EXCHANGE_TYPES = gql`
    query($order_id: String!){
        OrderDetails(order_id: $order_id){
            ...orderDetailsFields
        }
    }
    ${ORDER_DETAILS_FIELDS_FRAGMENT}
`;

export default GET_ORDER_DETAILS_N_EXCHANGE_TYPES;
