import gql from "graphql-tag";
import toSource from "@helpers/toSource";
import RETURNS_FRAGMENT from '../fragments/returns.fragment.gql';
import RETURNS_ITEMS_FRAGMENT from '../fragments/return_items.fragment.gql';
import COMMENT_HISTORY_FRAGMENT from '../fragments/comment_history.fragment.gql';

export const CREATE_RETURN = (products) => {
    const items = [];
    products.map(product => {
        items.push({
            sku: product.sku,
            qty: parseFloat(product.selectedOptions.quantity),
            reason_id: product.selectedOptions.reason,
            condition_id: product.selectedOptions.condition,
            description: product.selectedOptions.description,
            exchange_type: product.selectedOptions.resolution,
            attachments: product.selectedOptions.attachments
        })
        return null;
    })
    return(
        gql`
            mutation createReturn($orderId: Int!, $description: String, $agreement: Boolean!){
                CreateReturn(
                    order_id: $orderId,
                    description: $description,
                    agreement: $agreement
                    items: ${items.toSource()}
                ){
                    ...returnFields
        			items{
        				...returnItemFields
        			}
                    comment_history: history{
                        ...commentHistoryFields
                    }
                }
            }
            ${RETURNS_FRAGMENT}
        	${RETURNS_ITEMS_FRAGMENT}
        	${COMMENT_HISTORY_FRAGMENT}
        `
    );
}

export default CREATE_RETURN;
