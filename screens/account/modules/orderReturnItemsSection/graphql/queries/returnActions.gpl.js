import gql from 'graphql-tag';

const RETURN_ACTIONS = gql`
  query {
    returnActions {
      id
      action
    }
  }
`;

export default RETURN_ACTIONS;
