import gql from "graphql-tag";

const GET_REWARDS_EXPIRY_TRANSACTIONS = gql`
    query getRewardsExpiryTransactions($pageSize: Int!, $currentPage: Int){
        getRewardsExpiryTransactions(pageSize: $pageSize, currentPage: $currentPage){
            transactions{
                history_id
                transaction_time
                expired_time
                amount
            }
            info
            reward_term
            reward_icon
            page_info{
                page_size
                current_page
            }
            total_count
        }
    }
`;

export default GET_REWARDS_EXPIRY_TRANSACTIONS;
