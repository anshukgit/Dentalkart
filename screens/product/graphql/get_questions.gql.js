import gql from 'graphql-tag';

const GET_QUESTIONS = gql`
  query GetQuestions(
    $product_id: Int
    $search: String
    $enable: String
    $rowsPerPage: Int
    $pageNumber: Int
  ) {
    getQuestions(
      search: {product_id: $product_id, search: $search, enable: $enable}
      pagination: {rowsPerPage: $rowsPerPage, pageNumber: $pageNumber}
    ) {
      result {
        _id
        question
        answer {
          value
          updated_by
          updated_at
          __typename
        }
        product_id
        enable
        created_at
        like
        dislike
        __typename
      }
      count
      __typename
    }
  }
`;

export default GET_QUESTIONS;
