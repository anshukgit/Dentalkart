import gql from 'graphql-tag';

const GET_CUSTOMER_MEMBERSHIP = gql`
  query {
    customerMembership {
      currentPlan {
        duration
        orderId
        price
      }
      daysLeft
      memberships {
        createdAt
        expiryDate
        isActive
        isExpired
        monetoryValue
        orderId
        productSku
      }
      monetoryValue
    }
  }
`;
export default GET_CUSTOMER_MEMBERSHIP;
