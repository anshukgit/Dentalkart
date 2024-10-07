import gql from "graphql-tag";

const UPDATE_LIKE = gql`
    mutation updateLike($id: Int, $actiontype: String ){
        updateLike(id: $id, actiontype: $actiontype) {
            type
            msg
        }
    }
`;

export default UPDATE_LIKE;
