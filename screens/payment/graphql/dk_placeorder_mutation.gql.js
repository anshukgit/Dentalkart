import gql from 'graphql-tag';

const PLACE_ORDER_MUTATION = gql`
  mutation dkplaceOrderV2(
    $cart_id: String!
    $payment_method: String!
    $attribute: [ExtensionAttributeInput]!
  ) {
    dkplaceOrderV2(
      input: {
        cart_id: $cart_id
        payment_method: $payment_method
        extension_attributes: $attribute
      }
    ) {
      order_number
      reference_number
      merchant_id
      amount
      currency
    }
  }
`;
export default PLACE_ORDER_MUTATION;
