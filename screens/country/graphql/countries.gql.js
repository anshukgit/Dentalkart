import gql from "graphql-tag";

const COUNTRIES = gql`
    query{
        countries{
            id
            two_letter_abbreviation
            three_letter_abbreviation
            full_name_locale
            full_name_english
            available_regions{
                id
                code
                name
            }
        }
    }
`;
export default COUNTRIES;
