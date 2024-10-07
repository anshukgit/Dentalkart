import gql from "graphql-tag";

const GET_NOTICES = gql`
    query{
        notices(sections: []) {
            section
            sort_order
            content
            content_type
        }
    }
`;
export default GET_NOTICES;
