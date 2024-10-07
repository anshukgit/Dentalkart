import gql from 'graphql-tag';
import toSource from '@helpers/toSource';

// const GET_FILTERS = (appliedFilters=[]) => {
//     return gql`
//         query filters($id: Int!){
//             dkCategoryFilters(id: $id,  filter: ${appliedFilters.toSource()}){
//                 label
//                 code
//                 options{
//                     value
//                     label
//                 }
// 	        }
//         }
//     `;
// }

const GET_FILTERS = gql`
  query getCategoryFilters($category_id: Int!) {
    getCategoryFilters(category_id: $category_id) {
      category_id
      filters {
        type
        display
        label
        code
        options {
          label
          value
        }
      }
    }
  }
`;

export default GET_FILTERS;
