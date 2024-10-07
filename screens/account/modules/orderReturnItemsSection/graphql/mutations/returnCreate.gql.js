import gql from 'graphql-tag';

const RETURN_REQUEST_CREATE = gql`
  mutation createReturn($input: ReturnRequestInput!) {
    createReturn(input: $input) {
      order_id
      returns {
        action
        awb_number
        created_at
        image
        name
        order_id
        qty
        reason
        sub_reason
        remarks {
          comment
          __typename
        }
        return_cancellable
        return_number
        sku
        status
        tracking_url
        transporter
        __typename
      }
      __typename
    }
  }
`;
export default RETURN_REQUEST_CREATE;
