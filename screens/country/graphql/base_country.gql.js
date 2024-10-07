import gql from "graphql-tag";
const BASE_COUNTRY = gql`
    query{
        baseCountry{
            country_id
            country
            currency_code
        }
    }
`;
export default BASE_COUNTRY;
