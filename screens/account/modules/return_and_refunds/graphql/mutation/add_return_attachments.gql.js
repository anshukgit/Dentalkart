import gql from "graphql-tag";
import RETURNS_FRAGMENT from '../fragments/returns.fragment.gql';
import RETURNS_ITEMS_FRAGMENT from '../fragments/return_items.fragment.gql';
import COMMENT_HISTORY_FRAGMENT from '../fragments/comment_history.fragment.gql';
const ADD_RETURN_ATTACHMENTS=gql`
    mutation AddReturnAttachments($returnId:String!,$sku:String!,$attachments:[String]!){
        AddReturnAttachments(returnId:$returnId,sku:$sku,attachments:$attachments){
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
export default ADD_RETURN_ATTACHMENTS;
