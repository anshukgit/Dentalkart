import gql from "graphql-tag";
import EXCHANGE_TYPE_FRAGMENT from './fragments/exchange_type.fragment.gql';

const GET_RETURN_EXCHANGE = gql`
    query{
      ReturnExchange{
        ...exchangeTypeFields
      }
    }
    ${EXCHANGE_TYPE_FRAGMENT}
`;
export default GET_RETURN_EXCHANGE;
