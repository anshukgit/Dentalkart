import gql from 'graphql-tag';

const GET_PRODUCT_REVIEWS = gql`
  query productReviews($id: Int!, $type: String!) {
    getProductReviews(product_id: $id, type: $type) {
      total_reviews
      avg_ratings
      count
      reviews {
        id
        product_id
        title
        details
        nickname
        created_at
        status
        status_label
        rating
        customer_id
      }
    }
  }
`;

export default GET_PRODUCT_REVIEWS;
