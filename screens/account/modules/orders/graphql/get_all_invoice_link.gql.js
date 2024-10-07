import gql from 'graphql-tag';
const GET_ALL_INVOICE_LINK = gql`
  query shipmentInvoice($awb_number: String!, $order_id: String!) {
    shipmentInvoice(awb_number: $awb_number, order_id: $order_id) {
      awb_number
      error_message
      is_error
      order_id
      pdf_link
      __typename
    }
  }
`;

export default GET_ALL_INVOICE_LINK;
