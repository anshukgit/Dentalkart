import gql from 'graphql-tag';

const GET_FEATURED_CATEGORY = gql`
  query {
       featuredCategory{
            title
            items {
                categoryName
                url_path
                categoryId
                iconUrl
            }
        }
    }
`;

export default GET_FEATURED_CATEGORY;
