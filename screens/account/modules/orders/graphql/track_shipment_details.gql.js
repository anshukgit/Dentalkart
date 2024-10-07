// import gql from "graphql-tag";
//  const TRACK_BY_TRACK_NUMBER_QUERY = gql`
//   query track(
//       $order_id : String!,
//       $track_number: String!
//       ){ 
//           trackByTrackNumber(order_id: $order_id, track_number: $track_number)
//           { 
//               status 
//               response{ 
//                   current_status
//                    scan{
//                         time
//                          location status_detail 
//                         } 
//                     } 
//                 } 
//             } `;
//              export default TRACK_BY_TRACK_NUMBER_QUERY



import gql from "graphql-tag";
const TRACK_BY_TRACK_NUMBER_QUERY = gql`
              query track(
                  $track_number : String!,
                  $order_id: String!,
                  $courier: String!
                  ){
             trackByTrackNumberV2(track_number:$track_number,order_id: $order_id,courier:$courier){
                status
                response{
                  current_status
                  to
                  time
                  scan{
                    time
                    location
                    status_detail
                  }
                  from
                }
                error{
                  transporter
                  url
                  track_number
                }
            }
            } `;
export default TRACK_BY_TRACK_NUMBER_QUERY



