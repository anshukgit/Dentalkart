import gql from 'graphql-tag';

const RECENTLY_VIEWED_NEWS = gql`
  query {
    recentlyViewedNews{
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

export default RECENTLY_VIEWED_NEWS;
