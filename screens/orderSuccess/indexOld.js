import React from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import {NavigationActions} from 'react-navigation';
import {UserDetail} from './style';
import Header from '@components/header';
import {DentalkartContext} from '@dentalkartContext';
import {fireAnalyticsEvent} from '@helpers/firebase_analytics';
import {client} from '@apolloClient';
import API from '@config/api';
import getRequest from '@helpers/get_request';
import HeaderComponent from '@components/HeaderComponent';

function _handelPress(reset) {
  this.requestAnimationFrame(() => {
    reset([NavigationActions.navigate({routeName: 'Tabs'})], 0);
  });
}

export class OrderSuccessScreen extends React.Component {
  static contextType = DentalkartContext;
  constructor(props) {
    super(props);
    this.state = {
      orderID: props.navigation.state.params.orderId,
      retryPayment: props.navigation.state.params
        ? props.navigation.state.params.retryPayment
        : false,
    };
  }
  triggerScreenEvent = _ => {
    const {userInfo} = this.context;
    fireAnalyticsEvent({
      eventname: 'screenname',
      screenName: `Order Success`,
      userId: userInfo && userInfo.getCustomer ? userInfo.getCustomer.id : '',
    });
  };
  componentDidMount() {
    this.triggerScreenEvent();
    const {getUserInfo, getCartItemCount} = this.context;
    getUserInfo();
    this.checkNewOrder();
    this.backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      this.backAction,
    );
  }

  componentWillUnmount() {
    this.backHandler.remove();
  }

  backAction = () => {
    _handelPress(this.props.navigation.reset);
    return true;
  };

  async checkNewOrder() {
    const {handleError, getGuestAndCustomerCartId} = this.context;
    getRequest(API.checkout.order_success)
      .then(res => res.json())
      .then(data => {
        if (data.isValid) {
          // if(!this.state.retryPayment)
          // {
          // 	getCartItemCount(0)
          // 	SyncStorage.remove('customer_cart_id');
          // 	SyncStorage.remove('guest_cart_id');
          // 	getGuestAndCustomerCartId();
          // }
          // else {
          // 	console.log('sucess retry payment')
          // }
          console.log('sucess payment');
        }
      })
      .catch(error => handleError(error));
  }

  render() {
    const {reset, state} = this.props.navigation;
    const order_id = this.state?.order_id ?? state.params.order_id;
    return (
      <View>
        <HeaderComponent
          onPress={() => _handelPress(reset)}
          navigation={this.props.navigation}
          label={'Order Success'}
          style={{height: 40}}
        />
        <ScrollView>
          <View style={UserDetail.detailWrapper}>
            <Text allowFontScaling={false} style={UserDetail.orderPlaced}>
              Thank you for your order.
            </Text>
            <Text
              allowFontScaling={false}
              style={UserDetail.successTransaction}>
              Your order has been placed.
            </Text>
            {order_id ? (
              <Text
                allowFontScaling={false}
                style={UserDetail.successTransaction}>
                Reference id: #{order_id}
              </Text>
            ) : null}
            <TouchableOpacity
              onPress={() => _handelPress(reset)}
              style={UserDetail.continueShoppingWrapper}>
              <Text
                allowFontScaling={false}
                style={UserDetail.continueShopping}>
                Continue Shopping
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default OrderSuccessScreen;
