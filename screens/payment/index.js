import React from 'react';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  ActivityIndicator,
  Modal,
  Pressable,
} from 'react-native';
import colors from '@config/colors';
import {DeliveryAddress, DeliveryAction, Payments} from './modules';
import {DeliveryPageStyle} from './style';
import {validateMobile} from '@helpers/validator';
import {DentalkartContext} from '@dentalkartContext';
import {Icon} from 'native-base';
import CryptoJS from 'react-native-crypto-js';
import appsFlyer from 'react-native-appsflyer';
import {postRequest} from '@helpers/network';
import CartRewards from '@screens/account/modules/rewards/modules/apply_rewards';
import {
  GET_CART_REWARDS_QUERY,
  APPLY_REWARD_POINTS,
} from '@screens/account/modules/rewards/graphql';

import API from '@config/api';
import Loader from '@components/loader';
import RazorpayCheckout from 'react-native-razorpay';
import {NavigationActions, StackActions} from 'react-navigation';
import {fireAnalyticsEvent} from '@helpers/firebase_analytics';
import {GET_NOTICES} from '../../graphql';
import getCartTotalWithKeys from '@helpers/getCartTotalWithKeys';
import {
  PLACE_ORDER_MUTATION,
  FETCH_ORDER_DETAILS_QUERY,
  GET_CUSTOMER_REGISTARTION,
} from './graphql';
import CouponForm from '@screens/cart/modules/coupon_form';
import RegistrationId from './modules/registrationId';
import TouchableCustom from '@helpers/touchable_custom';
import {
  APPLY_COUPON_MUTATION,
  REMOVE_COUPON_MUTATION,
  GET_NEW_CART,
  GUEST_NEW_CART,
  SET_SHIPPING_ADDRESS_ON_CART,
  GET_AVAILABLE_PAYMENT_METHOD,
} from '@screens/cart/graphql';
import SyncStorage from '@helpers/async_storage';
import {client, newclient, cartClient} from '@apolloClient';
import {Query} from 'react-apollo';
import tokenClass from '@helpers/token';
import isInvalidCart from '@helpers/inActiveCartError.js';
import {SecondaryColor} from '@config/environment';
import {
  showErrorMessage,
  showSuccessMessage,
} from '../../helpers/show_messages';
import {config} from '@helpers/algoliaConfig';
import HeaderComponent from '@components/HeaderComponent';
import AnalyticsEvents from '../../components/Analytics/AnalyticsEvents';

export class PaymentScreen extends React.Component {
  static contextType = DentalkartContext;
  constructor(props) {
    super(props);
    const selectedAddress = props.navigation.state.params?.selectedAddress;
    const paymentMethods = props.navigation.state.params?.paymentMethods;
    // const cart = props.navigation.state.params?.cart;
    this.state = {
      addresses: [],
      selectedAddress: selectedAddress,
      paymentMethods: paymentMethods,
      savePaymentResponse: null,
      saveOrderResponse: null,
      selectedMethodCode: null,
      deliveryaddressResponse: null,
      placeOrder: false,
      showPaymentMethodsApi: false,
      addressApi: false,
      cartTotals: null,
      showAlternateField: false,
      alternateMobile: '',
      alternateMobileError: '',
      newDeliveryAddress: '',
      pageLoaded: false,
      loading: false,
      couponLoading: false,
      showCircularProgress: false,
      loginStatus: tokenClass.loginStatus(),
      customer_cart_id: '',
      couponCode: '',
      isCouponModal: false,
      registrationNo: null,
      registrationNoRequired: null,
      cart: null,
      appliedCoupons: null,
      applied_points: 0,
      earnRewardPoints: 0,
      applicableRewardPoints: null,
      rewardLoader: false,
      deliveryInfo: null,
    };
  }
  async componentDidMount() {
    this.triggerScreenEvent();
    this.setState({
      context: this.context,
      customer_cart_id: await SyncStorage.get('customer_cart_id'),
    });
    this.getCart(this.props.navigation.state.params?.cart);
    this.checkDeliveryStatus(
      this.props.navigation.state.params?.selectedAddress,
    );
    this.getCustomerRegistration();
    this.getApplicableRewardPoints();
  }

