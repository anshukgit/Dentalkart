import gql from "graphql-tag";

const LOGIN = gql`
    mutation login($username: String!, $password: String!){
        generateCustomerToken(email: $username, password: $password){
            token
        }
    }
`;

export default LOGIN;
