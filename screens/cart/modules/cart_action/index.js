import React, {Component} from 'react';
import {
  Text,
  View,
  Pressable,
  Modal,
  SafeAreaView,
  TouchableOpacity,
} from 'react-native';
import {showErrorMessage} from '../../../../helpers/show_messages';
import {newclient} from '@apolloClient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {WebView} from 'react-native-webview';

import styles from './cart_action.style';
import tokenClass from '@helpers/token';
import AnalyticsEvents from '../../../../components/Analytics/AnalyticsEvents';

export default class CartAction extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: true,
      showTermConditions: false,
    };
  }

  checkoutOfStock = cartItems => {
    let outOfStock = false;
    cartItems?.map(item => {
      if (item.product.stock_status === 'OUT_OF_STOCK') {
        outOfStock = true;
      }
    });
    return outOfStock;
  };

  checkDeliveryStatus = async cartData => {
    console.log('cartData===========11', cartData);
    let {cart, navigation, shippingAddress, getCart} = this.props;
    // const cartData = await getCart();
    const paymentMethods = cartData?.available_payment_methods;

    const isStock = this.checkoutOfStock(cartData?.items);
    if (isStock) return showErrorMessage('Some of products are out of stock');
    if (paymentMethods && paymentMethods?.length === 0)
      return showErrorMessage('We are not providing service at this pincode.');
    if (!!!cartData?.global_errors) {
      AnalyticsEvents('SHIPPING_DETAIL', 'shipping details', {
        ...shippingAddress,
      });
      AnalyticsEvents('CHECKOUT_STARTED', 'Checkout Started', cart?.cart);
      navigation.navigate('Payment', {
        selectedAddress: shippingAddress,
        cart: cartData,
        paymentMethods: cartData?.available_payment_methods,
      });
    } else {
      showErrorMessage(cart?.global_errors);
    }
  };

  showWebViewModal = () => (
    <Modal
      animationIn="slideInRight"
      animationOut="slideOutRight"
      deviceWidth={1}
      deviceHeight={1}
      isVisible={this.state.showTermConditions}
      onRequestClose={() => {
        this.setState({showTermConditions: false});
      }}>
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => {
              this.setState({
                showTermConditions: false,
              });
            }}
            style={styles.header}>
            <Ionicons name="ios-close-circle-outline" size={25} />
          </TouchableOpacity>
        </View>
        <View style={{flex: 1}}>
          <WebView
            source={{
              uri: 'https://www.dentalkart.com/terms-and-conditions',
            }}
            startInLoadingState={true}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );

  render() {
    const {
      cart,
      data,
      setAddressModal,
      disabled,
      title,
      navigation,
      shippingAddress,
    } = this.props;
    const countryCode =
      shippingAddress?.country_code ?? this.context?.country?.country_id;
    return (
      <View style={[styles.cartActionContainer]}>
        {this.state.showTermConditions && this.showWebViewModal()}
        {!countryCode ||
        (countryCode === 'IN' &&
          String(title).includes(
            'Some of the products are disabled for international orders.',
          )) ? null : disabled ? (
          <Text allowFontScaling={false} style={styles.globalErrorText}>
            {title}
          </Text>
        ) : null}

        {/* {disabled ? (
          <Text allowFontScaling={false} style={styles.globalErrorText}>
            {title}
          </Text>
        ) : null} */}

        <View style={styles.cartActionWrapper}>
          {/* <View style={styles.shortSummaryWrapper}>
            <Text allowFontScaling={false}
              style={styles.shortSummaryPrice}
              onPress={() => _this.scrollToBottom()}>
              {data.grand_total.currency_symbol}
              {data.grand_total.value.toFixed(2)}
            </Text>
          </View> */}
          {/* <View style={styles.continueButtonWrapper}>
            <TouchableCustom
              underlayColor={'#ffffff10'}
              onPress= { async () => {
                    if(await tokenClass.loginStatus()){
                        if(_this.state.shippingAddress){
                          navigation.navigate('Payment', { item: _this.state.shippingAddress, cart:cart })
                        }
                        else {
                            _this.setState({addressModal:true})
                        }
                    }
                    else {
                        navigation.navigate('Login', { screen: 'Cart', activeGuestCart: true,})
                    }

                }}
              disabled={false}
             >
              <View
                style={[
                  styles.continueButton,
                  disabled ? styles.disabled : null,
                ]}>
                <Text allowFontScaling={false} style={styles.continueButtonText}>Continue</Text>
              </View>
            </TouchableCustom>
          </View> */}
          <View style={styles.footerView}>
            <TouchableOpacity
              style={styles.CheckoutView}
              onPress={async () => {
                if (!disabled) {
                  if (await tokenClass.loginStatus()) {
                    this.props
                      .getCart(this.props.cart?.cart?.id)
                      .then(async globalError => {
                        console.log(
                          'globalError=============',
                          globalError?.global_errors,
                        );
                        if (!globalError?.global_errors) {
                          if (await this.checkoutOfStock()) {
                            showErrorMessage(
                              'Some of products are out of stock',
                            );
                          } else {
                            if (
                              this.props?.shippingAddress &&
                              this.props?.shippingAddress?.id
                            ) {
                              console.log(
                                'dffffffffffffffff==============!!!!!',
                                this.props?.shippingAddress &&
                                  this.props?.shippingAddress?.id,
                              );
                              if (
                                (this.props?.shippingAddress?.country_code ===
                                  'IN' &&
                                  !!this.props?.shippingAddress?.region
                                    ?.region_code) ||
                                this.props?.shippingAddress?.country_code !==
                                  'IN'
                              ) {
                                await this.checkDeliveryStatus(globalError);
                              } else {
                                showErrorMessage(
                                  'Please add region in your selected address.',
                                );
                              }
                            } else {
                              setAddressModal(true);
                            }
                          }
                        }
                      });
                  } else {
                    navigation.navigate('Login', {
                      screen: 'Cart',
                      activeGuestCart: true,
                    });
                  }
                }
              }}>
              <View
                style={[
                  styles.continueButton,
                  disabled ? styles.disabled : null,
                ]}>
                <Text allowFontScaling={false} style={styles.CheckoutText}>
                  Checkout
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}