  encryptData = (data, key) => {
    try {
      let cipherText = CryptoJS.AES.encrypt(String(data), key).toString();
      return cipherText;
    } catch (error) {
      return data;
    }
  };

  buildDeliveryInfo = (deliveryInfo, storeApiKey) => {
    if (
      deliveryInfo?.exp_delivery_days &&
      deliveryInfo?.exp_dispatch_days &&
      storeApiKey
    ) {
      return [
        {
          attribute_code: 'exp_delivery_days',
          value: this.encryptData(
            deliveryInfo.exp_delivery_days.toString(),
            storeApiKey,
          ),
        },
        {
          attribute_code: 'exp_dispatch_days',
          value: this.encryptData(
            deliveryInfo.exp_dispatch_days.toString(),
            storeApiKey,
          ),
        },
      ];
    }
    return [];
  };

  checkDeliveryStatus = async selectedAddress => {
    try {
      let is_cod = true;
      let total_weight = 0;
      this.props.navigation.state.params?.cart?.items?.map(item => {
        total_weight += item?.product?.weight;
        if (is_cod && !item?.product?.is_cod) {
          is_cod = false;
        }
      });
      const {data, error} = await newclient.query({
        query: GET_AVAILABLE_PAYMENT_METHOD,
        fetchPolicy: 'network-only',
        variables: {
          country_code: selectedAddress?.country_code,
          postcode: selectedAddress?.postcode ?? '123456',
          cart_data: {
            is_cod_on_cart: Boolean(is_cod),
            cart_weight: Number(total_weight),
            cart_amount: Number(
              this.props.navigation.state.params?.cart?.prices?.grand_total
                ?.value || 0,
            ),
          },
          products: {
            children: this.props.navigation.state.params?.cart?.items
              .slice(0, 20)
              .map(item => item?.product?.id),
          },
        },
      });
      if (data?.getAvailablePaymentMethodV4) {
        this.setState({deliveryInfo: data?.getAvailablePaymentMethodV4});
      }
    } catch (error) {
      showErrorMessage('Something went wrong');
      // setLoading(false);
    }
  };

  getCustomerRegistration = async () => {
    try {
      this.setState({loading: true});
      const customer_cart_id = await SyncStorage.get('customer_cart_id');
      const {data} = await client.query({
        query: GET_CUSTOMER_REGISTARTION,
        fetchPolicy: 'network-only',
        variables: {quoteId: customer_cart_id},
      });
      const registrationIds = data?.getCustomerRegistrations?.registrations;

      const defaultRegId = registrationIds.filter(reg => reg.isDefault)?.[0]
        ?.registrationNo;
      this.setState({
        registrationNo: defaultRegId,
        registrationNoRequired:
          data?.getCustomerRegistrations?.config?.registrationNoRequired,
      });
      this.setState({loading: false});
    } catch (e) {
      this.setState({loading: false});
    }
  };

  applyRemoveCoupon = async appliedCoupon => {
    try {
      this.setState({couponLoading: true});
      const cartId = this.state.customer_cart_id;
      const {data} = await cartClient.mutate({
        mutation: appliedCoupon
          ? REMOVE_COUPON_MUTATION
          : APPLY_COUPON_MUTATION,
        fetchPolicy: 'no-cache',
        variables: {
          coupon_code: appliedCoupon ? appliedCoupon : this.state.couponCode,
          cart_id: cartId,
        },
      });

      if (data?.removeCouponFromCartV2) {
        this.getCart(data?.removeCouponFromCartV2.cart);
        this.setState({
          // cart: data?.removeCouponFromCart.cart,
          isCouponModal: false,
        });
        showSuccessMessage('Coupon removed successfully.');
      }
      if (data?.applyCouponToCartV2) {
        this.getCart(data?.applyCouponToCartV2.cart);
        this.setState({
          // cart: data?.applyCouponToCart.cart,
          isCouponModal: false,
        });
        showSuccessMessage('Coupon applied successfully.');
      }
      this.setState({couponLoading: false, couponErrorMsg: ''});
    } catch (e) {
      this.setState({
        couponLoading: false,
        couponErrorMsg: String(e)
          .replace('Error: GraphQL error:', '')
          .replace(']', '')
          .trim(),
      });
    }
  };

