import gql from "graphql-tag";

const GET_REWARD_BALANCE = gql`
	query {
		getRewardsAccountInfo{
			balance
		}
	}
`;
export default GET_REWARD_BALANCE;
