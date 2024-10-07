import React, {useEffect, useState, useContext, useCallback, memo} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  Pressable,
  Image,
} from 'react-native';
import {client, newclient, customerClient} from '@apolloClient';
import {GET_ADDRESSES_QUERY} from '@screens/address/graphql';
import SyncStorage from '@helpers/async_storage';
import styles from './delivery_address.style';
import {DentalkartContext} from '@dentalkartContext';
import {CheckCashOnDelivery} from '../check_cod_section';
import {Icon} from 'native-base';
import MaterialIcons from 'react-native-vector-icons/AntDesign';
import colors from '@config/colors';
import AnalyticsEvents from '../../../../components/Analytics/AnalyticsEvents';
import DropDownPicker from 'react-native-dropdown-picker';
import {COUNTRIES_QUERY} from '@screens/country';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {GET_AVAILABLE_PAYMENT_METHOD} from '../../graphql';
import {showErrorMessage} from '../../../../helpers/show_messages';

export const DeliveryAddressSection = memo(props => {
  const {updateState, state, getCart, navigation} = props;
  const [addressData, setAddressData] = useState([]);
  const [checkCartData, setCheckCartData] = useState([]);
  const [countryId, setCountryId] = useState('');
  const {country} = useContext(DentalkartContext);
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [open, setOpen] = useState(false);
  const [deliveryDays, setDeliveryDays] = useState('');
  const [returnModal, setReturnModal] = useState(false);
  const [visibleMenuModel, setVisibleMenuModel] = useState(false);

  const selectCountry = async item => {
    setSelectedCountry(item);
    updateState?.setShippingAddress({country_code: item});
    checkDeliveryStatus({
      ...checkCartData,
      postcode: item === 'IN' ? '110005' : '123456',
      country_code: item,
    });
    await SyncStorage.remove('delivery_address');
    await SyncStorage.set('countryCode', item);
    handleCloseAddressModal();
    getCart({postcode: '', country_code: item});
  };

  const selectPostcode = async item => {
    updateState?.setShippingAddress(item);
    checkDeliveryStatus({
      ...checkCartData,
      postcode: item?.postcode,
      country_code: 'IN',
    });
  };

  const handleOpenAddressModal = () => {
    getCustomerAddresses(customerClient);
    updateState?.setAddressModal(true);
  };

  const handleCloseAddressModal = useCallback(() => {
    updateState?.setAddressModal(false);
  }, [updateState]);

  const handleShippingAddressClick = useCallback(
    async data => {
      setSelectedCountry('');
      setCountryId(data?.country_code);
      if (data?.id !== state?.shippingAddress?.id) {
        AnalyticsEvents(
          'SHIPPING_DETAILS_UPDATED',
          'shipping details updated',
          data,
        );
        await SyncStorage.remove('pincodeClick');
        await SyncStorage.set('delivery_address', data);
        await SyncStorage.set('pincode', data.postcode);
        await updateState?.setShippingAddress(data);
        await updateState?.setAddressModal(false);
        checkDeliveryStatus({
          ...checkCartData,
          postcode: data?.postcode,
          country_code: data?.country_code,
        });
        getCart(data);
      } else {
        handleCloseAddressModal();
      }
    },
    [state.shippingAddress.id, updateState, checkCartData],
  );

  const getCustomerAddresses = useCallback(
    async client => {
      try {
        const {data} = await customerClient.query({
          query: GET_ADDRESSES_QUERY,
          fetchPolicy: 'network-only',
        });
        if (
          data &&
          data.getCustomer.addresses != null &&
          data.getCustomer.addresses.length > 0
        ) {
          const storedAddress = await SyncStorage.get('delivery_address');
          const countryWiseAddress = data.getCustomer.addresses;
          setAddressData(countryWiseAddress);
          setCountryId(storedAddress?.country_code);
        }
      } catch (e) {
        console.log(e);
      }
    },
    [setAddressData],
  );

  const handleNewAdddressClick = () => {
    props.navigation.navigate('Address');
    handleCloseAddressModal();
  };

  const DisplayAddressData = ({data, index}) => {
    return (
      <TouchableOpacity
        style={[
          styles.shadow,
          state?.shippingAddress?.id === data?.id
            ? [
                styles.addressBox,
                {borderWidth: 1, borderColor: colors.blueColor},
              ]
            : styles.addressBox,
        ]}
        onPress={() => handleShippingAddressClick(data)}>
        <Text
          allowFontScaling={false}
          style={[styles.addressCount, {lineHeight: 40}]}>
          {(data.firstname + ' ' + data.lastname).length > 17
            ? (data.firstname + ' ' + data.lastname).slice(0, 17) + '...'
            : data.firstname + ' ' + data.lastname}
        </Text>
        <View style={styles.addressView}>
          <View style={styles.addressSubView}>
            <View style={styles.addressIconMainView}>
              <View style={[styles.addressIconsubView, {}]}>
                <Icon
                  name="ios-location-sharp"
                  type="Ionicons"
                  style={styles.locationIcon}
                />
              </View>
            </View>
            <View style={{width: '85%', padding: 3}}>
              <Text
                allowFontScaling={false}
                numberOfLines={3}
                style={styles.address}>
                {data.street[0] ? `${data.street[0]}, ` : ''}{' '}
                {data.street[1] ? `${data.street[1]}, ` : ''} {data.city},{' '}
                {data.region.region}, {data.postcode}.
              </Text>
            </View>
          </View>
          <Text
            allowFontScaling={false}
            style={[styles.address, {marginTop: 5}]}>
            <Icon
              name={'phone'}
              type={'FontAwesome'}
              style={styles.PhoneIcon}
            />{' '}
            {data.telephone}
          </Text>
          {data.default_shipping ? (
            <Text allowFontScaling={false} style={styles.defaultAddressTxt}>
              {'Your default address'}
            </Text>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };
  const getCountries = async () => {
    try {
      const {data} = await client.query({
        query: COUNTRIES_QUERY,
        fetchPolicy: 'cache-first',
      });
      if (data.countries) {
        let newArray = data.countries.map(item => {
          return {
            ...item,
            value: item.id,
            label: item.full_name_english || item.id,
          };
        });
        setCountryList(newArray);
      }
      if (shippingAddress?.country_code) {
        setSelectedCountry(shippingAddress?.country_code);
      }
    } catch (error) {
      showErrorMessage(`${error.message}. Please try again.`);
    }
  };

  useEffect(() => {
    manageData();
    state?.loginStatus && getCustomerAddresses(customerClient);
    getCountries();
  }, [state.loginStatus]);

  const manageData = useCallback(async () => {
    let {cart, cartItems} = props;
    let pincode = await SyncStorage.get('pincodeClick');
    let is_cod = true;
    let total_weight = 0;
    cartItems.map(item => {
      total_weight += item?.product?.weight;
      if (is_cod && !item?.product?.is_cod) {
        is_cod = false;
      }
    });
    let variables = {
      postcode: state?.shippingAddress?.postcode
        ? state?.shippingAddress?.postcode
        : pincode?.postcode
        ? pincode?.postcode
        : shippingAddress?.country_code === 'IN'
        ? '110005'
        : '123456',
      country_code: shippingAddress?.country_code || country?.country_id,
      is_cod_on_cart: is_cod,
      cart_weight: total_weight * 1000,
      cart_amount: cart?.prices?.grand_total?.value || 0,
      cartItems: cartItems.slice(0, 20).map(item => item?.product?.id),
    };
    setCheckCartData(variables);
    checkDeliveryStatus(variables);
  }, [props, setCheckCartData, state.shippingAddress]);

  const checkDeliveryStatus = useCallback(
    async variables => {
      try {
        const {data, error} = await newclient.query({
          query: GET_AVAILABLE_PAYMENT_METHOD,
          fetchPolicy: 'network-only',
          variables: {
            country_code: variables?.country_code,
            postcode: variables?.postcode ? variables?.postcode : '123456',
            cart_data: {
              is_cod_on_cart: Boolean(variables?.is_cod_on_cart),
              cart_weight: Number(variables?.cart_weight),
              cart_amount: Number(variables?.cart_amount),
            },
            products: {
              children: variables?.cartItems,
            },
          },
        });

        if (data?.getAvailablePaymentMethodV4) {
          AnalyticsEvents('CHECK_COD', 'checkCod', {
            isCodAvailable:
              data?.getAvailablePaymentMethodV4?.checkcod?.cod_available,
            message: data?.getAvailablePaymentMethodV4?.checkcod?.message,
            pincode: checkCartData?.pincode,
          });
          setDeliveryDays(data?.getAvailablePaymentMethodV4);
        }
      } catch (error) {
        console.log('checkDeliveryStatus===catch', error);
        showErrorMessage('Something went wrong');
        // setLoading(false);
      }
    },
    [checkCartData.pincode],
  );

  const {shippingAddress} = state;
  return (
    <View>
      {shippingAddress ? (
        <>
          <View style={[styles.addressCard]}>
            <TouchableOpacity
              onPress={() => handleOpenAddressModal()}
              style={styles.addressTouchable}>
              <View style={[styles.addressIconView]}>
                <View style={styles.addressIconsubView}>
                  <Icon
                    name="ios-location-sharp"
                    type="Ionicons"
                    style={styles.locationIcon}
                  />
                </View>
              </View>
              <View style={[styles.deliveryView]}>
                <Text allowFontScaling={false} style={styles.linkText}>
                  Deliver to{' '}
                  {shippingAddress?.firstname &&
                  shippingAddress?.firstname?.length > 12
                    ? `${shippingAddress?.firstname.substring(0, 12)}...`
                    : shippingAddress?.firstname}
                  {shippingAddress?.region?.region !== undefined
                    ? shippingAddress?.region?.region?.length > 8
                      ? `-${shippingAddress?.region?.region?.substring(
                          0,
                          8,
                        )}...`
                      : `-${shippingAddress?.region?.region}`
                    : null}
                  {shippingAddress?.country_code ||
                  shippingAddress?.pincodeClick?.country_code
                    ? ` ${
                        shippingAddress?.country_code ||
                        shippingAddress?.pincodeClick?.country_code
                      }`
                    : null}
                  {(shippingAddress?.country_code &&
                    shippingAddress?.country_code === 'IN' &&
                    shippingAddress?.postcode) ||
                  shippingAddress?.pincodeClick?.postcode
                    ? `,${
                        shippingAddress?.postcode ||
                        shippingAddress?.pincodeClick?.postcode
                      }`
                    : null}
                </Text>
                <Text style={styles.cartDelivery}>Change</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={{backgroundColor: '#fff', bottom: 6}}>
            <View style={{width: '90%', alignSelf: 'center'}}>
              {!!deliveryDays?.max_delivery_days && (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingTop: 8,
                  }}>
                  <Image
                    style={{
                      height: 18,
                      width: 18,
                      marginRight: 8,
                      tintColor: '#388E3C',
                    }}
                    source={require('../../../../assets/delivery.png')}
                  />

                  <Text
                    style={{color: '#388E3C', fontSize: 13, fontWeight: '400'}}>
                    {deliveryDays?.max_delivery_days}
                  </Text>

                  {!deliveryDays?.checkcod?.[0]?.message_arr?.[0] ? (
                    <TouchableOpacity
                      onPress={() => {
                        setVisibleMenuModel(true);
                      }}>
                      <AntDesignIcon
                        size={12}
                        name="infocirlce"
                        style={{padding: 10}}
                        color="#6f6f6f"
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
              )}
              {deliveryDays?.checkcod?.[0]?.message !== undefined ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',

                    paddingVertical: 5,
                  }}>
                  <Image
                    style={{
                      height: 17,
                      width: 17,
                      marginRight: 8,
                      tintColor: deliveryDays?.checkcod?.[0]?.cod_available
                        ? '#388E3C'
                        : 'red',
                    }}
                    source={require('../../../../assets/payments.png')}
                  />

                  <Text
                    style={{
                      color: deliveryDays?.checkcod?.[0]?.cod_available
                        ? '#388E3C'
                        : 'red',
                      fontSize: 13,
                    }}>
                    {`${deliveryDays?.checkcod?.[0]?.message}`}
                  </Text>

                  {deliveryDays?.checkcod?.[0]?.message_arr?.[0] ? (
                    <TouchableOpacity
                      onPress={() => {
                        setReturnModal(true);
                      }}>
                      <AntDesignIcon
                        size={12}
                        name="infocirlce"
                        style={{padding: 8}}
                        color="#6f6f6f"
                      />
                    </TouchableOpacity>
                  ) : null}
                </View>
              ) : null}
            </View>
          </View>
        </>
      ) : (
        <TouchableOpacity
          onPress={() => handleOpenAddressModal()}
          style={styles.addressCard}>
          <Text allowFontScaling={false} style={styles.linkText}>
            {'Select delivery location'}
          </Text>
        </TouchableOpacity>
      )}

      <Modal
        visible={returnModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setReturnModal(false)}>
        <View style={styles.modelView}>
          <View style={[styles.modelSub, {minHeight: 70}]}>
            <TouchableOpacity
              style={{alignSelf: 'flex-end', right: 10}}
              onPress={() => setReturnModal(false)}>
              <MaterialIcons
                name={'closecircleo'}
                style={[styles.closeIcon, {color: '#8D8D8D'}]}
              />
            </TouchableOpacity>

            {deliveryDays?.checkcod?.[0]?.message_arr?.map(item => (
              <View style={styles.MainViewRetun}>
                <Text style={styles.dotView}>•</Text>
                <Text>{item}</Text>
              </View>
            ))}
          </View>
        </View>
      </Modal>

      <Modal
        visible={visibleMenuModel}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setReturnModal(false)}>
        <View style={styles.modelView}>
          <View style={styles.modelSub}>
            <TouchableOpacity
              style={{alignSelf: 'flex-end', right: 10}}
              onPress={() => setVisibleMenuModel(false)}>
              <MaterialIcons
                name={'closecircleo'}
                style={[styles.closeIcon, {color: '#8D8D8D'}]}
              />
            </TouchableOpacity>

            <View style={styles.terms}>
              <Text style={styles.dot}>.</Text>
              <Text style={styles.descraption}>
                Delivery Days mentioned here are valid for these products only.
              </Text>
            </View>
            <View style={styles.terms}>
              <Text style={styles.dot}>.</Text>
              <Text style={styles.descraption}>
                Days required to actually dispatch an order from our warehouse
                may depend on various factors like
              </Text>
            </View>
            <View style={styles.terms}>
              <Text style={styles.dot}>.</Text>
              <Text style={styles.descraption}>
                1. Other products in an order. (In case an order has 5 different
                items together, actual dispatch date from warehouse may depend
                on the product with longest dispatch days.)
              </Text>
            </View>
            <View style={styles.terms}>
              <Text style={styles.dot}>.</Text>
              <Text style={styles.descraption}>
                2. General Holidays & Shipping partner schedules.
              </Text>
            </View>
            <View style={styles.terms}>
              <Text style={styles.dot}>.</Text>
              <Text style={styles.descraption}>
                3. Dental Exhibitions (Product supply from manufacturers is
                affected during or after exhibition.)
              </Text>
            </View>
            <View style={styles.terms}>
              <Text style={styles.dot}>.</Text>
              <Text style={styles.descraption}>
                4. Natural Calamities (floods, earthquakes, landslides etc) or
                embargo situations.
              </Text>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={state.addressModal}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseAddressModal}>
        <View style={styles.MainModalContainer}>
          <View style={styles.ModalContainer}>
            <TouchableOpacity
              style={styles.closeIconView}
              onPress={handleCloseAddressModal}>
              <MaterialIcons name={'closecircleo'} style={styles.closeIcon} />
            </TouchableOpacity>
            <View style={styles.underContainer}>
              <View style={styles.Header}>
                <Text style={styles.HeaderText}>Choose your location</Text>
              </View>

              {state?.loginStatus ? (
                <View>
                  {addressData?.length > 0 && (
                    <View>
                      <FlatList
                        data={addressData}
                        renderItem={({item, index}) => (
                          <DisplayAddressData data={item} index={index} />
                        )}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={addressData}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                      />
                    </View>
                  )}
                  <View style={{marginVertical: 5}}>
                    <TouchableOpacity
                      onPress={() => handleNewAdddressClick()}
                      style={{}}>
                      <Text allowFontScaling={false} style={styles.linkTextt}>
                        {'Add/Edit an address '}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.loginView}>
                  <Text
                    allowFontScaling={false}
                    style={styles.linkTextt}
                    onPress={() => navigation.navigate('Login')}>
                    Login to see Your address
                  </Text>
                </View>
              )}

              {countryId === 'IN' ||
              shippingAddress?.country_code === 'IN' ||
              shippingAddress?.pincodeClick?.country_code === 'IN' ? (
                <View style={styles.orEnterView}>
                  <Text allowFontScaling={false} style={styles.orEnterTxt}>
                    or enter a pincode
                  </Text>
                  <CheckCashOnDelivery
                    shippingAddress={state.shippingAddress}
                    country_id={country?.country_id}
                    cartData={checkCartData}
                    setPincodeValues={selectPostcode}
                    setAddressModal={updateState}
                  />
                </View>
              ) : null}
              <View style={styles.orView}>
                <Text allowFontScaling={false} style={styles.orTxt}>
                  or
                </Text>
              </View>
              <View>
                <DropDownPicker
                  // onChangeValue={item => selectCountry(item)}
                  searchable
                  open={open}
                  value={
                    selectedCountry ||
                    shippingAddress?.pincodeClick?.country_code ||
                    null
                  }
                  items={countryList}
                  setOpen={setOpen}
                  onSelectItem={item => selectCountry(item?.value)}
                  style={styles.countryPicker}
                  placeholder={'Select your country'}
                  listMode="MODAL"
                />
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
});
