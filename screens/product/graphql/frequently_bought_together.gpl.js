import gql from "graphql-tag";

const FREQUENTLY_BOUGHT_TOGETHER = gql`
    query frequentlyBoughtTogether($id: Int!){
        frequentlyBoughtTogether(id: $id){
            id
            related{
                id
                score
            }
        }
    }
`;

export default FREQUENTLY_BOUGHT_TOGETHER;