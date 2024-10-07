import gql from "graphql-tag";
const SET_COUNTRY = gql`
    mutation setCountry(
        $country_code: String!
    ){
        setCurrency(country_code: $country_code){
            country_code
            currency_code
        }
    }
`;
export default SET_COUNTRY;
