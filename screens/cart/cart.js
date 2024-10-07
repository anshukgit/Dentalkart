import React, {useContext, useState, useEffect, useCallback} from 'react';
import {View, ScrollView, Modal, FlatList, Text, Pressable} from 'react-native';
import EmptyCart from './modules/empty_cart';
import {APPLY_REWARD_POINTS} from '@screens/account/modules/rewards/graphql';
import SET_SHIPPING_ADDRESS_ON_CART from './graphql/mutations/setShippingAddressOnCart.gql';
import {LOGOUT_QUERY} from '@screens/account/modules/authentication';
import CartProducts from './modules/cart_products';
import SimilarProducts from './modules/similarProducts';
import BillingDetails from './modules/billing_details';
import SecurePayments from './modules/secure_payments';
import CartAction from './modules/cart_action';
import {DeliveryAddressSection} from './modules/delivery_address';
import Loader from '@components/loader';
import {logout} from '@components/Analytics/AnalyticsCall';
import {cartClient} from '@apolloClient';
import tokenClass from '@helpers/token';
import {removeCartId} from '@helpers/cart_id';
import {DentalkartContext} from '@dentalkartContext';
import {fireAnalyticsEvent} from '@helpers/firebase_analytics';
import SyncStorage from '@helpers/async_storage';
import {
  showErrorMessage,
  showSuccessMessage,
} from '../../helpers/show_messages';
import AnalyticsEvents from '../../components/Analytics/AnalyticsEvents';
import colors from '@config/colors';
import styles from './cart.style';
import {Icon} from 'native-base';
import HeaderComponent from '@components/HeaderComponent';
import {withNavigationFocus} from 'react-navigation';
import {promotionBySkuClient} from '../../apollo_client';
import {GET_PROMOTION_BY_CART_VALUE} from './graphql';

