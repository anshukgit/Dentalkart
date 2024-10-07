import gql from "graphql-tag";
import BRANDS_FRAGMENT from '../fragments/brands.fragment.gql';

const GET_BRANDS = gql`
	query{
		getBrand{
			...brandFields
	  	}
	}
	${BRANDS_FRAGMENT}
`;

export default GET_BRANDS;