  getCart = async cartData => {
    const cartPrices = cartData.prices;
    const {applied_coupons} = cartData;
    const appliedCoupon =
      applied_coupons && applied_coupons != null && applied_coupons?.[0]?.code;
    let total_weight = 0;
    cartData?.items?.map(item => {
      total_weight += item?.product?.weight * item?.quantity;
    });
    let earnRewardPoints = 0;
    cartData?.items?.map(item => {
      earnRewardPoints += (item?.reward_point_product || 0) * item?.quantity;
    });

    const cartTotals = getCartTotalWithKeys(cartData);
    this.setState({
      applied_points: cartPrices?.rewardsdiscount?.amount || 0,
      paymentMethods: cartData.available_payment_methods,
      cartTotals: cartTotals,
      shippingBlockInformation: cartTotals,
      cart: cartData,
      appliedCoupons: appliedCoupon,
      earnRewardPoints,
    });
    const paymentMethod = this.state.selectedMethodCode
      ? this.state.selectedMethodCode
      : this.state.paymentMethods[0];

    if (this.state.paymentMethods?.length > 0) {
      if (this.state.paymentMethods?.length === 1) {
        this.onPaymentOptionPress(this.state.paymentMethods[0]);
      } else {
        this.onPaymentOptionPress(paymentMethod);
      }
    }

    return;
  };

  getApplicableRewardPoints = async () => {
    try {
      this.setState({rewardLoader: true});
      const {data} = await cartClient.query({
        query: GET_CART_REWARDS_QUERY,
        fetchPolicy: 'network-only',
        onError: error => {
          return showErrorMessage(`${error.message}. Please try again.`);
        },
      });
      if (data && data.applicableRewardPointsV2) {
        this.setState({
          applicableRewardPoints: data.applicableRewardPointsV2,
        });
      }
      this.setState({rewardLoader: false});
    } catch (e) {
      this.setState({rewardLoader: false});
    }
  };

  applyRewardPoints = async () => {
    try {
      this.setState({loading: true});
      const {data} = await cartClient.mutate({
        mutation: APPLY_REWARD_POINTS,
        variables: {
          rewardpoints: this.state.applied_points?.value
            ? 0
            : this.state.applicableRewardPoints?.max_applied_points,
        },
      });

      showSuccessMessage(
        this.state.applied_points?.value
          ? 'Rewards points removed successfully.'
          : 'Rewards points applied successfully.',
      );
      if (data?.dkApplyRewardPointsV2?.cart)
        this.getCart(data?.dkApplyRewardPointsV2?.cart);
      this.setState({
        loading: false,
      });
    } catch (e) {
      this.setState({loading: false});
    }
  };

  getStreet(address) {
    let street = [];
    if (address?.street?.[0]) {
      street.push(address.street?.[0]);
      if (address?.street?.[1]) {
        street.push(address?.street?.[1]);
      }
    }
    return street;
  }

