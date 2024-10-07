import gql from 'graphql-tag';
const EDIT_QUESTION_ANSWER = gql`
  mutation editQuestionsAnswer(
    $_id: String!
    $product_id: Int!
    $answer: AnswerDataInput
    $dislike: Int
    $like: Int
    $enable: Boolean
  ) {
    editQuestionsAnswer(
      input: {
        _id: $_id
        product_id: $product_id
        enable: $enable
        answer: $answer
        dislike: $dislike
        like: $like
      }
    ) {
      _id
      __typename
    }
  }
`;
export default EDIT_QUESTION_ANSWER;
