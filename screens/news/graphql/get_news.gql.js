import gql from 'graphql-tag';

const GET_NEWS = gql`
  query {
        news(page_no: 1) {
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

export default GET_NEWS;
