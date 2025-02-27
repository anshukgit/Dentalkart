import gql from "graphql-tag";
const COUNTRY = gql`
    query country($id: String!){
        country(id: $id){
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
export default COUNTRY;
