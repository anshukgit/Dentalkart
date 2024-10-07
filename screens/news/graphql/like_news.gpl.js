import gql from "graphql-tag";
const LIKE_NEWS = gql`
    mutation likeNews($id: Int!){
        likeNews(id: $id){
            count
        }
    }
`
export default LIKE_NEWS;
