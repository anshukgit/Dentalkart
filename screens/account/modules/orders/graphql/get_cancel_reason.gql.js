import gql from 'graphql-tag';

const GET_CANCEL_REASONS = gql`
  query getCancelReasons {
    getCancelReasons {
      id
      reason
    }
  }
`;

export default GET_CANCEL_REASONS;
