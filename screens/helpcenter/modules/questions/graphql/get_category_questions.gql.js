import gql from "graphql-tag";

const GET_CATEGORY_QUESTIONS = gql`
    query($id: Int!){
        faqcategoryitem(id: $id) {
            id
            question
        }
    }
`;

export default GET_CATEGORY_QUESTIONS;
