import gql from "graphql-tag";
import RETURNS_FRAGMENT from '../fragments/returns.fragment.gql';

const CANCEL_RETURN = gql`
    mutation cancelReturn($return_id: String!){
        CancelReturn(returnId: $return_id){
            ...returnFields
        }
    }
    ${RETURNS_FRAGMENT}
`;

export default CANCEL_RETURN;
