import gql from 'graphql-tag';
const GET_ADDRESS_VALIDATION_RULES = gql`
  query getValidationRules($countryId: String!) {
    getValidationRules(country_id: $countryId) {
      alternate_telephone_required
      emailsignup
      mobilesignup
      whatsappsignup
      postcode_format
      postcode_required
      service_availability_enabled
      state_dropdown_required
      state_required
      tax_format
      tax_label
      tax_required
      telephone_code
      telephone_format
    }
  }
`;
export default GET_ADDRESS_VALIDATION_RULES;
