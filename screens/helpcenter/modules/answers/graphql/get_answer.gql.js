import gql from "graphql-tag";

const GET_ANSWER = gql`
    query($id: Int!){
        faqitem(id: $id) {
            id
            question
            answer
        }
    }
`;

export default GET_ANSWER;
