import gql from 'graphql-tag';

const SEND_OTP = gql`
  mutation sendOTP(
    $email_or_Mobile: String!
    $entityType: Entity_Type
    $actionType: Send_OTP_Actions
  ) {
    sendOTP(
      input: {
        entity_type: $entityType
        entity: $email_or_Mobile
        action_type: $actionType
      }
    ) {
      message
      token
    }
  }
`;

export default SEND_OTP;
