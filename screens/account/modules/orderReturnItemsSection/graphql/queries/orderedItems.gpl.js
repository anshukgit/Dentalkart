import gql from 'graphql-tag';

const ORDERED_ITEMS = gql`
  query ($timespan: Int) {
    customerOrders(timespan: $timespan) {
      can_cancel
      can_reorder
      can_return
      created_at
      currency
      grand_total
      id
      increment_id
      is_processing
      items {
        can_return
        name
        price
        product_id
        qty
        returnable_qty
        rewardpoints
        sku
        thumbnail
        url_key
      }
      status
      payment_method
    }
  }
`;

export default ORDERED_ITEMS;