  onPaymentOptionPress = option => {
    this.setState({selectedMethodCode: option});
  };
  selectAddress = address => {
    const {addresses} = this.state;
    let isFound = 0;
    for (let i = 0; i < addresses.length; i++) {
      if (addresses[i].id === address.id) {
        isFound = 1;
        break;
      }
    }
    if (isFound === 0) {
      addresses.push(address);
    }
    this.setState({selectedAddress: address, addresses});
    // this.getShippingMethods(address);
    this.getCart(address);
  };
  addAlternateNumber(address) {
    console.log(address, this.state.alternateMobile);
  }
  toggleAlternateField() {
    this.setState({showAlternateField: !this.state.showAlternateField});
  }
  validate(mobile) {
    this.setState({alternateMobile: mobile});
    if (!validateMobile(mobile)) {
      this.setState({
        alternateMobileError: 'Please enter correct mobile number.',
      });
    } else {
      this.setState({alternateMobileError: ''});
    }
  }
  async placeOrder() {
    try {
      if (
        this.state.registrationNoRequired === true &&
        (this.state.registrationNo === null ||
          this.state.registrationNo === undefined)
      ) {
        showErrorMessage('Please add Registration Number.');
        return;
      }
      if (Number(this.state.cartTotals?.grand_total?.value) < 0) {
        showErrorMessage('Total amount must be greater than zero.');
        return;
      }
      const apiKey = await SyncStorage.get('api_key');
      console.log('config===========', config.apiConfig?.[config.current]?.key);
      const deliveryInfoAttributes = this.buildDeliveryInfo(
        this.state.deliveryInfo,
        apiKey,
      );
      console.log('deliveryInfoAttributes===========', deliveryInfoAttributes);
      const customer_cart_id = await SyncStorage.get('customer_cart_id');
      const {selectedMethodCode} = this.state;
      this.setState({showCircularProgress: true});
      var variables = {
        cart_id: customer_cart_id,
        payment_method: selectedMethodCode.code,
        attribute: [
          {
            attribute_code: 'registration_no',
            value:
              this.state.registrationNoRequired === true
                ? this.state.registrationNo
                : '',
          },
          ...deliveryInfoAttributes,
        ],
      };
      const {data} = await cartClient.mutate({
        mutation: PLACE_ORDER_MUTATION,
        variables: variables,
      });
      if (data && data.dkplaceOrderV2 && data.dkplaceOrderV2.order_number) {
        const payload = {order_id: data.dkplaceOrderV2.order_number};
        if (
          selectedMethodCode.code === 'razorpay' &&
          data.dkplaceOrderV2.reference_number
        ) {
          const rzpData = {
            amount: data.dkplaceOrderV2.amount,
            order_id: data.dkplaceOrderV2.reference_number,
            key: data.dkplaceOrderV2.merchant_id,
            currency: data.dkplaceOrderV2.currency,
          };
          this.initiateRazorPay(payload, rzpData);
        } else if (
          selectedMethodCode.code === 'paytm' &&
          data.dkplaceOrderV2.reference_number
        ) {
          //paytmcode
        } else {
          AnalyticsEvents('CHECKOUT_COMPLETED', 'Checkout Completed', {
            ...this.state.cart,
            selectedMethodCode,
          });
          this.navigateToOrderSuccess(data.dkplaceOrderV2.order_number);
          // this.submitOrder(payload)
        }
      } else {
        console.log('order_number does not exit');
      }
    } catch (e) {
      console.warn('e======', e);
      this.setState({showCircularProgress: false});
      showErrorMessage(`${e.message}. Please try again.`);
    }
  }

  navigateToOrderSuccess = async order_id => {
    const {getGuestAndCustomerCartId, getCartItemCount, handleError} =
      this.state.context;
    try {
      await getCartItemCount(0);
      await SyncStorage.remove('customer_cart_id');
      await SyncStorage.remove('guest_cart_id');
      await getGuestAndCustomerCartId();
      let resetAction;
      resetAction = StackActions.reset({
        index: 1,
        actions: [
          NavigationActions.navigate({routeName: 'Tabs'}),
          NavigationActions.navigate({
            routeName: 'OrderSuccess',
            params: {
              orderId: order_id,
              retryPayment: false,
            },
          }),
        ],
      });
      this.props.navigation.dispatch(resetAction);
    } catch (e) {
      handleError(e);
    }
  };

