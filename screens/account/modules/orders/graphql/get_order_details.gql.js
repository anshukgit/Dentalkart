import gql from "graphql-tag";

const SHIPMENT_FIELDS_FRAGMENT = gql`
    fragment shipmentFields on Order_details{
        label
        current_status
        id
        code
        history{
            title
            time
            date
            active
        }
        print_invoice
        items{
            name
            qty
            price
            thumbnail
            rewardpoints
        }
        track_info{
            courier
            tracking_id
            pickup_date
        }
    }
`;


const GET_ORDER_DETAILS = gql`
    query($order_id: String!){
        OrderDetails(order_id: $order_id){
            order_id
            payment_method
            currency
            order_summary{
                label
                value
                code
            }
            shipping_address{
                street
                region_id
                region
                postcode
                name
                city
                email
                telephone
                country_id
                company
                vat_id
                alternate_mobile
            }

            rewards{
                rewardpoints_used
                rewardpoints_used_monetary
                rewardpoints_earned
                reward_icon
                reward_term
            }
            order_details{
                In_Process{
                    ...shipmentFields
                }
                Canceled{
                    ...shipmentFields
                }
                My_Shipments{
                    ...shipmentFields
                }
                Refunded{
                    ...shipmentFields
                }
            }
        }
    }
    ${SHIPMENT_FIELDS_FRAGMENT}
`;

export default GET_ORDER_DETAILS;
