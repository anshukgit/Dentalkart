import gql from 'graphql-tag';

const HOME_PAGE_QUERY = gql`
    {
        gethomepagesliders {
            mobile_image
            link
            title
            id
            relative
        }
        gethomepagesalesbanner {
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
            brand_name
            brand_image
            link
            web_image
            small_image
            mobile_image
            title
            id
        }
    }
`;

export default HOME_PAGE_QUERY;
