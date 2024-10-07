import gql from "graphql-tag";

const GET_REWARDS_TRANSACTIONS = gql`
    query getRewardsTransactions($pageSize: Int!, $currentPage: Int){
        getRewardsTransctions(pageSize: $pageSize, currentPage: $currentPage){
            transactions{
                history_id
                transaction_time
                history_order_increment_id
                expired_time
                amount_with_sign
                amount
                amount_text
                reward_term
                reward_icon
                transaction_detail
                type_of_transaction
                status
            }
            page_info{
                page_size
                current_page
            }
            total_count
        }
    }
`;

export default GET_REWARDS_TRANSACTIONS;
