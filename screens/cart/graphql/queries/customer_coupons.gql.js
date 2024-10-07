import gql from "graphql-tag";

const GET_CUSTOMER_COUPONS = gql`
    query {
        CustomerCoupons{
        coupon_code
        description
       }
    }
`;

export default GET_CUSTOMER_COUPONS;
