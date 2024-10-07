import gql from 'graphql-tag';

const GET_MERGE_CART = gql`
  mutation getMergeCartV2(
    $source_cart_id: String!
    $destination_cart_id: String!
  ) {
    mergeCartsV2(
      source_cart_id: $source_cart_id
      destination_cart_id: $destination_cart_id
    ) {
      items {
        id
        product {
          name
          sku
        }
        quantity
      }
    }
  }
`;

export default GET_MERGE_CART;
