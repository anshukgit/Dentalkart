import gql from 'graphql-tag';
const BULK_ORDER=gql`
    mutation bulkOrder(
        $name:String!,
        $email:String!,
        $phone:String!,
        $postcode:String!,
        $product_id:Int!,
        $quantity:Int!,
        $expected_price:Float!,
        $source:Int!
    ){
    bulkOrder(input:{
        name:$name,
        email:$email,
        phone:$phone,
        postcode:$postcode,
        product_id:$product_id,
        quantity:$quantity,
        expected_price:$expected_price,
        source:$source})
        {
           message
        }
    }
`;
export default BULK_ORDER;
