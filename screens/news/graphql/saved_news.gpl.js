import gql from 'graphql-tag';

const SAVED_NEWS = gql`
  query {
    savedNews{
        id
        content
        is_archived
        image
        date
        source_link
        type
        title
      }
    }
`;

export default SAVED_NEWS;
