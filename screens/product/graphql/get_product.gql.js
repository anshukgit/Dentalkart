import gql from 'graphql-tag';

const GET_PRODUCT = gql`
  query ProductData($id: [Int], $sku: [String]) {
    productData(id: $id, sku: $sku) {
      id
      image_url
      name
      sku
      special_price
      url_key
      thumbnail_url
      short_description
      type_id
      manufacturer
      average_rating
      rating_count
      is_in_stock
      pd_expiry_date
      dentalkart_custom_fee
      dispatch_days
      reward_point_product
      msrp
      demo_available
      max_sale_qty
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
      tier_prices {
        customer_group_id
        qty
        value
        percentage_value
        website_id
      }
      media_gallery_entries {
        id
        media_type
        label
        position
        disabled
        types
        file
        video_content {
          media_type
          video_provider
          video_url
          video_title
          video_description
          video_metadata
        }
      }
      categories {
        name
        level
        position
        url_path
      }
    }
  }
`;

export default GET_PRODUCT;
