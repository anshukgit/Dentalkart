import gql from "graphql-tag";

const RETURNS_ITEMS_FRAGMENT = gql`
	fragment returnItemFields on Items{
		sku
		name
		qty
		reason
		condition
		description
		status:status_label
		repair_charge
		created_at
		exchange_type
		thumbnail
		attachments_data{
			name
			url
		}
  	}
`;

export default RETURNS_ITEMS_FRAGMENT;
