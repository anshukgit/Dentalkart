import gql from "graphql-tag";

const CUSTOMER_INFO = gql`
    query{
        customer{
            firstname
            lastname
            email
        }
    }
`;

export default CUSTOMER_INFO
