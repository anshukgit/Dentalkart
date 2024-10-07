import gql from "graphql-tag";

const GET_FAQ_CATEGORIES = gql`
	{
	    faqcategory{
            category_id
            category_name
            category_sequence
            category_thumbnail
	    }
	}
`;

export default GET_FAQ_CATEGORIES;
