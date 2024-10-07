import gql from "graphql-tag";
import RETURNS_FRAGMENT from '../fragments/returns.fragment.gql';
import RETURNS_ITEMS_FRAGMENT from '../fragments/return_items.fragment.gql';
import COMMENT_HISTORY_FRAGMENT from '../fragments/comment_history.fragment.gql';

const ADD_RETURN_COMMENT = gql`
    mutation AddReturnComment($returnId: String!, $comment: String!){
        AddReturnComment(returnId:$returnId, comment:$comment){
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

export default ADD_RETURN_COMMENT;
