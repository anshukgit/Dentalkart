import gql from 'graphql-tag';

const CUSTOMER_INFO = gql`
  {
    getCustomer {
      id
      email
      mobile
      firstname
      lastname
      taxvat
      addresses {
        id
        customer_id
        region {
          region_code
          region_id
          region
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
  }
`;

export default CUSTOMER_INFO;

// customer{
//     id
//     firstname
//     lastname
//     email
//     taxvat
//     dob
// }

// query {
//   customer {
//     id
//     firstname
//     lastname
//     email
//     mobilenumber
//     confirmation {
//       email_confirm
//       mobile_confirm
//     }
//     taxvat
//     addresses {
//       default_shipping
//       telephone
//     }
//   }
// }
