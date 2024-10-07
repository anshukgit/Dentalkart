import gql from 'graphql-tag';
const GET_NEW_ORDER_DETAILS = gql`
  query OrderDetailsV4($order_id: String!) {
    OrderDetailsV4(order_id: $order_id) {
      order_id
      order_date
      payment_method
      payment_method_code
      currency
      can_return
      can_cancel
      order_status
      order_summary {
        label
        value
        code
        area
      }
      shipping_address {
        street
        region_id
        region
        postcode
        name
        city
        email
        telephone
        country_id
        company
        vat_id
        alternate_mobile
      }
      billing_address {
        street
        region_id
        region
        postcode
        name
        city
        email
        telephone
        country_id
        company
        vat_id
        alternate_mobile
      }
      rewards {
        rewardpoints_used
        rewardpoints_used_monetary
        rewardpoints_earned
        reward_icon
        reward_term
      }
      packages {
        qty
        status
        date
        transporter
        tracking_number
        tracking_url
        collectable_amount
        delivereddate
        deliveryNumber
        shipment_value
        pick_date
        pack_date
        status_history {
          status
          date
          current
        }
        items {
          sku
          name
          qty_ordered
          qty_shipped
          qty_canceled
          qty_refunded
          price
          image
          status
        }
      }
    }
  }
`;

export default GET_NEW_ORDER_DETAILS;
