import gql from 'graphql-tag';
const PREVIOUS_RETURN_LIST = gql`
  query itemPreviousReturnList($input: ItemPreviousReturnListInput!) {
    itemPreviousReturnList(input: $input) {
      return_id
      order_id
      image
      qty
      sku
      created_at
      __typename
    }
  }
`;

export default PREVIOUS_RETURN_LIST;
