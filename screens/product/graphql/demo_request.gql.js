import gql from 'graphql-tag';
const DEMO_REQUEST = gql`
  mutation demoRequest(
    $customer_name: String!
    $mobile_number: String!
    $email_id: String
    $clinic_name: String
    $pincode: String!
    $address: String!
    $product_id: Int!
  ) {
    demoRequest(
      input: {
        customer_name: $customer_name
        email_id: $email_id
        mobile_number: $mobile_number
        clinic_name: $clinic_name
        address: $address
        pincode: $pincode
        product_id: $product_id
      }
    ) {
      message
    }
  }
`;
export default DEMO_REQUEST;
