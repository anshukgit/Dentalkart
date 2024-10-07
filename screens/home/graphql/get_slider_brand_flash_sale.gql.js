import gql from 'graphql-tag';
import GET_SLIDER_FRAGMENT from './get_slider_fragment.gql';
import GET_FLASH_SALE_FRAGMENT from './get_flash_sale_fragment.gql';

const GET_SLIDER_BRAND_FLASH_SALE = gql`
  query getsliderbrandflashsale {
    gethomepagesliders {
      ...gethomepagesliders
    }
    gethomepagesalesbanner {
      ...gethomepagesalesbanner
    }
  }
  ${GET_SLIDER_FRAGMENT}
  ${GET_FLASH_SALE_FRAGMENT}
`;

export default GET_SLIDER_BRAND_FLASH_SALE;
