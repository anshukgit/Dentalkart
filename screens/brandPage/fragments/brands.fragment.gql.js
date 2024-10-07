import gql from "graphql-tag";

const BRANDS_FRAGMENT = gql`
	fragment brandFields on Brand{
        id
        name
        brand_id
        category_id
		logo
        featured
        url_path
        is_active
        position: sort_order
  	}
`;

export default BRANDS_FRAGMENT;
