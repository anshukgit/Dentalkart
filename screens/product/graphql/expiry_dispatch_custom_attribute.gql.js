import gql from 'graphql-tag';

const GET_DISPATCH_INFORMATION = gql`
  query customAttributeMetadata(
    $attribute_code: String
    $entity_type: String
    $product_id: Int
    $version: Int
  ) {
    customAttributeMetadata(
      attributes: {attribute_code: $attribute_code, entity_type: $entity_type}
      product_id: $product_id
      version: $version
    ) {
      items {
        attribute_code
        entity_type
        attribute_type
        attribute_options {
          label
          value
        }
      }
      dispatch_info_v2 {
        attribute_code
        entity_type
        attribute_type
        attribute_options {
          label
          value
        }
      }
    }
  }
`;

export default GET_DISPATCH_INFORMATION;
