import gql from "graphql-tag";
import RETURNS_FRAGMENT from './fragments/returns.fragment.gql';
import RETURNS_ITEMS_FRAGMENT from './fragments/return_items.fragment.gql';
import COMMENT_HISTORY_FRAGMENT from './fragments/comment_history.fragment.gql';

const GET_RETURN_ITEMS = gql`
	query returnItems($return_id: String!){
		Returns(returnId: $return_id){
			...returnFields
			items{
				...returnItemFields
			}
            comment_history: history{
                ...commentHistoryFields
            }
	  	}
	}
	${RETURNS_FRAGMENT}
	${RETURNS_ITEMS_FRAGMENT}
	${COMMENT_HISTORY_FRAGMENT}
`;

export default GET_RETURN_ITEMS;
