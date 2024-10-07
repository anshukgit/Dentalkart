import gql from 'graphql-tag';

const GET_BRANDS_FRAGMENT = gql`
    fragment gethomepagebrands on Brands{
	    brand_name
        brand_image
        link
        web_image
        small_image
        mobile_image
        title
        id
	}
`;

export default GET_BRANDS_FRAGMENT;
