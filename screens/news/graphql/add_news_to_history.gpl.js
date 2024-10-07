import gql from "graphql-tag";
const ADD_TO_NEWS_HISTORY = gql`
    mutation addNewsToHistory($id: Int!){
        addNewsToHistory(id: $id){
            ids
        }
    }
`
export default ADD_TO_NEWS_HISTORY;
