import gql from 'graphql-tag';

const GET_FLASH_SALE_FRAGMENT = gql`
        fragment gethomepagesalesbanner on SalesBanner{
            section_enabled
            mobile_image
            fallback_web_image
            fallback_mobile_image
            web_image
            page_url
            before_sale_page_url
            start_time
            end_time
            timer_color
            desktop_timer_position
            mobile_timer_position
        }
`;

export default GET_FLASH_SALE_FRAGMENT
