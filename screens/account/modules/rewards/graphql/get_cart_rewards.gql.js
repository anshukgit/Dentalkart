import gql from 'graphql-tag';

const GET_CART_REWARDS = gql`
  {
    applicableRewardPointsV2 {
      max_applied_points
    }
  }
`;

export default GET_CART_REWARDS;
