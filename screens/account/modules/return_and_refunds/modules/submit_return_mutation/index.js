import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import {CREATE_RETURN_MUTATION} from '../../graphql';
import {NavigationActions, StackActions} from 'react-navigation';
import {showErrorMessage} from '../../../../../../helpers/show_messages';

class SubmitReturn extends Component {
  postSubmitReturn = (cache, {data}) => {
    const return_id = data.CreateReturn[0].return_id;
    const {navigation, dispatch} = this.props;
    const resetAction = StackActions.reset({
      index: 2,
      actions: [
        NavigationActions.navigate({routeName: 'Home'}),
        NavigationActions.navigate({routeName: 'ReturnListScreen'}),
        NavigationActions.navigate({
          routeName: 'RmaHistoryScreen',
          params: {return_id: return_id},
        }),
      ],
    });
    navigation.dispatch(resetAction);
  };
  render() {
    const {
      selectedItems,
      orderId,
      children,
      globalDeclaration,
      globalDescription,
    } = this.props;
    return (
      <Mutation
        mutation={CREATE_RETURN_MUTATION(selectedItems)}
        update={this.postSubmitReturn}
        onError={error => {
          showErrorMessage(`${error.message}. Please try again.`);
        }}
        variables={{
          orderId: orderId,
          description: globalDescription,
          agreement: globalDeclaration,
        }}>
        {(submitReturn, {data, loading, error}) =>
          children(submitReturn, {data, loading, error})
        }
      </Mutation>
    );
  }
}

export default SubmitReturn;
