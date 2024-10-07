import React, {
  Fragment,
  Component,
  useState,
  useEffect,
  useCallback,
  useContext,
} from 'react';
import {
  View,
  ScrollView,
  Modal,
  Text,
  TouchableOpacity,
  Button,
  Pressable,
  TextInput,
  Image,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {Query, Mutation} from 'react-apollo';
import {COUNTRIES_QUERY} from '@screens/country';
import {
  GET_AVAILABLE_DELIVERY,
  GET_DISPATCH_INFORMATION_QUERY,
} from '../../../../graphql';
import styles from './expiry_dispatch.style';
import ADIcon from 'react-native-vector-icons/AntDesign';
import MUIcon from 'react-native-vector-icons/MaterialIcons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import {CheckCashOnDelivery} from '../../../../../cart/modules/check_cod_section';
import TouchableCustom from '@helpers/touchable_custom';
import {client, client2} from '@apolloClient';
import {showErrorMessage} from '../../../../../../helpers/show_messages';
import tokenClass from '@helpers/token';
import {SafeAreaView} from 'react-navigation';
import {FlatList} from 'react-native-gesture-handler';
import {GET_ADDRESSES_QUERY} from '../../../../../address/graphql';
import SyncStorage from '@helpers/async_storage';
import {DentalkartContext} from '@dentalkartContext';
import {Icon} from 'native-base';
import AnalyticsEvents from '../../../../../../components/Analytics/AnalyticsEvents';
import {withNavigationFocus} from 'react-navigation';
import {customerClient} from '../../../../../../apollo_client';

function formatDate(getDateString) {
  const dateString = new Date(getDateString.replace(' ', 'T'));
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
    ,
  ];
  const day = dateString.getDate();
  const monthIndex = dateString.getMonth();
  const year = dateString.getFullYear();
  return `${monthNames[monthIndex]}, ${year}`;
}

