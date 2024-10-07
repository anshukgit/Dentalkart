import gql from 'graphql-tag';

const NON_RETURNABLE = gql`
  query {
    getNonReturnable(pagination: {}) {
      count
      result {
        created_at
        product_id
        product_name
        sku
      }
    }
  }
`;

export default NON_RETURNABLE;
