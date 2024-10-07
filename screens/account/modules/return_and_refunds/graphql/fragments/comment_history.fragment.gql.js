import gql from "graphql-tag";

const COMMENT_HISTORY_FRAGMENT = gql`
	fragment commentHistoryFields on ReturnHistory{
        created_at
        executive_name
        comment
        is_customer
  	}
`;

export default COMMENT_HISTORY_FRAGMENT;
