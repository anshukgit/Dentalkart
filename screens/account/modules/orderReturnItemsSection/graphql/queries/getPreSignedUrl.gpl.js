import gql from 'graphql-tag';

const GET_PRESIGNED_URL = gql`
  query ($name: [String!]!) {
    getPreSignedUrl(name: $name) {
      file_name
      pre_signed_url
    }
  }
`;

export default GET_PRESIGNED_URL;
