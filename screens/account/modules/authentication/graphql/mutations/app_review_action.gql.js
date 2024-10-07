import gql from "graphql-tag";

const APP_REVIEW_ACTION = gql`
    mutation appReviewAction($action: String!, $google_data: String){
        takeAppReviewAction(action: $action, google_data: $google_data)
    }
`;

export default APP_REVIEW_ACTION;
