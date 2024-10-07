import gql from "graphql-tag";
import RETURNS_FRAGMENT from './fragments/returns.fragment.gql';

const GET_RETURNS = gql`
	query{
		Returns{
			...returnFields
	  	}
	}
	${RETURNS_FRAGMENT}
`;

export default GET_RETURNS;
