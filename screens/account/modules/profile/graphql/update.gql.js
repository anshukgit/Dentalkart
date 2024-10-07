import gql from 'graphql-tag';
const UPDATE_INFO = gql`
  mutation updateCustomerV2(
    $firstname: String
    $lastname: String
    $taxvat: String
  ) {
    updateCustomerV2(
      input: {firstname: $firstname, lastname: $lastname, taxvat: $taxvat}
    ) {
      id
      email
      mobile
      firstname
      lastname
      taxvat
      addresses {
        id
        customer_id
        region_id
        country_id
        country_code
        street
        company
        telephone
        fax
        postcode
        city
        firstname
        lastname
        prefix
        suffix
        vat_id
        default_shipping
        default_billing
      }
    }
  }
`;
// mutation updateInfo(
//   $firstname: String
//   $lastname: String
//   $email: String
//   $taxvat: String
//   $is_subscribed: Boolean
// ) {
//   updateCustomer(
//     input: {
//       firstname: $firstname
//       lastname: $lastname
//       email: $email
//       taxvat: $taxvat
//       is_subscribed: $is_subscribed
//     }
//   ) {
//     customer {
//       id
//       firstname
//       lastname
//       email
//       taxvat
//       is_subscribed
//     }
//   }
// }
export default UPDATE_INFO;
