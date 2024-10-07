import gql from 'graphql-tag';
const DELETE_ADDRESS = gql`
  mutation deleteAddress($id: Int!) {
    deleteCustomerAddressV2(id: $id)
  }
`;

// mutation deleteAddress($id: Int!){
//     deleteCustomerAddress(id: $id)
// }
export default DELETE_ADDRESS;
