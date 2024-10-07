import gql from "graphql-tag";

export const GET_NAVIGATION = gql`
    {
        categoryList {
            children{
                level
                include_in_menu
                position
                name
                id
                url_path
                is_anchor
                thumbnail
                children{
                    level
                    include_in_menu
                    position
                    name
                    id
                    url_path
                    is_anchor
                    children{
                        level
                        include_in_menu
                        name
                        id
                        is_anchor
                        url_path
                    }
                }
            }
        }
    }
`;
