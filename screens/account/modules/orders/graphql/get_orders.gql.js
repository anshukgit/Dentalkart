import gql from 'graphql-tag';

const GET_ORDERS = gql`
  query dkcustomerOrders($timespan: Int) {
    dkcustomerOrders(timespan: $timespan) {
      orders {
        can_cancel
        can_return
        grand_total
        id
        increment_id
        created_at
        status
        currency
        items {
          name
          price
          sku
          product_id
          qty
        }
      }
    }
  }
`;

export const GET_ORDERS_NEW = gql`
  query newCustomerOrders($page: Int, $timespan: Int) {
    customerOrders(page: $page, timespan: $timespan) {
      can_cancel
      can_return
      grand_total
      is_processing
      can_reorder
      id
      increment_id
      created_at
      status
      currency
      items {
        name
        price
        rewardpoints
        sku
        product_id
        qty
        thumbnail
        url_key
      }
    }
  }
`;

export default GET_ORDERS;
