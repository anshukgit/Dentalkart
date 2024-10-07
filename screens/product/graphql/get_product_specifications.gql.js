import gql from "graphql-tag";

const GET_PRODUCT_SPECIFICATIONS = gql`
    query productSpecifications($id : Int){
        GetAttributesBySku(id: $id){
            attributes{
                attribute_code
                attribute_value
                attribute_label
            }
        }
    }
`;

export default GET_PRODUCT_SPECIFICATIONS;