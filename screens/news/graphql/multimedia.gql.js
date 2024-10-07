import gql from 'graphql-tag';
const MULTIMEDIA = gql`
  query multimedia($type: String!, $categories: [String]) {
    multimedia(type: $type, categories: $categories) {
      webinar {
        id
        topic
        source
        category
        description
        start_date
        thumbnail
        price
        created_at
      }
      video {
        id
        category
        title
        source
        author
        created_at
        status
        thumbnail
      }
      course {
        id
        category
        source
        topic
        description
        start_date
        price
        thumbnail
        duration
        created_at
      }
    }
  }
`;
export default MULTIMEDIA;
