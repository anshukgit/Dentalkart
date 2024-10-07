import gql from 'graphql-tag';

const GET_PROMOTION_BY_SKU = gql`
  query getItemPromotionOfferBySku($sku: String, $parent_id: Int) {
    getItemPromotionOfferBySku(sku: $sku, parent_id: $parent_id) {
      message
      group_messages {
        sku
        message
      }
    }
  }
`;

// query {
//   getItemPromotionOfferBySku(parent_id:41283){
//     # getItemPromotionOfferBySku(sku:"EITXX00268"){
//     message
//     group_messages{
//       sku
//       message
//     }
//   }
// }

// query getItemPromotionOfferBySku($sku: String!) {
//     getItemPromotionOfferBySku(sku: $sku) {
//       message
//     }
//   }

// query getItemPromotionOffer($sku: String, $parent_id: Int) {
//     getItemPromotionOffer(sku: $sku, parent_id: $parent_id) {
//       messages {
//         sku
//         message
//         __typename
//       }
//       __typename
//     }
//   }

export default GET_PROMOTION_BY_SKU;
