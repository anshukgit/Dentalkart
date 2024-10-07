import gql from 'graphql-tag';

const SUBMIT_REVIEW = gql`
  mutation PostProductReviewV2(
    $details: String
    $id: Int
    $nickname: String
    $product_id: Int
    $rating: Int
    $title: String
  ) {
    postProductReviewV2(
      review: {
        details: $details
        id: $id
        nickname: $nickname
        product_id: $product_id
        rating: $rating
        title: $title
      }
    ) {
      created_at
      customer_id
      details
      id
      nickname
      product_id
      rating
      status
      status_label
      title
      __typename
    }
  }
`;
export default SUBMIT_REVIEW;
