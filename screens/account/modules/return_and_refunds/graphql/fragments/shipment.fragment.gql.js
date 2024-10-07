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
            sku
            product_id
            return{
                can_return
                returnable_qty
                error_message
                options{
                    repair
                    replacement
                    refund
                    reason_options{
                        label
                        value
                    }
                    condition_options{
                        label
                        value

                    }
                    resolution_options{
                        label
                        value
                    }
                }
            }
        }
        track_info{
            courier
            tracking_id
            pickup_date
        }
    }
`;

export default SHIPMENT_FIELDS_FRAGMENT;
