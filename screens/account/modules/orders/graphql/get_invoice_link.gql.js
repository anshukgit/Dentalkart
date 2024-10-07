import gql from 'graphql-tag';

const GET_INVOICE_LINK = gql`
  query GetInvoiceLink($order_id: String!) {
    GetInvoiceLink(order_id: $order_id) {
      order_id
      link
    }
  }
`;

export default GET_INVOICE_LINK;
