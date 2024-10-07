import gql from 'graphql-tag';

const LIST_RETURN_ITEMS = gql`
  query listReturnItems($pagination: ListReturnPaginationType!) {
    listReturnItems(pagination: $pagination) {
      count
      result {
        order_id
        return_id
        status
        image
        url
        sku
        name
        amount
        qty
        created_at
        cancelled_items {
          qty
          remarks
          __typename
        }
        __typename
      }
      __typename
    }
  }
`;

export default LIST_RETURN_ITEMS;
