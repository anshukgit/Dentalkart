import gql from 'graphql-tag';

const GET_GUEST_CART_ID = gql`
  mutation {
    createEmptyCartV2(input: {})
  }
`;
export default GET_GUEST_CART_ID;