  submitOrder = async payload => {
    const {handleError, getGuestAndCustomerCartId, getCartItemCount} =
      this.state.context;
    try {
      const {data} = await client.query({
        query: FETCH_ORDER_DETAILS_QUERY,
        fetchPolicy: 'network-only',
        variables: {...payload},
      });

      if (data && data.fetchOrderV2 && data.fetchOrderV2.order_id) {
        this.setState({showCircularProgress: false});

        if (data.fetchOrderV2 && data.fetchOrderV2.status === 'success') {
          await getCartItemCount(0);
          await SyncStorage.remove('customer_cart_id');
          await SyncStorage.remove('guest_cart_id');
          await getGuestAndCustomerCartId();
          this.setState({loading: false});
          AnalyticsEvents('CHECKOUT_COMPLETED', 'Checkout Completed', {
            ...this.state.cart,
            selectedMethodCode: this.state.selectedMethodCode,
          });
          let resetAction;
          resetAction = StackActions.reset({
            index: 1,
            actions: [
              NavigationActions.navigate({routeName: 'Tabs'}),
              NavigationActions.navigate({
                routeName: 'OrderSuccess',
                params: {
                  orderId: data.fetchOrderV2.order_id,
                  retryPayment: false,
                },
              }),
            ],
          });
          this.props.navigation.dispatch(resetAction);
        } else {
          // AnalyticsEvents('CHECKOUT_COMPLETED', 'Checkout Completed', {
          //   ...this.state.cart,
          //   selectedMethodCode: this.state.selectedMethodCode,
          // });
          await getCartItemCount(0);
          await SyncStorage.remove('customer_cart_id');
          await SyncStorage.remove('guest_cart_id');
          await getGuestAndCustomerCartId();
          this.setState({loading: false});
          let resetAction;
          resetAction = StackActions.reset({
            index: 1,
            actions: [
              NavigationActions.navigate({routeName: 'Tabs'}),
              NavigationActions.navigate({
                routeName: 'OrderDetails',
                params: {
                  orderId: data.fetchOrderV2.order_id,
                  fetchOrderRes: data.fetchOrderV2,
                },
              }),
            ],
          });
          this.props.navigation.dispatch(resetAction);
        }
      } else {
        console.log('not success');
      }
    } catch (e) {
      this.setState({loading: false});
      this.setState({showCircularProgress: false});
      handleError(e);
    }
  };

  initiateRazorPay = async (payload, rzpData) => {
    const {userInfo} = this.state.context;
    const {amount, order_id, key, currency} = rzpData;
    const options = {
      description: '',
      image: 'https://www.dentalkart.com/dentalkarticon.png',
      currency: currency,
      key: key,
      amount: amount,
      order_id: order_id,
      name: 'Dentalkart',
      prefill: {
        email: userInfo.getCustomer.email,
        contact: this.state.selectedAddress
          ? this.state.selectedAddress.telephone
          : '',
        name: `${userInfo.getCustomer.firstname} ${userInfo.getCustomer.lastname}`,
      },
      theme: {color: ''},
    };
    RazorpayCheckout.open(options)
      .then(response => {
        // handle success
        const rzpres = {
          rzp_payment_id: response.razorpay_payment_id,
          rzp_order_id: response.razorpay_order_id,
          rzp_signature: response.razorpay_signature,
        };
        const RzpPayload = {...payload, ...rzpres};
        this.setState({loading: true});
        setTimeout(() => {
          this.submitOrder(RzpPayload);
        }, 5000);
      })
      .catch(error => {
        this.setState({loading: true});
        setTimeout(() => {
          this.submitOrder(payload);
        }, 5000);
        let data = {
          Reason: error.description,
          'Payment mode': 'razorpay',
          'Total Amount': Number(this.state.cartTotals?.['grand_total']?.value),
          name: String(
            this.state.cart?.items.map(item => item?.product?.name).join(','),
          ),
          id: String(payload?.order_id),
          quantity: String(this.state.cart?.total_quantity),
          currency: String(this.state.cart?.prices?.grand_total?.currency),
        };
        AnalyticsEvents('PAYMENT_FAILURE', 'Payment Failure', data),
          showErrorMessage(
            `${
              error.error ? error.error.description : error.description
            }. Please try again.`,
          );
      });
  };

  triggerScreenEvent = _ => {
    const {userInfo} = this.context;
    fireAnalyticsEvent({
      eventname: 'screenname',
      screenName: 'Payment',
      userId: userInfo && userInfo.getCustomer ? userInfo.getCustomer.id : '',
    });
  };

  _handleCouponPress = appliedCoupon => {
    this.setState({
      isCouponModal: true,
      prevCoupon: appliedCoupon,
      couponErrorMsg: null,
    });
  };

