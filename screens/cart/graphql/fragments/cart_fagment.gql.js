import gql from "graphql-tag";

const CART_FRAGMENT = gql`
	fragment cartFields on dkCart{
	    id
        items{
            name
	    	item_id
			image
	    	price
			reward_point_product
	    	sku
			qty
			product_type
			stock_status
			url_path
			reward_point_product
			manufacturer
			category{
				name
				url_key
				position
				level
			}
        }
        items_count
        items_qty
        applied_coupon{
            code
        }
        totals{
            items_qty
			grand_total
			discount_amount
			base_subtotal
			subtotal
			shipping_amount
			subtotal_incl_tax
			shipping_incl_tax
			tax_amount
			base_discount_amount
			base_tax_amount
			base_grand_total
			base_currency_code
			subtotal_with_discount
			base_subtotal_with_discount
			quote_currency_code
			total_segments {
				code
				title
				value
				area
			}
		}
		global_error
		error_message
  	}
`;

export default CART_FRAGMENT;
