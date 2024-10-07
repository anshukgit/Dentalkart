import gql from "graphql-tag";

const GET_NOTICES = gql`
    query{
        notices(sections: []) {
            colour
            content
            content_type
            notification_type
            section
            sort_order
            source
            background
            link
        }
    }
`;
export default GET_NOTICES;
