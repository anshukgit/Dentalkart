import gql from "graphql-tag";

const GET_PRODUCT_ATTACHMENTS_QUERY = gql`
    query GetAttributesBySku($sku: String!){
        GetAttributesBySku(sku: $sku){
            attachments{
                thumbnail
                title
                url
              }
              tags{
                tag_id
                tag_title
                identifier
                tag_description
                status
                position
                image
              }
        }
    }
`;

export default GET_PRODUCT_ATTACHMENTS_QUERY;