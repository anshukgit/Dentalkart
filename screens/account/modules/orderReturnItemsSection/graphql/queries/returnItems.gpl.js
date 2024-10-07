import gql from 'graphql-tag';

const RETURN_ITEMS = gql`
  query ($order_id: String!) {
    getReturn(order_id: $order_id) {
      sku
      qty
      name
      image
      reason
      action
      order_id
      created_at
      status
      transporter
      awb_number
      tracking_url
      return_number
      return_cancellable
      remarks {
        user
        comment
        created_at
      }
    }
  }
`;

export default RETURN_ITEMS;
