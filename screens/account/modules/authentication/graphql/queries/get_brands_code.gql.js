import gql from 'graphql-tag';

const GET_BRANDS_QUERY = gql`
  query {
    getBrand {
      id
      name
      url_path
      brand_id
      is_active
    }
  }
`;
export default GET_BRANDS_QUERY;
