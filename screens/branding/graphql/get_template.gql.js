import gql from "graphql-tag";

const GET_TEMPLATE = gql`
    query getTemplatesById($templateId:String!){
        getTemplatesById(templateId:$templateId){
            templateURL
            templateName
            templateType
            startDate
            expiryDate
            rowId
            rows{
                _id
                position
                rowName
                totalColumn
                column{
                    width
                    height
                    landingURL
                    margin
                    padding
                    mimgURL
                    dtimgURL
                    rowId
                }
            }
        }
    }
    `;

export default GET_TEMPLATE;
