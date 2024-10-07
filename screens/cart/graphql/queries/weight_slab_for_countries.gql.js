import gql from 'graphql-tag';
const WEIGHT_SLAB_FOR_COUNTRIES = gql`
  query WeightSlabsForCountries($country_id: String!) {
    WeightSlabsForCountries(country_id: $country_id) {
      currency
      price
      weight
      weight_range
    }
  }
`;

export default WEIGHT_SLAB_FOR_COUNTRIES;
