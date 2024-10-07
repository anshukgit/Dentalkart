import gql from 'graphql-tag';
const ADD_QUESTION_ANSWER = gql`
  mutation addQuestionAnswer(
    $question: String
    $product_id: Int!
    $product_name: String
    $product_image: String
    $like: Int
    $dislike: Int
    $customer_token: String
    $user: String
    $enable: Boolean!
  ) {
    addQuestionsAnswer(
      input: {
        product_id: $product_id
        customer_token: $customer_token
        user: $user
        product_name: $product_name
        product_image: $product_image
        enable: $enable
        like: $like
        dislike: $dislike
        question: $question
      }
    ) {
      _id
      question
      answer {
        value
        updated_by
        updated_at
        __typename
      }
      product_id
      product_name
      product_image
      enable
      like
      dislike
      created_at
      __typename
    }
  }
`;
export default ADD_QUESTION_ANSWER;
