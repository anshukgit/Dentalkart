import gql from "graphql-tag";
import BRANDS_FRAGMENT from '../fragments/brands.fragment.gql';

const GET_FEATURED_BRANDS=gql`
    query{
		getBrand(filter:{featured: 1}){
			...brandFields
	  	}
	}
	${BRANDS_FRAGMENT}
`;

export default GET_FEATURED_BRANDS;