  render() {
    const {loading, couponLoading} = this.state;
    const {handleError} = this.context;
    const isLoggedIn = this.state.loginStatus;
    const cartId = this.state.customer_cart_id;
    const cartQuery = isLoggedIn ? GET_NEW_CART : GUEST_NEW_CART;
    return (
      <View style={{flex: 1}}>
        <HeaderComponent
          navigation={this.props.navigation}
          label={'Place '}
          style={{height: 40}}
          isempty
        />
        <ScrollView
          ref={ref => (this.scrollView = ref)}
          style={{flex: 1, backgroundColor: '#fff'}}
          keyboardShouldPersistTaps="handled">
          {this.state.selectedAddress ? (
            <DeliveryAddress
              address={this.state.selectedAddress}
              _this={this}
            />
          ) : null}
          {true ? (
            <View style={DeliveryPageStyle.paymentWrapper}>
              <Text
                allowFontScaling={false}
                style={DeliveryPageStyle.paymentHeading}>
                Payment Options
              </Text>
              <Query
                query={GET_NOTICES}
                fetchPolicy="network-only"
                client={newclient}
                onError={error => handleError(error)}>
                {({loading, data, error}) => {
                  if (loading || error) {
                    return null;
                  }
                  if (data.notices) {
                    const {notices} = data;
                    const paymentNotices = notices.filter(
                      notice =>
                        notice.section === 'payment' &&
                        (notice.source === 'app' || 'both'),
                    );
                    if (paymentNotices && paymentNotices.length > 0) {
                      return (
                        <View style={{padding: 5}}>
                          {paymentNotices.map(notice => (
                            <Text
                              allowFontScaling={false}
                              style={{
                                color: notice.colour || SecondaryColor,
                                marginBottom: 5,
                              }}>
                              {notice.content}
                            </Text>
                          ))}
                        </View>
                      );
                    } else {
                      return null;
                    }
                  } else {
                    return null;
                  }
                }}
              </Query>
              <FlatList
                data={this.state.paymentMethods}
                renderItem={({item}) =>
                  item.code !== 'paytm' && <Payments _this={this} item={item} />
                }
                keyExtractor={(item, index) => item.code}
                extraData={this.state.paymentMethods}
              />
            </View>
          ) : (
            <View style={{marginTop: 10}}>
              <ActivityIndicator size="large" color="#2b79ac" />
            </View>
          )}
          {isLoggedIn ? (
            <View style={DeliveryPageStyle.paymentWrapper}>
              <View style={DeliveryPageStyle.applyRewardsButtonView}>
                <Text
                  allowFontScaling={false}
                  style={[DeliveryPageStyle.rewardsGainedText]}>
                  {/* Earned Rewards {info.earn_points} {info.reward_term} with products in the order. */}
                  Earned Rewards {this.state?.earnRewardPoints} Coins with
                  products in the order.
                </Text>
                <Text
                  allowFontScaling={false}
                  style={DeliveryPageStyle.rewardsGainedText}>
                  [These rewards will be transferred to your account once the
                  order is confirmed.]
                </Text>
                <TouchableCustom
                  onPress={() => {
                    // parseInt(this.state.applied_points?.value)
                    this.applyRewardPoints();
                  }}
                  underlayColor="#ffffff10"
                  disabled={
                    this.state.applicableRewardPoints?.max_applied_points > 0
                      ? false
                      : true
                  }>
                  <View style={DeliveryPageStyle.checkBoxMainView}>
                    {this.state.applicableRewardPoints?.max_applied_points >
                    0 ? (
                      <View
                        style={[
                          DeliveryPageStyle.checkBoxView,
                          {
                            borderColor: parseInt(
                              this.state.applied_points?.value,
                            )
                              ? colors.blueColor
                              : colors.otpBorder,
                          },
                        ]}>
                        {parseInt(this.state.applied_points?.value) ? (
                          <Icon
                            name="check"
                            type="AntDesign"
                            style={{fontSize: 12, color: colors.blueColor}}
                          />
                        ) : null}
                      </View>
                    ) : null}

                    {/* <Text
                      allowFontScaling={false}
                      style={DeliveryPageStyle.applyRewardTxt}>
                      Apply reward [You can only use upto{' '}
                      {this.state.applicableRewardPoints?.max_applied_points}{' '}
                      Coins in this order transaction.].
                    </Text> */}

                    <Text
                      allowFontScaling={false}
                      style={[
                        DeliveryPageStyle.applyRewardTxt,
                        this.state.applicableRewardPoints?.max_applied_points >
                        0
                          ? {color: 'black', marginLeft: 10}
                          : {color: 'grey'},
                      ]}>
                      {`${
                        this.state.applicableRewardPoints?.max_applied_points >
                        0
                          ? `Apply reward [You can only use upto ${this.state.applicableRewardPoints?.max_applied_points} Coins in this order transaction.].`
                          : `You don't have any reward points in your wallet.`
                      }`}
                    </Text>
                  </View>
                </TouchableCustom>
              </View>

              {/* <CartRewards
                postUpdateCart={() => {
                  this.getCart(this.state.selectedAddress);
                }}
                applied_points={this.state.applied_points}
                _this={this}
              /> */}
            </View>
          ) : null}
          <RegistrationId
            cartId={cartId}
            isLoggedIn={isLoggedIn}
            onChangeValue={value =>
              this.setState({
                registrationNo: value?.registrationNo,
                registrationNoRequired: value?.registrationNoRequired,
              })
            }
          />

          {this.state?.cart ? (
            <View style={DeliveryPageStyle.paymentWrapper}>
              {this.state?.cart?.applied_coupons != null &&
              this.state?.cart?.applied_coupons.length > 0 &&
              this.state?.cart?.applied_coupons?.[0]?.code ? (
                <View>
                  <View
                    style={[DeliveryPageStyle.couponeSubView, {height: 45}]}>
                    <View style={{}}>
                      <Text
                        allowFontScaling={false}
                        style={DeliveryPageStyle.couponButtonText}>
                        Applied coupon (
                        {this.state?.cart?.applied_coupons?.[0]?.code}){' '}
                      </Text>

                      <Text
                        allowFontScaling={false}
                        style={DeliveryPageStyle.couponText}>
                        You save{' '}
                        {
                          this.state?.cart?.prices?.discount?.amount
                            ?.currency_symbol
                        }
                        {Math.abs(
                          this.state?.cart?.prices?.discount?.amount?.value,
                        )}
                      </Text>
                    </View>
                    <TouchableCustom
                      underlayColor={'#ffffff10'}
                      onPress={() =>
                        !couponLoading
                          ? this.applyRemoveCoupon(
                              this.state?.cart?.applied_coupons != null &&
                                this.state?.cart?.applied_coupons.length > 0 &&
                                this.state?.cart?.applied_coupons?.[0]?.code,
                            )
                          : null
                      }>
                      <View style={{}}>
                        <Text
                          allowFontScaling={false}
                          style={DeliveryPageStyle.couponButtonText}>
                          {!couponLoading
                            ? 'Remove'
                            : this.state?.cart?.applied_coupons != null &&
                              this.state?.cart?.applied_coupons.length > 0 &&
                              this.state?.cart?.applied_coupons?.[0]?.code
                            ? 'Removing...'
                            : 'Applying...'}
                        </Text>
                      </View>
                    </TouchableCustom>
                  </View>
                </View>
              ) : (
                <View>
                  <View style={DeliveryPageStyle.couponeSubView}>
                    <Text
                      allowFontScaling={false}
                      style={{fontSize: 13, color: '#292929'}}>
                      Coupons
                    </Text>
                    <Pressable
                      style={{
                        height: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                      onPress={() =>
                        this._handleCouponPress(
                          this.state?.cart?.applied_coupons != null &&
                            this.state?.cart?.applied_coupons.length > 0 &&
                            this.state?.cart?.applied_coupons?.[0]?.code,
                        )
                      }>
                      <Text
                        allowFontScaling={false}
                        style={DeliveryPageStyle.couponApplyButton}>
                        Apply{' '}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}
              <Modal
                visible={this.state.isCouponModal}
                transparent={true}
                animationType="fade"
                onRequestClose={() =>
                  this.setState({
                    isCouponModal: false,
                    couponErrorMsg: null,
                  })
                }>
                <CouponForm
                  _this={this}
                  cart={this.state?.cart}
                  appliedCoupon={this.state?.appliedCoupons}
                  coupon={() =>
                    this.applyRemoveCoupon(this.state?.appliedCoupons)
                  }
                  DataLoading={couponLoading}
                />
              </Modal>
            </View>
          ) : null}
        </ScrollView>
        {this.state.cartTotals && (
          <DeliveryAction priceDetails={this.state.cartTotals} _this={this} />
        )}
        <Loader
          loading={loading || this.state.rewardLoader}
          transparent={true}
        />
      </View>
    );
  }
}

export default PaymentScreen;
