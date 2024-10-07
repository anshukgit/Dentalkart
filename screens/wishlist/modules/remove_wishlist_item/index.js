import React, {Component} from 'react';
import {Mutation} from 'react-apollo';
import {
  DELETE_WISHLIST_ITEM_QUERY,
  GET_CUSTOMER_WISHLIST_ITEMS,
} from '../../graphql';
import {DentalkartContext} from '@dentalkartContext';
import {client} from '@apolloClient';
import {showErrorMessage, showSuccessMessage} from '../../../../helpers/show_messages';

class RemoveWishlistMutation extends Component {
  constructor(props) {
    super(props);
  }
  PostUpdateWishlist = (cache, {data}) => {
    const {itemId} = this.props;
    try {
      // client.writeQuery({
      //     query: GET_WISHLIST_ITEMS_QUERY,
      //     data: {dkwishlist: data.dkRemoveItemFromWishlist}
      // });
      showSuccessMessage('Wishlist item removed successfully');
    } catch (e) {
      console.log(e);
    }
  };

  static contextType = DentalkartContext;

  render() {
    const {globalObject} = this.context;
    const {itemId, children} = this.props;
    return (
      <Mutation
        mutation={DELETE_WISHLIST_ITEM_QUERY}
        variables={{wishlistItemId: itemId}}
        onError={error => alert(error)}
        refetchQueries={() => {
          return [
            {
              query: GET_CUSTOMER_WISHLIST_ITEMS,
            },
          ];
        }}
        update={this.PostUpdateWishlist}>
        {(removeItem, {data, loading, error}) =>
          children(removeItem, {data, loading, error})
        }
      </Mutation>
    );
  }
}

export default RemoveWishlistMutation;
