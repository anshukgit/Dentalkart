import gql from "graphql-tag";

const THANKYOU_PAGE = gql`
  query Thankyoupage($source: String!) {
    thankyoupage(source: $source) {
      img
      link
    }
  }
`;

export default THANKYOU_PAGE;