import gql from "graphql-tag";

const COUNTRIES_LIST = gql`
    query{
        countries{
            id
            two_letter_abbreviation
            three_letter_abbreviation
            full_name_english
        }
    }
`;
export default COUNTRIES_LIST;
