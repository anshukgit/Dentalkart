import gql from "graphql-tag";

const CART_FRAGMENT = gql`
	fragment cartFields on dkCart{
	    id
		quote_hash_id
        items{
            name
	    	item_id
	    	price
			product_type
	    	sku
	    	qty
			stock_status
			average_rating
			manufacturer
			brand_image
			url_path
			image
			updated_at
			weight
			product_id
			is_cod
			url_key
			qty_increments
			reward_point_product
			manufacturer
			discount
			options{
			    configurable_options{
					label
					value
		        }
				bundle_options{
				   label
				   value
	            }
           }
			category{
				name
				url_key
				position
				level
			}
			error_messages{
				code
				message
			}
			tier_prices{
				qty
				value
				percentage_value
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
			items_total_weight
		    total_segments{
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
