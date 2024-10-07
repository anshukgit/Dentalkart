import gql from 'graphql-tag';

export const ProductListingFragment = gql`
  fragment ProductListingFragment on CartV2 {
    id
    items {
      id
      updated_at
      quantity
      discount
      is_free_product
      prices {
        price {
          value
          currency
          currency_symbol
        }
        row_total {
          value
          currency
          currency_symbol
        }
        row_total_including_tax {
          value
          currency
          currency_symbol
        }
        discounts {
          amount {
            value
            currency
            currency_symbol
          }
          label
        }
      }
      product {
        id
        name
        sku
        max_sale_qty
        thumbnail {
          url
          label
        }
        price {
          regularPrice {
            amount {
              value
              currency
            }
          }
          minimalPrice {
            amount {
              value
              currency
            }
          }
          maximalPrice {
            amount {
              value
              currency
            }
          }
        }
        categories {
          name
          url_path
          position
          level
        }
        type_id
        dentalkart_custom_fee
        stock_status
        average_rating
        manufacturer
        url_path
        image {
          label
          url
        }
        weight
        is_cod
        url_key
        tier_prices {
          qty
          value
          percentage_value
        }
      }
      brand_image
      qty_increments
      reward_point_product
      error_messages {
        code
        message
      }
    }
  }
`;