export const DispatchInfoComponent = withNavigationFocus(
  ({
    dispatchDays,
    infoToDisplay,
    producType,
    productId,
    navigation,
    childProducts,
    setDeliveryDays,
  }) => {
    const [openDispatchDateModal, setOpenDispatchDateModal] =
      React.useState(false);
    const [methods, setMethods] = useState([]);
    // console.log('stateMehtodsssssssss!!!!========+!!', methods);
    // const [showDetails, setShowDetails] = useState(false);
    const [loginStatus, setLoginStatus] = useState(false);
    const [codTextField, setCodTextField] = useState('');
    const [addressData, setAddressData] = useState([]);
    const [shippingAddress, setShippingAddress] = useState('');
    // console.log('childProducts0000', childProducts);s
    const [open, setOpen] = useState(false);
    // console.log('shoiiiisoiso====!!!!', shippingAddress);
    const {country} = useContext(DentalkartContext);
    const [countryList, setCountryList] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState('');
    const [pincodeError, setPincodeError] = useState(false);
    const [returnModal, setReturnModal] = useState(false);
    const [infoIcon, setInfoIcon] = useState('');
    // console.log('countryyyyyyyy', selectedCountry);
    let isFocused = navigation.isFocused();
    const handleDispatchModalOpen = () => {
      setOpenDispatchDateModal(true);
    };

    const selectCountry = async item => {
      setSelectedCountry(item);
      if (item === 'IN') {
        await SyncStorage.remove('delivery_address');
        // await SyncStorage.remove('pincodeClick');
        // checkDeliveryStatus({country_code: item, postcode: '110005'});
        checkDeliveryStatus({country_code: item, postcode: '110005'});
        setCodTextField('110005');
        // await SyncStorage.set('countryCode', {
        //   country_code: item,
        //   postcode: '110005',
        // });
        await SyncStorage.set('countryCode', item);
        handleDispatchModalClose();
        setShippingAddress(null);
      } else {
        setCodTextField(null);
        await SyncStorage.remove('delivery_address');
        await SyncStorage.set('countryCode', item);
        await SyncStorage.remove('pincodeClick');
        checkDeliveryStatus({country_code: item, postcode: ' '});
        handleDispatchModalClose();
        setShippingAddress(null);
      }
    };

    const handleDispatchModalClose = useCallback(() => {
      setOpenDispatchDateModal(false);
      // setShowDetails(false);
    }, []);

    const handlePincodeFieldChange = text => {
      setCodTextField(text);
      // setShowDetails(false);
      setPincodeError(false);
      // await SyncStorage.set('pincodeClick', codTextField);
    };

    const handleNewAdddressClick = () => {
      navigation.navigate('Address');
      handleDispatchModalClose();
    };

    // const handleReturnModal = () => {
    //   setReturnModal(true);
    // };

    const checkDeliveryStatus = async getdata => {
      try {
        const {data} = await client.query({
          query: GET_AVAILABLE_DELIVERY,
          fetchPolicy: 'network-only',
          variables: {
            postcode: getdata?.postcode
              ? getdata?.postcode
              : codTextField
              ? codTextField
              : '',
            country_code: getdata.country_code ? getdata.country_code : 'IN',
            products: {
              parent_id: productId,
              children:
                producType === 'grouped'
                  ? childProducts?.items?.map(item => item?.id)
                  : [],
            },
          },
        });
        // console.log('dataofCheckingDeliver=====!!!!!=====###', data);
        if (data.getAvailablePaymentMethodV4) {
          setMethods(data?.getAvailablePaymentMethodV4);
          if (producType === 'grouped') {
            // setDeliveryDays(data?.getAvailablePaymentMethodV3?.delivery_days);
            setDeliveryDays(data?.getAvailablePaymentMethodV4);
          }
          if (getdata === 'pincodeCheck') {
            let dataPIncode = {country_code: 'IN', postcode: codTextField};
            await SyncStorage.set('pincodeClick', dataPIncode);
            await SyncStorage.remove('delivery_address');
            // setShowDetails(true);
            setShippingAddress(null);
            setSelectedCountry('IN');
          }
        }
      } catch (error) {
        showErrorMessage(`${error.message}. Please try again.`);
      }
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
      } catch (error) {
        showErrorMessage(`${error.message}. Please try again.`);
      }
    };

    const getCustomerAddresses = useCallback(async () => {
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
          const defaultAddress = countryWiseAddress.find(
            data => data.default_shipping === true,
          );
          setAddressData(countryWiseAddress);
          // if (!storedAddress && defaultAddress) {
          //   // console.log('defaultAddress====111111============', defaultAddress);
          //   await SyncStorage.set('delivery_address', defaultAddress);
          //   country?.country_id === 'IN' &&
          //     (await SyncStorage.set('pincode', defaultAddress.postcode));
          //   setShippingAddress(defaultAddress);
          // }
        }
      } catch (e) {
        console.log('error=======is-======Adress=API', e);
      }
    }, [country, setAddressData]);
    const getDataFromStorage = useCallback(async loginStatus => {
      if (loginStatus && (await SyncStorage.get('delivery_address'))) {
        console.log('first---2222');
        let storageData = await SyncStorage.get('delivery_address');
        let getdata = {
          country_code: storageData?.country_code,
          postcode: storageData?.postcode,
        };
        await checkDeliveryStatus(getdata);
        setShippingAddress(storageData);
        setSelectedCountry(null);
      } else if (
        (await SyncStorage.get('countryCode')) &&
        (await SyncStorage.get('pincodeClick')) === false
      ) {
        let storageData = await SyncStorage.get('countryCode');
        storageData === 'IN'
          ? (storageData = {country_code: storageData, postcode: '110005'})
          : (storageData = {country_code: storageData});
        await checkDeliveryStatus(storageData);
        setSelectedCountry(
          storageData.country_code ? storageData.country_code : storageData,
        );
      } else if (await SyncStorage.get('pincodeClick')) {
        let storageData = await SyncStorage.get('pincodeClick');
        let getdata = {
          country_code: storageData?.country_code,
          postcode: storageData?.postcode,
        };
        await checkDeliveryStatus(getdata);
        setShippingAddress(null);
        setSelectedCountry('IN');
        setCodTextField(storageData?.postcode);
      } else {
        console.log('elesewala-----------!!!!!!!!!!!!!');
        setSelectedCountry(null);
        let getdata = {country_code: 'IN', postcode: '110005'};
        await checkDeliveryStatus(getdata);
        await SyncStorage.set('countryCode', getdata?.country_code);
        setSelectedCountry('IN');
      }
    }, []);

    const handleShippingAddressClick = useCallback(
      async data => {
        setCodTextField(null);
        SyncStorage.remove('countryCode');
        SyncStorage.remove('pincodeClick');
        setSelectedCountry(null);
        setShippingAddress(data);
        checkDeliveryStatus(data);
        handleDispatchModalClose();
        await SyncStorage.set('delivery_address', data);
      },
      [handleDispatchModalClose, shippingAddress],
    );

    const DisplayAddressData = ({data, index}) => {
      return (
        <TouchableOpacity
          // style={[
          //   styles.shadoww,
          //   state?.shippingAddress?.id === data?.id
          //     ? [
          //         styles.addressBoxx,
          //         {borderWidth: 1, borderColor: colors.blueColor},
          //       ]
          //     : styles.addressBoxx,
          // ]}
          style={[styles.addressBoxx, styles.shadoww]}
          onPress={() => handleShippingAddressClick(data)}>
          <Text
            allowFontScaling={false}
            style={[styles.addressCount, {lineHeight: 40}]}>
            {data.firstname} {data.lastname}
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

    useEffect(() => {
      tokenClass.loginStatus().then(loginStatus => {
        setLoginStatus(loginStatus);
        loginStatus && getCustomerAddresses();
        getDataFromStorage(loginStatus);
        return loginStatus;
      });
      getCountries();
      SyncStorage.get('pincodeClick').then(item =>
        console.log('pincodeeeeeeee', item),
      );
    }, [isFocused]);

    return (
      <View>
        {dispatchDays && (
          <Query
            query={GET_DISPATCH_INFORMATION_QUERY}
            variables={{
              attribute_code: 'dispatch_days',
              entity_type: '4',
              version: 2,
              product_id: productId,
            }}
            fetchPolicy={'cache-and-network'}>
            {({loading, error, data}) => {
              if (loading) {
                return null;
              }
              if (error) {
                console.log(`Error! ${error}`);
              }
              if (data && data?.customAttributeMetadata) {
                const getAttributeOptionsArray =
                  data.customAttributeMetadata.dispatch_info_v2.attribute_options.filter(
                    data => data.value === dispatchDays.toString(),
                  );
                return (
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: '#ddd',
                      padding: 10,
                      marginTop: 4,
                    }}>
                    <Text style={{fontSize: 14, fontWeight: '500'}}>
                      Check Delivery Options
                    </Text>
                    <TouchableOpacity
                      onPress={handleDispatchModalOpen}
                      style={{
                        width: '100%',
                        paddingVertical: 8,
                        flexDirection: 'row',
                        // alignItems: 'center',
                        justifyContent: 'space-between',
                        alignSelf: 'center',
                        borderColor: '#c2c2c2',
                        borderWidth: 1,
                        borderRadius: 5,
                        marginTop: 12,
                      }}>
                      <Text
                        style={{
                          fontWeight: '700',
                          color: '#1b5ca2',
                          paddingHorizontal: 8,
                        }}>
                        {/* {selectedCountry
                        ? `Deliver to ${selectedCountry}`
                        : shippingAddress
                        ? `${
                            shippingAddress?.firstname?.length > 12
                              ? shippingAddress?.firstname?.slice(0, 12) + '...'
                              : shippingAddress?.firstname
                          }${
                            shippingAddress?.region?.region === null
                              ? ''
                              : shippingAddress?.region?.region?.length > 12
                              ? `-${
                                  shippingAddress?.region?.region?.slice(
                                    0,
                                    12,
                                  ) + '...'
                                }`
                              : `-${shippingAddress?.region?.region}`
                          }${
                            shippingAddress?.postcode === null
                              ? ''
                              : `,${shippingAddress?.postcode}`
                          }`
                        : `Deliver to IN`} */}
                        {selectedCountry
                          ? `Deliver to ${selectedCountry} ${
                              codTextField === null
                                ? ''
                                : codTextField
                                ? `- ${codTextField}`
                                : ''
                            }`
                          : shippingAddress
                          ? `${shippingAddress?.firstname?.split(' ')?.[0]}${
                              shippingAddress?.region?.region === null
                                ? ''
                                : `-${
                                    shippingAddress?.region?.region?.split(
                                      ' ',
                                    )?.[0]
                                  }`
                            }${
                              shippingAddress?.postcode === null
                                ? ''
                                : `,${shippingAddress?.postcode}`
                            }`
                          : `Deliver to IN`}
                      </Text>
                      <Text
                        style={{
                          paddingHorizontal: 8,
                          color: '#f3943d',
                          textTransform: 'capitalize',
                          textDecorationLine: 'underline',
                        }}>
                        Change
                      </Text>
                    </TouchableOpacity>
                    {producType !== 'grouped' &&
                    methods?.delivery_days?.[0]?.success_msg !== undefined ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingTop: 8,
                        }}>
                        <Image
                          style={{
                            height: 20,
                            width: 20,
                            marginRight: 8,
                            tintColor: '#1c60dc',
                          }}
                          source={require('../../../../../../assets/delivery.png')}
                        />
                        <Text style={{color: '#1c60dc', fontSize: 12}}>
                          {/* {`Get it within ${methods?.delivery_days?.[0]?.delivery_days} days!`} */}
                          {methods?.delivery_days?.[0]?.success_msg}
                        </Text>
                      </View>
                    ) : null}
                    {methods?.checkcod?.[0]?.message !== undefined &&
                    producType !== 'grouped' ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingTop: 8,
                        }}>
                        <Image
                          style={{
                            height: 20,
                            width: 20,
                            marginRight: 8,
                            tintColor: '#1c60dc',
                          }}
                          source={require('../../../../../../assets/payments.png')}
                        />
                        {/* <MUIcon
                      size={20}
                      name="payments"
                      style={{paddingRight: 8}}
                      color="#6f6f6f"
                    /> */}

                        <Text style={{color: '#1c60dc', fontSize: 12}}>
                          {`${methods?.checkcod?.[0]?.message}`}
                        </Text>

                        {methods?.checkcod?.[0]?.message_arr?.[0] ? (
                          <TouchableOpacity
                            onPress={() => {
                              setReturnModal(true);
                              setInfoIcon('codCheck');
                            }}>
                            <AntDesignIcon
                              size={12}
                              name="infocirlce"
                              style={{paddingLeft: 8, paddingTop: 5}}
                              color="#6f6f6f"
                            />
                          </TouchableOpacity>
                        ) : null}
                      </View>
                    ) : null}
                    {methods?.return_info?.message ? (
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingVertical: 8,
                        }}>
                        <Image
                          style={{
                            height: 20,
                            width: 20,
                            marginRight: 8,
                            tintColor: '#6f6f6f',
                          }}
                          source={require('../../../../../../assets/repeat.png')}
                        />
                        <Text style={{color: '#1c60dc', fontSize: 12}}>
                          {methods?.return_info?.message}
                        </Text>
                        <TouchableOpacity
                          onPress={() => {
                            setReturnModal(true);
                            setInfoIcon('returnPolicy');
                          }}>
                          <AntDesignIcon
                            size={12}
                            name="infocirlce"
                            style={{paddingLeft: 8, paddingTop: 5}}
                            color="#6f6f6f"
                          />
                        </TouchableOpacity>
                      </View>
                    ) : null}

                    {/* <View
                    style={
                      producType === 'grouped'
                        ? styles.GroupHeadText
                        : styles.expiryInfohead
                    }>
                    <Text allowFontScaling={false}>{infoToDisplay}</Text>
                  </View>
                  <TouchableOpacity
                    style={
                      producType === 'grouped'
                        ? styles.info_text
                        : styles.expiryInfohead
                    }
                    onPress={() => handleDispatchModalOpen()}>
                    <Text allowFontScaling={false} style={styles.linkText}>
                      {producType === 'grouped'
                        ? `${getAttributeOptionsArray[0].label}`
                        : `${getAttributeOptionsArray[0].label}`}
                    </Text>
                    <ADIcon
                      name="infocirlce"
                      style={styles.iButton}
                      color="#bfbcbc"
                    />
                  </TouchableOpacity> */}
                    <Modal
                      visible={returnModal}
                      transparent={true}
                      animationType="slide"
                      onRequestClose={() => setReturnModal(false)}>
                      <View style={styles.modalWrapper}>
                        {infoIcon === 'codCheck' ? (
                          <View style={{alignSelf: 'center'}}>
                            <Text>
                              {methods?.checkcod?.[0]?.message_arr?.[0]}
                            </Text>
                          </View>
                        ) : (
                          <View>
                            {methods?.return_info?.message_arr?.map(item => (
                              <View style={styles.MainViewRetun}>
                                <Text style={styles.dotView}>•</Text>
                                <Text>{item}</Text>
                              </View>
                            ))}
                          </View>
                        )}

                        <View style={{alignItems: 'center'}}>
                          <TouchableOpacity
                            onPress={() => setReturnModal(false)}>
                            <Text
                              allowFontScaling={false}
                              style={styles.modalCloseButton}>
                              Close
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Modal>
                    <Modal
                      visible={openDispatchDateModal}
                      transparent={true}
                      animationType="fade"
                      onRequestClose={() => handleDispatchModalClose()}>
                      <View style={styles.MainModalContainer}>
                        <View style={styles.ModalContainer}>
                          <TouchableOpacity
                            style={styles.closeIconView}
                            onPress={() => handleDispatchModalClose()}>
                            <AntDesignIcon
                              name={'closecircleo'}
                              style={styles.closeIcon}
                            />
                          </TouchableOpacity>
                          <View style={styles.underContainer}>
                            <View style={styles.Header}>
                              <Text style={styles.HeaderText}>
                                Choose your location
                              </Text>
                            </View>
                            {shippingAddress?.country_code === 'IN' ||
                            selectedCountry === 'IN' ? (
                              <View style={styles.checkServiceAvailiblity}>
                                <Text style={styles.serviceText}>
                                  Check Service Availability
                                </Text>
                                <View style={styles.checkServiceInput}>
                                  <TextInput
                                    style={styles.CheckServiceInputField}
                                    keyboardType="numeric"
                                    onChangeText={text =>
                                      handlePincodeFieldChange(text)
                                    }
                                    value={codTextField}
                                    placeholder={'Enter 6 digit pincode'}
                                    maxLength={6}
                                    // onSubmitEditing={() => handleCodSubmit()}
                                  />

                                  <TouchableCustom
                                    underlayColor={'#ffffff10'}
                                    onPress={() => {
                                      if (
                                        codTextField === '' ||
                                        codTextField?.length !== 6
                                      ) {
                                        setPincodeError(true);
                                        return false;
                                      } else {
                                        setOpenDispatchDateModal(false);
                                        checkDeliveryStatus('pincodeCheck');
                                      }
                                    }}>
                                    <View style={styles.CheckServiceButton}>
                                      <Text
                                        allowFontScaling={false}
                                        style={styles.CheckServiceButtonText}>
                                        {!loading ? 'Check' : 'Checking...'}
                                      </Text>
                                    </View>
                                  </TouchableCustom>
                                </View>
                                {pincodeError ? (
                                  <Text style={styles.pinError}>
                                    Please enter valid Pincode
                                  </Text>
                                ) : null}
                                {/* {showDetails ? (
                                <View style={styles.pincodeContainer}>
                                  {producType !== 'grouped' &&
                                  methods?.delivery_days?.[0]?.delivery_days !==
                                    undefined ? (
                                    <View style={styles.pincodeView}>
                                      <MUIcon
                                        size={20}
                                        name="local-shipping"
                                        style={styles.MUIcon}
                                        color="#6f6f6f"
                                      />

                                      <Text style={styles.pincodeCheckTexts}>
                                        {`Get the product within ${methods?.delivery_days?.[0]?.delivery_days} days!.`}
                                      </Text>
                                    </View>
                                  ) : null}
                                  <View style={styles.pincodeView}>
                                    <MUIcon
                                      size={20}
                                      name="payments"
                                      style={styles.MUIcon}
                                      color="#6f6f6f"
                                    />
                                    <Text style={styles.pincodeCheckTexts}>
                                      {`${methods?.checkcod?.message} (${codTextField})`}
                                    </Text>
                                  </View>
                                  <View style={styles.pincodeView}>
                                    <MUIcon
                                      size={20}
                                      name="repeat"
                                      style={styles.MUIcon}
                                      color="#6f6f6f"
                                    />
                                    <Text style={styles.pincodeCheckTexts}>
                                      {methods?.return_info?.message}
                                    </Text>
                                    <TouchableOpacity
                                      onPress={handleReturnModal}>
                                      <AntDesignIcon
                                        size={12}
                                        name="infocirlce"
                                        style={{paddingLeft: 8, paddingTop: 5}}
                                        color="#6f6f6f"
                                      />
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              ) : null} */}
                              </View>
                            ) : null}
                            {selectedCountry === 'IN' ||
                            shippingAddress?.country_code === 'IN' ? (
                              <View style={styles.orView}>
                                <Text
                                  allowFontScaling={false}
                                  style={styles.orTxt}>
                                  or
                                </Text>
                              </View>
                            ) : null}

                            <Text>
                              Select a delivery location to see product
                              availability and delivery options on payment page.
                            </Text>
                            {loginStatus ? (
                              <View>
                                {addressData?.length > 0 && (
                                  <View>
                                    <FlatList
                                      data={addressData}
                                      renderItem={({item, index}) => (
                                        <DisplayAddressData
                                          data={item}
                                          index={index}
                                        />
                                      )}
                                      keyExtractor={(item, index) =>
                                        index.toString()
                                      }
                                      extraData={addressData}
                                      horizontal
                                      showsHorizontalScrollIndicator={false}
                                    />
                                  </View>
                                )}
                                <TouchableOpacity
                                  onPress={() => handleNewAdddressClick()}
                                  style={{}}>
                                  <Text
                                    allowFontScaling={false}
                                    style={styles.linkTextt}>
                                    {'Add/Edit an address '}
                                  </Text>
                                </TouchableOpacity>
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
                            <View style={styles.orView}>
                              <Text
                                allowFontScaling={false}
                                style={styles.orTxt}>
                                or
                              </Text>
                            </View>
                            <View>
                              <DropDownPicker
                                // onChangeValue={item => selectCountry(item)}
                                searchable
                                open={open}
                                value={selectedCountry || null}
                                items={countryList}
                                setOpen={setOpen}
                                onSelectItem={item =>
                                  selectCountry(item?.value)
                                }
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
              }
              return null;
            }}
          </Query>
        )}
      </View>
    );
  },
);

