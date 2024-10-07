import gql from 'graphql-tag';
const GET_ADDRESSES = gql`
  query {
    getCustomer {
      addresses {
        id
        region {
          region
          region_id
          region_code
        }
        street
        postcode
        lastname
        firstname
        vat_id
        city
        country_code
        customer_id
        telephone
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
export default GET_ADDRESSES;
