import gql from 'graphql-tag';
import GET_BRANDS_FRAGMENT from './get_brands_fragment.gql';

const GET_CAROUSEL_AND_BANNERS = gql`
    {
        gethomepagebannersv2{
	        web_image
	        mobile_image
	        link
	        alt
	        small_image
	        title
	        id,
            relative
    	}
        gethomepagecarousel{
            heading
            heading_url
            view
            sku
        }
        gethomepagebrands{
          ...gethomepagebrands
        }
    }
    ${GET_BRANDS_FRAGMENT}
`;

export default GET_CAROUSEL_AND_BANNERS;
