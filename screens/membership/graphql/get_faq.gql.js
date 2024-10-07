import gql from 'graphql-tag';

const GET_FAQ = gql`
  query {
    faqcategoryitem(id: 18) {
      answer
      question
    }
  }
`;
export default GET_FAQ;
