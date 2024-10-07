import gql from "graphql-tag";
const BOOKMARK_NEWS = gql`
    mutation bookmarkNews($id: Int){
        bookmarkNews(id: $id){
            ids
        }
    }
`
export default BOOKMARK_NEWS;