const Cart = ({navigation}) => {
  const context = useContext(DentalkartContext);
  const [state, setState] = useState({
    outOfStock: false,
    prevCoupon: '',
    couponCode: '',
    couponStatus: false,
    isheart: false,
    cartCount: 1,
    isStockOutmodal: false,
    stockOutItem: '',
  });

  const [checkoutErrors, setCheckoutErrors] = useState(null);
  const [loader, setLoader] = useState(false);
  const [cart, setCart] = useState(null);
  const [currentCartId, setCurrentCartId] = useState(null);
  const [addressModal, setAddressModal] = useState(false);
  const [loginStatus, setLoginStatus] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [analyticsEventCalled, setAnalyticsEventCalled] = useState(false);
  const [promotionByCart, setPromotionByCart] = useState('');

  const {handleError, userInfo} = context;
  let isFocused = navigation.isFocused();

  const postUpdateCart = useCallback(
    async (cache, {data}) => {
      const {getCartItemCount} = context;
      try {
        if (data.removeItemFromCartV2 && data.removeItemFromCartV2.cart) {
          setCartData(data?.removeItemFromCartV2?.cart);
          await getCartItemCount(data.removeItemFromCartV2.cart.items.length);
        }
        if (data.updateCartItemsV2 && data.updateCartItemsV2.cart) {
          setCartData(data?.updateCartItemsV2?.cart);
        }
        setTimeout(() => {
          (data?.updateCartItemsV2?.cart || data.removeItemFromCartV2?.cart) &&
            AnalyticsEvents('CART_UPDATED', 'Cart Updated', {
              data: data?.updateCartItemsV2?.cart,
            });
          showSuccessMessage('Cart Updated Successfully.');
        }, 500);
      } catch (err) {
        const error = handleError(err);
        showErrorMessage(error);
      }
      setLoader(false);
    },
    [context, handleError, setCartData],
  );

  const getCartSkus = data => {
    const cartSkus = [];
    data.map((item, index) => cartSkus.push(item.sku));
    return JSON.parse(JSON.stringify(cartSkus));
  };

  const setLogout = useCallback(async () => {
    const {
      getUserInfo,
      setUserInfo,
      getGuestAndCustomerCartId,
      getCartItemCount,
    } = context;
    try {
      // await client.mutate({mutation: LOGOUT_QUERY});
      await tokenClass.removeToken();
      await removeCartId();
      await setUserInfo(null);
      await getUserInfo();
      await SyncStorage.remove('guest_cart_id');
      await SyncStorage.remove('customer_cart_id');
      await getCartItemCount(0);
      await SyncStorage.remove('delivery_address');
      await SyncStorage.remove('pincode');
      await SyncStorage.remove('userInfoData');
      await getGuestAndCustomerCartId();
      logout();
      showErrorMessage('Session expired, please login again.');
      navigation.navigate('Login', {screen: 'Cart'});
    } catch (error) {
      showErrorMessage(`${error.message}. Please try again.`);
    }
  }, [context, navigation]);

  const setCartData = useCallback(async data => {
    console.log(
      'setCartData================================11',
      JSON.stringify(data),
    );
    const cartPrices = data.prices;
    const cart_totals = data.prices.grand_total;
    const currency = cartPrices.grand_total.currency_symbol;
    const {applied_coupons} = data;
    const appliedCoupon =
      applied_coupons && applied_coupons != null && applied_coupons?.[0]?.code;
    const cartSkus = getCartSkus(data?.items);
    let total_weight = 0;

    data?.items?.map(item => {
      total_weight += item?.product?.weight * item?.quantity;
    });
    const cartShippingAddress = data?.shipping_addresses;
    const shippingamount =
      cartShippingAddress?.[0]?.available_shipping_methods?.[0]?.amount;
    const freeProducts = data?.items.filter(item => item?.is_free_product);
    setCart({
      cart: {
        ...data,
        items: [
          ...freeProducts,
          ...data?.items.filter(item => !item?.is_free_product),
        ],
      },
      cartItems: [
        ...freeProducts,
        ...data?.items.filter(item => !item?.is_free_product),
      ],
      shippingamount,
      shippingAddress: cartShippingAddress,
      total_weight,
      cartSkus,
      appliedCoupon,
      currency,
      cart_totals,
      cartPrices,
    });
    if (cartShippingAddress?.[0]?.country?.code === 'IN') {
      await promotionByCartValue(cartPrices?.grand_total?.value);
    } else {
      setPromotionByCart('');
    }
  }, []);

  const removeRewards = useCallback(async () => {
    const {data, error} = await cartClient.mutate({
      mutation: APPLY_REWARD_POINTS,
      fetchPolicy: 'no-cache',
      variables: {rewardpoints: 0},
    });
    setLoader(false);
    if (data?.dkApplyRewardPointsV2?.cart) {
      setCartData(data?.dkApplyRewardPointsV2?.cart);
    }
  }, [setCartData]);

  // const analyticsEvent = () => {
  //   if (!analyticsEventCalled) {
  //     if (cart?.cart) {
  //       AnalyticsEvents('CART_VIEWED', 'Cart View', cart?.cart);
  //       setAnalyticsEventCalled(true);
  //     }
  //   }
  // };
  const analyticsEvent = useCallback(data => {
    if (!analyticsEventCalled) {
      setAnalyticsEventCalled(true);
      AnalyticsEvents('CART_VIEWED', 'Cart View', data);
    }
  }, []);

  const getCart = useCallback(async (cart_id, address) => {
    const token = await tokenClass.getToken();
    const {getGuestAndCustomerCartId, getCartItemCount} = context;
    console.log('address================================', address);
    try {
      const variables = {
        country_id: address?.country_code || 'IN',
        cart_id: cart_id,
      };
      if (address?.firstname) variables.firstname = address?.firstname;
      if (address?.lastname) variables.lastname = address?.lastname;
      if (address?.postcode) variables.postcode = address?.postcode;
      if (address?.telephone) variables.telephone = address?.telephone;
      const alternateTelephone = address?.custom_attributes?.filter(
        value => value.attribute_code === 'alternate_telephone',
      )?.[0]?.value;
      if (alternateTelephone) variables.alternate_mobile = alternateTelephone;
      if (address?.street) variables.street = address?.street;
      if (address?.region?.region_id)
        variables.region_id = Number(address?.region?.region_id);
      if (address?.region?.region)
        variables.region = address?.region?.region?.toString();
      if (address?.region?.region_code)
        variables.region_code = address?.region?.region_code?.toString();
      if (address?.city) variables.city = address?.city;
      if (address?.id) variables.customer_address_id = address?.id;
      setLoader(true);
      console.log('variabkesssssssssssssss=----------=======', variables);
      if (variables?.country_id && variables?.cart_id) {
        console.log('setShippingAddress===calling====!!===16', variables);
        const {data, error} = await cartClient.mutate({
          mutation: SET_SHIPPING_ADDRESS_ON_CART,
          fetchPolicy: 'no-cache',
          variables: variables,
        });
        setLoader(false);
        if (error) {
          if (String(error).includes('Cart not found')) {
            await SyncStorage.remove('guest_cart_id');
            await SyncStorage.remove('customer_cart_id');
            await getCartItemCount(0);
            await getGuestAndCustomerCartId();
          }
          if (String(error).includes('Invalid token')) {
            return setLogout();
          }
          showErrorMessage(`${error.message}. Please try again.`);
        }
        const cartData = data?.setShippingAddressesOnCartV2?.cart;
        console.log(
          'setCartData================================22',
          JSON.stringify(cartData),
        );
        if (
          cartData &&
          Number(cartData?.prices?.rewardsdiscount?.amount?.value) > 0
        ) {
          return removeRewards(cart_id, address);
        } else {
          setLoader(false);
          // analyticsEvent(cartData);
          // AnalyticsEvents('CART_VIEWED', 'Cart View', cartData);

          const cartPrices = cartData.prices;
          const cart_totals = cartData.prices.grand_total;
          const currency = cartPrices.grand_total.currency_symbol;
          const {applied_coupons} = cartData;
          const appliedCoupon =
            applied_coupons &&
            applied_coupons != null &&
            applied_coupons?.[0]?.code;
          const cartSkus = getCartSkus(cartData?.items);
          let total_weight = 0;

          cartData?.items?.map(item => {
            total_weight += item?.product?.weight * item?.quantity;
          });
          const cartShippingAddress = cartData?.shipping_addresses;
          const shippingamount =
            cartShippingAddress?.[0]?.available_shipping_methods?.[0]?.amount;
          const freeProducts = cartData?.items.filter(
            item => item?.is_free_product,
          );
          setCart({
            cart: {
              ...cartData,
              items: [
                ...freeProducts,
                ...cartData?.items.filter(item => !item?.is_free_product),
              ],
            },
            cartItems: [
              ...freeProducts,
              ...cartData?.items.filter(item => !item?.is_free_product),
            ],
            shippingamount,
            shippingAddress: cartShippingAddress,
            total_weight,
            cartSkus,
            appliedCoupon,
            currency,
            cart_totals,
            cartPrices,
          });
          await getCartItemCount(cartData?.items?.length);
          if (address?.country_code === 'IN') {
            await promotionByCartValue(cartPrices?.grand_total?.value);
          } else {
            setPromotionByCart('');
          }
          return cartData;
        }
      }
    } catch (error) {
      console.log('error============================', error);
      setLoader(false);
      if (error) {
        if (
          String(error).includes(
            'The current user cannot perform operations on cart',
          ) ||
          String(error).includes('Invalid token')
        ) {
          return setLogout();
        }
        if (String(error).includes('Cart not found')) {
          await SyncStorage.remove('guest_cart_id');
          await SyncStorage.remove('customer_cart_id');
          await getCartItemCount(0);
          await getGuestAndCustomerCartId();
          return;
        }
        showErrorMessage(String(error).replace('Error: GraphQL error: ', ''));
      }
      return;
    }
  }, []);

  const navigateToProduct = item => {
    navigation.push('ProductDetails', {
      productId: item.product.id,
      productUrl: item.product.url_path,
    });
  };

  const triggerScreenEvent = useCallback(
    _ => {
      const {userInfo} = context;
      let {params} = navigation.state;
      const entry = params ? params.entry : false;
      fireAnalyticsEvent({
        eventname: 'screenname',
        screenName: 'Cart',
        entry,
        userId: userInfo && userInfo.getCustomer ? userInfo.getCustomer.id : '',
      });
    },
    [context, navigation.state],
  );

  const promotionByCartValue = async value => {
    try {
      const {data} = await promotionBySkuClient.query({
        query: GET_PROMOTION_BY_CART_VALUE,
        variables: {value: value},
        fetchPolicy: 'no-cache',
      });
      console.log('promotionOfferBySku==promotionOfferBySku', data);
      if (data?.getAmountPromotionByCartValue?.message) {
        setPromotionByCart(data?.getAmountPromotionByCartValue?.message);
      } else {
        setPromotionByCart('');
      }
    } catch (error) {
      console.log('promotionByCartValue//////==', error);
      // showErrorMessage(`${error.message}. Please try again.`);
    }
  };

  // useEffect(() => {
  //   async function fetchData() {
  //     const cartData = await getCart(currentCartId, shippingAddress);
  //     if (cartData) {
  //       analyticsEvent(cartData);
  //     }
  //   }
  //   fetchData();
  // }, [shippingAddress]);

  // useEffect(() => {
  //   getCart(currentCartId, shippingAddress);
  // }, [isFocused, currentCartId]);

  useEffect(() => {
    if (isFocused) {
      Promise.all([
        tokenClass.loginStatus().then(loginStatus => {
          setLoginStatus(loginStatus);
          return loginStatus;
        }),
        SyncStorage.get('customer_cart_id').then(customerCartId => {
          return customerCartId;
        }),
        SyncStorage.get('guest_cart_id').then(guest_cart_id => {
          return guest_cart_id;
        }),
        SyncStorage.get('delivery_address').then(delivery_address => {
          return delivery_address;
        }),
        SyncStorage.get('countryCode').then(countryCode => {
          return {country_code: countryCode};
        }),
        SyncStorage.get('pincodeClick').then(pincodeClick => {
          return {pincodeClick: pincodeClick};
        }),
      ])
        .then(async res => {
          triggerScreenEvent();
          setShippingAddress({
            ...(res[3] ? res[3] : res[4]),
            pincodeClick: res[5]?.pincodeClick,
          });

          setCurrentCartId(res[0] === true ? res[1] : res[2]);
          await getCart(
            res[0] === true ? res[1] : res[2],
            res[3] ? res[3] : res[4],
            res[5],
          );
        })
        .catch(err => console.warn(err));

      return () => {};
    }
  }, [isFocused]);

  return (
    <View style={{backgroundColor: colors.HexColor, flex: 1}}>
      <HeaderComponent
        navigation={navigation}
        label={'Cart'}
        style={{height: 40}}
        hideCart={true}
      />
      <Loader loading={loader} transparent={true} />
      {cart?.cart?.id ? (
        <>
          {!cart?.cart?.items || cart?.cart?.items?.length === 0 ? (
            <EmptyCart navigation={navigation} userInfo={userInfo} />
          ) : (
            <>
              <ScrollView nestedScrollEnabled={true}>
                <View>
                  <DeliveryAddressSection
                    cart={cart?.cart}
                    cartItems={cart?.cart?.items}
                    updateState={{
                      setShippingAddress,
                      setAddressModal,
                    }}
                    state={{shippingAddress, addressModal, loginStatus}}
                    getCart={newShippingAddress =>
                      getCart(currentCartId, newShippingAddress)
                    }
                    navigation={navigation}
                  />
                  <View
                    style={{
                      backgroundColor: '#fff',
                      paddingVertical: 4,
                    }}>
                    {!!promotionByCart && (
                      <View
                        style={{
                          backgroundColor: '#E8F4EC',
                          alignItems: 'center',
                          paddingHorizontal: 14,
                          paddingVertical: 5,
                          // marginTop: 4,
                        }}>
                        <Text
                          style={{
                            color: '#388E3C',
                            fontWeight: '500',
                            fontSize: 13,
                          }}>
                          {promotionByCart}
                        </Text>
                      </View>
                    )}

                    {shippingAddress?.country_code ? (
                      <View
                        style={{
                          backgroundColor: '#E8F4EC',
                          alignItems: 'center',
                          paddingHorizontal: 14,
                          paddingVertical: 5,
                          marginTop: 5,
                        }}>
                        <Text
                          style={{
                            color: '#388E3C',
                            fontWeight: '500',
                            fontSize: 13,
                          }}>
                          {shippingAddress?.country_code === 'IN'
                            ? 'Free delivery across India on all orders above Rs 2500'
                            : 'Shipping charges depend on weight of products'}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  <Text
                    allowFontScaling={false}
                    style={{
                      paddingVertical: 7,
                      paddingHorizontal: 20,
                      backgroundColor: colors.HexColor,
                      justifyContent: 'center',
                    }}>
                    {cart?.cart?.items.length} items selected
                  </Text>
                </View>
                <View>
                  <FlatList
                    data={cart?.cart?.items}
                    renderItem={({item, index}) => {
                      return (
                        <CartProducts
                          item={item}
                          getCart={() =>
                            getCart(currentCartId, shippingAddress)
                          }
                          shippingAddress={shippingAddress}
                          currency={cart?.currency}
                          navigateToProduct={navigateToProduct}
                          navigation={navigation}
                          postUpdateCart={postUpdateCart}
                        />
                      );
                    }}
                    extraData={cart?.cart?.items}
                    keyExtractor={item => item.id.toString()}
                  />
                </View>

                <View>
                  <BillingDetails
                    totalQuantity={cart?.cart?.total_quantity}
                    totalWeight={cart?.total_weight}
                    cartPrices={cart?.cartPrices}
                    cart={cart?.cart}
                    DataLoading={loader}
                    shippingamount={cart?.shippingamount}
                    appliedCoupon={cart?.appliedCoupon}
                    navigation={navigation}
                  />
                </View>
                <SecurePayments />
              </ScrollView>

              <CartAction
                cart={cart}
                getCart={() => getCart(currentCartId, shippingAddress)}
                shippingAddress={shippingAddress}
                navigation={navigation}
                disabled={checkoutErrors || cart?.cart?.global_errors}
                userInfo
                setAddressModal={setAddressModal}
                title={
                  checkoutErrors ? checkoutErrors : cart?.cart?.global_errors
                }
              />
            </>
          )}
        </>
      ) : (
        <>
          {loader === false && (
            <EmptyCart navigation={navigation} userInfo={userInfo} />
          )}
        </>
      )}
      {state.isStockOutmodal ? (
        <Modal
          isVisible={state.isStockOutmodal}
          animationInTiming={1000}
          animationOutTiming={1000}
          transparent={true}
          animationIn="fadeIn"
          animationOut="fadeOut"
          // onSwipeComplete={() => setState({ isModalVisibal: false })}
          style={{margin: 0, justifyContent: 'center', alignItems: 'center'}}>
          <View style={styles.modalMainView}>
            <View style={styles.stockOutModalEmptyView} />
            <View style={styles.modalSubView}>
              <ScrollView>
                <View style={styles.StockOutmodalSubView}>
                  <Text allowFontScaling={false} style={styles.StockOutText}>
                    This product is stock out
                  </Text>

                  <Text allowFontScaling={false} style={styles.eitherTxt}>
                    Either remove the unavailable item or replace with
                    recommended similar item
                  </Text>
                </View>

                <View style={styles.StockOutProView}>
                  <View style={styles.StockOutProimgView}>
                    {/* <Image source={imageConstant.gloves} style={{ width: '100%', height: '100%' }} resizeMode={'cover'} /> */}
                  </View>
                  <View style={styles.StockOutDisView}>
                    <Text
                      allowFontScaling={false}
                      style={styles.StockOutDisText}>
                      ChlorHex Mouthwash
                    </Text>
                    <Text allowFontScaling={false} style={styles.dispersible}>
                      Ketormore tromethamine dispersible tablets
                    </Text>
                    <View style={styles.priceMainView}>
                      <View style={styles.priceView}>
                        <Icon
                          name="rupee"
                          type="FontAwesome"
                          style={styles.priceIcon}
                        />
                        <Text
                          allowFontScaling={false}
                          style={[
                            styles.pricetext,
                            {color: colors.blueColor, fontSize: 20},
                          ]}>
                          {1300}
                        </Text>
                      </View>

                      <Pressable style={styles.unavilableView}>
                        <Text
                          allowFontScaling={false}
                          style={styles.unavilableText}>
                          Unavailable
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                </View>
                <View style={styles.StockOutFooterBtnView}>
                  <Pressable style={styles.norecomendationsView}>
                    <Text
                      allowFontScaling={false}
                      style={styles.norecomendationTxt}>
                      No recommendations available
                    </Text>
                  </Pressable>
                  <Pressable style={styles.notifyView}>
                    <Text allowFontScaling={false} style={styles.notifyText}>
                      Notify Me
                    </Text>
                  </Pressable>
                </View>

                <View style={[styles.similarProductMainView, {height: 190}]}>
                  <Text allowFontScaling={false} style={styles.youalsoLikeText}>
                    You also may like
                  </Text>
                  <View
                    style={[
                      styles.similarProductSubView,
                      {backgroundColor: colors.HexColor},
                    ]}>
                    <ScrollView
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}>
                      <SimilarProducts
                        isStockOutmodal={state.isStockOutmodal}
                      />
                    </ScrollView>
                  </View>
                </View>

                <Pressable style={styles.footerBtnView} onPress={() => {}}>
                  <Text allowFontScaling={false} style={styles.removeBtnTxt}>
                    Remove 1 product and proceed
                  </Text>
                </Pressable>
              </ScrollView>
            </View>
          </View>
        </Modal>
      ) : null}
    </View>
  );
};
export default withNavigationFocus(Cart);
