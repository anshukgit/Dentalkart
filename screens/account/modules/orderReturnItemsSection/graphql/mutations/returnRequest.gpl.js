import gql from 'graphql-tag';

const RETURN_REQUEST = gql`
  mutation returnRequest(
    $items: [ReturnItemsInput]
    $remarks: String
    $order_id: String!
    $payment_method: String
    $description: String!
    $attachments: [String]
  ) {
    returnRequest(
      items: $items
      remarks: $remarks
      order_id: $order_id
      payment_method: $payment_method
      description: $description
      attachments: $attachments
      source: "app"
    ) {
      order_id
      returns {
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
  }
`;
export default RETURN_REQUEST;
