import gql from 'graphql-tag';
const TRACK_RETURN_ITEM = gql`
  query trackReturnItem($input: TrackReturnType!) {
    trackReturnItem(input: $input) {
      items {
        return_id
        sku
        courier
        tracking_url
        last_updated_date
        request_at_date
        qty
        status
        image
        name
        reason
        tracking_id
        remarks
        status_history {
          id
          status
          label
          current
          created_at
          can_request_pickup
          __typename
        }
        __typename
      }
      __typename
    }
  }
`;
export default TRACK_RETURN_ITEM;
