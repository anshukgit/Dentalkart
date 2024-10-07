import gql from 'graphql-tag';

const RETURN_VALIDATE = gql`
  query returnValidate($orderId: String!) {
    returnValidate(orderId: $orderId) {
      order_id
      items {
        name
        sku
        qty_ordered
        image
        price
        url_key
        max_qty_returnable
        non_returnable
        is_tat_expired
        delivered_qty
        error
        is_free_product
        __typename
      }
      __typename
    }
  }
`;

export default RETURN_VALIDATE;