export const ExpiryInfoComponent = ({
  productExpiry,
  infoToDisplay,
  producType,
}) => {
  const [openExpiryModal, setOpenExpiryModal] = React.useState(false);

  const handleExpiryModalOpen = () => {
    setOpenExpiryModal(true);
  };

  const handleExpiryModalClose = () => {
    setOpenExpiryModal(false);
  };

  const ExpiryInformation = () => {
    return (
      <View>
        <Text allowFontScaling={false}>
          The Expiration date mentioned here is based on our latest warehouse
          stock. Dentalkart tries to always deliver the latest lot i.e longest
          expiry of products directly procured from the manufacturer.
        </Text>
        <Text allowFontScaling={false}>
          Incase of short expiry products, it is always mentioned clearly .
        </Text>
      </View>
    );
  };
  return (
    <View>
      {productExpiry && (
        <View
          style={{marginBottom: 8, flexDirection: 'row', alignItems: 'center'}}>
          <View>
            <Text
              allowFontScaling={false}
              style={
                producType === 'grouped'
                  ? styles.GroupHeadText
                  : styles.expiryInfohead
              }>
              {infoToDisplay}
            </Text>
          </View>
          <View
            style={[
              producType === 'grouped'
                ? styles.info_text
                : styles.expiryInfohead,
            ]}>
            <Text
              allowFontScaling={false}
              onPress={() => handleExpiryModalOpen()}
              style={styles.linkText}>
              {formatDate(productExpiry)}{' '}
            </Text>
            <TouchableOpacity onPress={() => handleExpiryModalOpen()}>
              <AntDesignIcon size={14} name="infocirlce" color="#bfbcbc" />
            </TouchableOpacity>
          </View>
          <Modal
            visible={openExpiryModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => handleExpiryModalClose()}>
            <View style={styles.modalWrapper}>
              <ExpiryInformation />
              <View style={{alignItems: 'center'}}>
                <TouchableOpacity onPress={() => handleExpiryModalClose()}>
                  <Text
                    allowFontScaling={false}
                    style={styles.modalCloseButton}>
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </View>
  );
};
