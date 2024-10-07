import gql from 'graphql-tag';

const CHECK_PRODUCT_BOUGHT = gql`
  query checkProductBought($id: Int!) {
    checkCustomerBoughtProduct(product_id: $id)
  }
`;

export default CHECK_PRODUCT_BOUGHT;
