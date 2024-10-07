import gql from 'graphql-tag';

const GET_SLIDER_FRAGMENT = gql`
  fragment gethomepagesliders on Sliders {
    mobile_image
    link
    title
    id
    relative
  }
`;

export default GET_SLIDER_FRAGMENT;
