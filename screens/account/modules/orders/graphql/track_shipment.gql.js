import gql from "graphql-tag";
const TRACK_SHIPMENT = gql`
    query track(
        $shipment_id: String!
    ){
        track(input: {shipment_id: $shipment_id}){
            response{
                current_status
                from
                to
                time
                customername
                scan{
                    time
                    location
                    status_detail
                }
            }
        }
    }
`;
export default TRACK_SHIPMENT;
