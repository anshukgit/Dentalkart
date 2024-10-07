import gql from 'graphql-tag';

export const GET_USER_INFO_QUERY = gql`
  query userInfo($quoteId: String!) {
    dkcustomer {
      id
      firstname
      lastname
      email
      gender {
        options {
          label
          value
        }
        active
      }
      taxvat
    }
    dkcart(quoteId: $quoteId) {
      id
      items_count
      items_qty
    }
    IsPopupEnable
  }
`;

export const GET_CART_INFO_QUERY = gql`
  query userInfo($quoteId: String!) {
    dkcart(quoteId: $quoteId) {
      id
      items_count
      items_qty
    }
  }
`;
