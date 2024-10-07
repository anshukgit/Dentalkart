import gql from 'graphql-tag';
const ADD_ADDRESS = gql`
  mutation createCustomerAddressV2(
    $firstname: String!
    $lastname: String!
    $postcode: String!
    $telephone: String!
    $street: [String]
    $country_id: CountryCodeEnumV2!
    $region: CustomerAddressRegionInputV2
    $city: String!
    $custom_attributes: CustomerAddressAttributeInputV2
    $vat_id: String
    $default_shipping: Boolean
    $default_billing: Boolean
  ) {
    createCustomerAddressV2(
      input: {
        firstname: $firstname
        lastname: $lastname
        postcode: $postcode
        telephone: $telephone
        street: $street
        country_id: $country_id
        region: $region
        city: $city
        custom_attributes: [$custom_attributes]
        vat_id: $vat_id
        default_shipping: $default_shipping
        default_billing: $default_billing
      }
    ) {
      id
      customer_id
      region {
        region_code
        region
        region_id
      }
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
      custom_attributes {
        attribute_code
        value
      }
    }
  }
`;

// mutation addAddress(
//   $firstname: String!
//   $lastname: String!
//   $postcode: String!
//   $telephone: String!
//   $street: [String]!
//   $country_id: CountryCodeEnum!
//   $region_id: Int
//   $city: String!
//   $mobile_no_code: String!
//   $mobile_no_value: String!
//   $vat_id: String
//   $default_shipping: Boolean
//   $default_billing: Boolean
// ) {
//   createCustomerAddress(
//     input: {
//       firstname: $firstname
//       lastname: $lastname
//       postcode: $postcode
//       telephone: $telephone
//       street: $street
//       country_code: $country_id
//       region: {region_id: $region_id}
//       city: $city
//       vat_id: $vat_id
//       custom_attributes: [
//         {attribute_code: $mobile_no_code, value: $mobile_no_value}
//       ]
//       default_shipping: $default_shipping
//       default_billing: $default_billing
//     }
//   ) {
//     id
//     firstname
//     lastname
//     postcode
//     telephone
//     street
//     region {
//       region
//       region_id
//       region_code
//       __typename
//     }
//     country_code
//     custom_attributes {
//       attribute_code
//       value
//       __typename
//     }
//     city
//     vat_id
//     default_shipping
//     default_billing
//     __typename
//   }
// }
export default ADD_ADDRESS;
