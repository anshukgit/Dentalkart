import gql from "graphql-tag";

const RETURNS_FRAGMENT = gql`
	fragment returnFields on Returns{
        return_id: increment_id
        order_id
        status:status_label
        shipment_status
        shipping_amount
        total_repair_charge
        created_at
        can_cancel
		agreement
		description
  	}
`;

export default RETURNS_FRAGMENT;
