import React, {Fragment, Component} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  ToastAndroid,
  Pressable,
} from 'react-native';
import TouchableCustom from '@helpers/touchable_custom';
import {Icon} from 'native-base';
import {MyAddress} from './addressStyle';
import {Query, Mutation} from 'react-apollo';
import {DELETE_ADDRESS_QUERY, GET_ADDRESSES_QUERY} from '../graphql';
import {DentalkartContext} from '@dentalkartContext';
import SyncStorage from '@helpers/async_storage';
import {client} from '@apolloClient';
import {
  showErrorMessage,
  showSuccessMessage,
} from '../../../helpers/show_messages';
import Loader from '@components/loader';
function handlePress(navigate, routeName, params = {}) {
  navigate(routeName, params);
}
import {withNavigationFocus} from 'react-navigation';
import {customerClient} from '../../../apollo_client';
class MyAddresses extends Component {
  isFocused = this.props.navigation.isFocused();
  static contextType = DentalkartContext;
  postDeleteAddress = async (cache, {data: {deleteCustomerAddressV2}}, id) => {
    deleteCustomerAddressV2 &&
      showSuccessMessage('Address deleted successfully');
    // this.props.navigation.navigate('Cart',{val: Math.random() * 1000,screen:'Cart'})
    await SyncStorage.set('delivery_address', '');
    this.context.getUserInfo();
    // const {
    //   customer: {addresses},
    // } = client.readQuery({query: GET_ADDRESSES_QUERY});
    // const {customer} = client.readQuery({query: GET_ADDRESSES_QUERY});
    // let customerNew = Object.assign({}, customer);
    // customerNew = {
    //   addresses: addresses.filter(item => item.id !== id),
    //   __typename: 'Customer',
    // };
    // client.writeQuery({
    //   query: GET_ADDRESSES_QUERY,
    //   data: {
    //     customer: customerNew,
    //   },
    // });
  };
  openModal(id, deleteCustomerAddress) {
    Alert.alert(
      'Delete Address',
      'Are you sure to delete this address?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => deleteCustomerAddress({variables: {id: id}}),
        },
      ],
      {cancelable: false},
    );
  }
  _renderItem(item, addressCount) {
    const {push} = this.props.navigation;
    const _this = this.props._this;
    const checkout = this.props.checkout;
    const country_id = this.context?.country?.country_id;
    return (
      <View style={MyAddress.addressBoxMainView}>
        <View style={MyAddress.locationIconMainView}>
          <View style={[MyAddress.addressIconsubView, {}]}>
            <Icon
              name="ios-location-sharp"
              type="Ionicons"
              style={MyAddress.locationIcon}
            />
          </View>
        </View>
        <View style={MyAddress.addressBox}>
          <View style={MyAddress.firstnamemainView}>
            <View style={MyAddress.firstnameView}>
              <Text allowFontScaling={false} style={MyAddress.userName}>
                {item.firstname} {item.lastname}
              </Text>
            </View>
            <View style={MyAddress.DefaultView}>
              {item.default_shipping ? (
                <View style={MyAddress.defaultWrapper}>
                  <Text allowFontScaling={false} style={MyAddress.default}>
                    Default
                  </Text>
                </View>
              ) : (
                false
              )}
            </View>
          </View>
          <Text allowFontScaling={false} style={MyAddress.userAddress}>
            {item.street && item.street[0]
              ? item.street[0]
              : null + ' ' + (item.street && item.street[1])
              ? item.street[1]
              : null}
          </Text>
          <Text allowFontScaling={false} style={MyAddress.userAddress}>
            {item.city}, {item.region.region} ({item.postcode})
          </Text>
          <Text allowFontScaling={false} style={MyAddress.userAddress}>
            country: {item.country_code}
          </Text>
          <Text allowFontScaling={false} style={MyAddress.userAddress}>
            Phone Number: {item.telephone}
          </Text>
          <View style={MyAddress.editbtnMainView}>
            <Pressable
              onPress={() =>
                handlePress(push, 'EditAddress', {
                  item,
                  checkout: checkout,
                  addressCount: addressCount,
                  type: 'edit',
                })
              }
              style={[
                MyAddress.shadow,
                MyAddress.editbtnView,
                {marginRight: item.default_shipping ? 0 : 15},
              ]}>
              <Icon name="edit" type="AntDesign" style={MyAddress.editbtn} />
            </Pressable>
            {!item.default_shipping ? (
              <View style={[MyAddress.shadow, MyAddress.editbtnView]}>
                <Mutation
                  mutation={DELETE_ADDRESS_QUERY}
                  client={customerClient}
                  update={(cache, result) =>
                    this.postDeleteAddress(cache, result, item.id)
                  }
                  onError={error => {
                    showErrorMessage(`${error.message}. Please try again.`);
                  }}>
                  {(deleteCustomerAddress, {data, loading, error}) => {
                    return (
                      <TouchableOpacity
                        style={[MyAddress.userOperationWrapper]}
                        onPress={() =>
                          this.openModal(item.id, deleteCustomerAddress)
                        }>
                        <Icon
                          name="trash"
                          type={'Entypo'}
                          style={MyAddress.deleteBtn}
                        />
                      </TouchableOpacity>
                    );
                  }}
                </Mutation>
              </View>
            ) : null}
          </View>
        </View>
      </View>
    );
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('didFocus', () => {
      this.context.getUserInfo();
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  render() {
    const allAddresses = this.context.userInfo?.getCustomer?.addresses;
    const {push} = this.props.navigation;
    const _this = this.props._this;
    const checkout = this.props.checkout;
    const country_id = this?.context?.country?.country_id;

    if (allAddresses) {
      let addresses;
      if (checkout) {
        addresses = allAddresses.filter(
          address => address.country_code === country_id,
        );
      } else {
        addresses = allAddresses;
      }
      return (
        <View>
          {/* <Query
          query={GET_ADDRESSES_QUERY}
          fetchPolicy="cache-and-network"
          onError={error => console.log('The error is in the address' + error)}> */}
          {/* {({loading, error, data}) => { */}
          {addresses && (
            <Fragment>
              <TouchableCustom
                underlayColor={'#ffffff10'}
                onPress={() =>
                  handlePress(push, 'EditAddress', {
                    item: '',
                    checkout: checkout,
                    type: 'add',
                    addressCount: addresses.length,
                  })
                }>
                <View style={MyAddress.addNewAddressWrapper}>
                  <Icon
                    name="plus-square-o"
                    type="FontAwesome"
                    style={MyAddress.plusBtn}
                  />
                  <Text
                    allowFontScaling={false}
                    style={MyAddress.addNewAddressText}>
                    Add New Address
                  </Text>
                </View>
              </TouchableCustom>
              {!checkout && addresses.length > 0 ? (
                <View style={MyAddress.addressCountWrapper}>
                  <Text
                    allowFontScaling={false}
                    style={MyAddress.addressCountText}>
                    {addresses.length} SAVED ADDRESSES
                  </Text>
                </View>
              ) : null}
              <FlatList
                data={addresses || []}
                renderItem={({item}) =>
                  this._renderItem(item, addresses.length)
                }
                keyExtractor={(item, index) => item.id.toString()}
                extraData={_this.props}
                initialNumToRender={addresses.length}
              />
            </Fragment>
          )}
          {/* } */}
          {/* // if (loading) {
          //   return <Loader loading={loading} transparent={true} />;
          // }
          // if (error) {
          //   return null;
          // }
        // }} */}
          {/* </Query> */}
        </View>
      );
    }
  }
}
export default withNavigationFocus(MyAddresses);
