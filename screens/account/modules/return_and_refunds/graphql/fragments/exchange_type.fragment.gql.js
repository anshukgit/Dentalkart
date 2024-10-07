import gql from "graphql-tag";

const EXCHANGE_TYPE_FRAGMENT = gql`
	fragment exchangeTypeFields on ReturnExchange{
        exchange_options{
            lable
            value
        }
        reasons{
            reason_id
            reason_code
            reason_label
        }
        conditions{
            condition_id: entity_id
            condition_code
            condition_label
        }
        reason_condition_map{
            entity_id
            reason_id
            condition_id
            exchange_type
        }
  	}
`;

export default EXCHANGE_TYPE_FRAGMENT;
