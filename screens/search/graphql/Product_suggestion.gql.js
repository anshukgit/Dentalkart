import gql from 'graphql-tag';

const ADD_PRODUCT_SUGGESTION_DETAILS = gql`
  mutation AddProductSuggestionDetails(
    $searched_key: String
    $product_name: String
    $brand: String
    $comment: String
    $user: String
  ) {
    addProductSuggestionDetails(
      input: {
        searched_key: $searched_key
        product_name: $product_name
        brand: $brand
        comment: $comment
        user: $user
      }
    ) {
      searched_key
      product_name
      brand
      comment
      createdAt
      user
    }
  }
`;
export default ADD_PRODUCT_SUGGESTION_DETAILS;
