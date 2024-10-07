import gql from "graphql-tag";
import SHIPMENT_FIELDS_FRAGMENT from './shipment.fragment.gql';

const ORDER_DETAILS_FIELDS_FRAGMENT = gql`
	fragment orderDetailsFields on Details{
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
    ${SHIPMENT_FIELDS_FRAGMENT}
`;

export default ORDER_DETAILS_FIELDS_FRAGMENT;
