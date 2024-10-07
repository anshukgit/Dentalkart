import gql from 'graphql-tag';

const RETURN_REASONS = gql`
  {
    getReturnReasonList {
      id
      reason
      code
      enable
      attachment
      user
      sub_reasons {
        id
        reason
        code
        enable
        attachment
        __typename
      }
      return_actions {
        id
        action
        enable
        customer_enable
        user
        __typename
      }
      __typename
    }
  }
`;

export default RETURN_REASONS;
