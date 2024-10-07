import gql from 'graphql-tag';
import toSource from '@helpers/toSource';

const GET_CATEGORY_PRODUCTS = gql`
  query getCategoryFilters(
    $categoryId: Int!
    $pageNo: Int
    $filter: CategoryProductsFilterInput
    $sort: CategoryProductSortInput
  ) {
    getCategoryProducts(
      category_id: $categoryId
      page_no: $pageNo
      filter: $filter
      sort: $sort
    ) {
      product_count
      page_no
      category_id
      name
      url_key
      description
      image
      meta_title
      meta_keywords
      meta_description
      ads_banner {
        type
        banners {
          web_img
          mobile_img
          web_url
          app_url
          alt
        }
      }
      items {
        average_rating
        id
        image_url
        manufacturer
        name
        rating_count
        reward_point_product
        short_description
        sku
        msrp
        tag
        demo_available
        special_price
        thumbnail_url
        url_key
        price {
          minimalPrice {
            amount {
              currency_symbol
              value
              currency
            }
            adjustments
          }
          maximalPrice {
            amount {
              currency_symbol
              value
              currency
            }
            adjustments
          }
          regularPrice {
            amount {
              currency_symbol
              value
              currency
            }
            adjustments
          }
        }
        type_id
        tier_prices {
          customer_group_id
          qty
          value
          percentage_value
          website_id
        }
        is_in_stock
      }
    }
  }
`;
export default GET_CATEGORY_PRODUCTS;
