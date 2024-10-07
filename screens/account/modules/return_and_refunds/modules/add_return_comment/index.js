import React, {Component} from 'react';
import {Mutation} from "react-apollo";
import {ADD_RETURN_COMMENT_MUTATION} from '../../graphql';

class AddReturnComment extends Component{

    render(){
        const {returnId, comment, children, postAddingComment} = this.props;
        return(
            <Mutation
                mutation={ADD_RETURN_COMMENT_MUTATION}
                update={postAddingComment}
                onError={(error)=>console.log(error)}
                variables={{returnId: returnId, comment: comment}}
            >
                {(addComment, {data, loading, error}) => children(addComment, {data, loading, error})}
            </Mutation>
        );
    }
}

export default AddReturnComment;
