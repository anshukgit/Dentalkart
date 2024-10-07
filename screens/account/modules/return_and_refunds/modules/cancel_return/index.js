import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import {CANCEL_RETURN_MUTATION} from '../../graphql';
import {showErrorMessage} from '../../../../../../helpers/show_messages';

class CancelReturn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cancelReturnDialog: false,
    };
  }
  dialog = () => {
    const {cancelReturnDialog} = this.state;
    return {
      cancelReturnDialog,
      closeDialog: () => this.setState({cancelReturnDialog: false}),
      openDialog: () => this.setState({cancelReturnDialog: true}),
    };
  };
  render() {
    const {returnItem, children, postCancellingReturn} = this.props;
    return (
      <Mutation
        mutation={CANCEL_RETURN_MUTATION}
        update={postCancellingReturn}
        onError={error => {
          showErrorMessage(`${error.message}. Please try again.`);
        }}
        variables={{return_id: returnItem.return_id}}>
        {(cancelReturn, {data, loading, error}) =>
          children(cancelReturn, {data, loading, error}, this.dialog())
        }
      </Mutation>
    );
  }
}

export default CancelReturn;
