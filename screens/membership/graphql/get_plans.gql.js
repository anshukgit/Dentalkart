import gql from 'graphql-tag';

const GET_PLANS = gql`
  query {
    memberShipInfo {
      isActive
      plans {
        id
        plan_duration
        price
        sku
        is_default
      }
    }
  }
`;
export default GET_PLANS;
