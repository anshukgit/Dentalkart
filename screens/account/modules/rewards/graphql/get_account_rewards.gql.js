import gql from "graphql-tag";

const GET_ACCOUNT_REWARDS = gql`
    query{
        getRewardsAccountInfo{
            balance
            balance_monetary
            pending_points
            pending_points_monetary
            spent_points
            spent_monetary
            earn_points
            earned_points_monetary
            currency
            reward_icon
            reward_term
            currency_icon
            exchange_rate_info
        }
    }
`;

export default GET_ACCOUNT_REWARDS;
