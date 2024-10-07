import React, {useEffect, useState, useRef} from 'react';
import {View, TextInput, Text, TouchableOpacity} from 'react-native';
import SyncStorage from '@helpers/async_storage';
import {client, newclient} from '@apolloClient';
import styles from './cod_section.style';
import {showErrorMessage} from '../../../../helpers/show_messages';
import tokenClass from '@helpers/token';
import {
  CHECK_COD_AVAILABILITY,
  GET_AVAILABLE_PAYMENT_METHOD,
} from '../../graphql';
import TouchableCustom from '@helpers/touchable_custom';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '@config/colors';
import AnalyticsEvents from '../../../../components/Analytics/AnalyticsEvents';

const CheckCod = async pincode => {
  let guest_cart_id = await SyncStorage.get('guest_cart_id');
  let customer_cart_id = await SyncStorage.get('customer_cart_id');
  let loginStatus = await tokenClass.loginStatus();

  const cart_id = loginStatus ? customer_cart_id : guest_cart_id;

  try {
    const result = await client.query({
      query: CHECK_COD_AVAILABILITY,
      fetchPolicy: 'network-only',
      variables: {
        pincode: pincode ? pincode.toString() : '',
        quoteId: cart_id || '',
      },
    });
    if (result) {
      const data = result.data.checkcod.type;
      const resulting_array = result.data.checkcod.message_arr;
      const state = result.data.stateDetailFromPincode.State;
      return {
        data,
        resulting_array,
        state,
        result,
      };
    }
  } catch (e) {
    showErrorMessage(`${e.message}. Please try again.`);
  }
};

export const CheckCashOnDelivery = ({
  setPincodeValues,
  pincode,
  checkDeliveryCod,
  setAddressModal,
}) => {
  console.log(
    'checkDeliveryCod===checkDeliveryCod===checkDeliveryCod',
    checkDeliveryCod,
  );
  const [pincodeValue, setPincodeValue] = useState('');
  const [pincodeError, setPincodeError] = useState('');
  const [successPincode, setSuccessPincode] = useState(pincode);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState('');
  const [showDeliveryInfo, setShowDeliveryInfo] = useState(false);
  const [pincodeMessageArray, setPincodeMessageArray] = useState([]);
  const [codTextField, setCodTextField] = useState('');
  const [apiResponse, setApiResponse] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  const handleShowDelivery = () => {
    setShowDeliveryInfo(!showDeliveryInfo);
  };

  const handlePincodeFieldChange = value => {
    setPincodeValue(value);
    setCodTextField(value);
    setPincodeError('');
  };

  // const checkDeliveryStatus = async pincode => {
  //   console.log('checking===delivery==data', {
  //     country_code: shippingAddress?.country_code || country_id,
  //     postcode: cartData?.postcode !== undefined ? cartData?.postcode : pincode,
  //     cart_data: {
  //       is_cod_on_cart: Boolean(cartData?.is_cod_on_cart),
  //       cart_weight: Number(cartData?.cart_weight),
  //       cart_amount: Number(cartData?.cart_amount),
  //     },
  //     products: {
  //       children: cartData?.cartItems,
  //     },
  //   });
  //   try {
  //     const {data, error} = await newclient.query({
  //       query: GET_AVAILABLE_PAYMENT_METHOD,
  //       fetchPolicy: 'network-only',
  //       variables: {
  //         // ...cartData,
  //         //   pincode: String(pincode),
  //         country_code: shippingAddress?.country_code || country_id,
  //         postcode:
  //           cartData?.postcode !== undefined ? cartData?.postcode : pincode,
  //         cart_data: {
  //           is_cod_on_cart: Boolean(cartData?.is_cod_on_cart),
  //           cart_weight: Number(cartData?.cart_weight),
  //           cart_amount: Number(cartData?.cart_amount),
  //         },
  //         products: {
  //           children: cartData?.cartItems,
  //         },
  //       },
  //     });

  //     console.log(
  //       'data==checkDeliveryStatus=checkDeliveryStatus',
  //       JSON.stringify(data),
  //     );

  //     // if (
  //     //   data?.GetAvailableMethodsV2?.payment_methods &&
  //     //   data?.GetAvailableMethodsV2?.payment_methods?.length
  //     // ) {
  //     //   AnalyticsEvents('CHECK_COD', 'checkCod', {
  //     //     isCodAvailable: data?.GetAvailableMethodsV2?.checkcod?.cod_available,
  //     //     message: data?.GetAvailableMethodsV2?.checkcod?.message,
  //     //     pincode: cartData?.pincode,
  //     //   });
  //     //   setSuccessPincode(pincode);
  //     //   setStatusMessage(data?.GetAvailableMethodsV2?.checkcod?.message);
  //     //   // setPincodeValue('');
  //     // } else {
  //     //   setSuccessPincode(pincode);
  //     //   setStatusMessage(data?.GetAvailableMethodsV2?.checkcod?.message);
  //     //   // setPincodeValue('');
  //     // }
  //     // setLoading(false);

  //     if (data?.getAvailablePaymentMethodV4) {
  //       AnalyticsEvents('CHECK_COD', 'checkCod', {
  //         isCodAvailable:
  //           data?.getAvailablePaymentMethodV4?.checkcod?.cod_available,
  //         message: data?.getAvailablePaymentMethodV4?.checkcod?.message,
  //         pincode: cartData?.pincode,
  //       });
  //       setSuccessPincode(pincode);
  //       setStatusMessage(data?.getAvailablePaymentMethodV4?.max_delivery_days);
  //       setDeliveryDays(data?.getAvailablePaymentMethodV4);
  //       // setPincodeValue('');
  //     } else {
  //       setSuccessPincode(pincode);
  //       setStatusMessage(data?.getAvailablePaymentMethodV4?.checkcod?.message);
  //       // setPincodeValue('');
  //     }
  //     setLoading(false);
  //   } catch (error) {
  //     console.log('checkDeliveryStatus===catch', error);
  //     showErrorMessage('Something went wrong');
  //     setLoading(false);
  //   }
  // };

  const handleCodSubmit = async () => {
    setShowDeliveryInfo(false);
    if (pincodeValue.length === 6) {
      setLoading(true);
      // checkDeliveryStatus(pincodeValue);
      let data = {country_code: 'IN', postcode: pincodeValue};
      setPincodeValues(data);
      await SyncStorage.set('pincodeClick', data);
      await SyncStorage.remove('delivery_address');
      setLoading(false);
      setAddressModal?.setAddressModal(false);
    } else if (pincodeValue.length === 0) {
      setPincodeError('Enter a 6 digit pincode!');
    } else if (pincodeValue.length > 0 && pincodeValue.length < 6) {
      setPincodeError('Entered pincode is incomplete!');
    }
  };

  const GetCodInfo = async pincode => {
    const COdInfo = await CheckCod(pincode);
    COdInfo && setApiResponse(COdInfo.result);
    if (COdInfo && COdInfo.data == 1) {
      setSuccessPincode(pincode);
      setState(COdInfo.state);
    } else if (COdInfo && COdInfo.data == 2) {
      setPincodeMessageArray(COdInfo.resulting_array);
      setSuccessPincode(pincode);
      setState(COdInfo.state);
    } else {
      console.log('error');
    }
  };

  // useEffect(() => {
  //   console.log('dkkkkkkkkkkkkkkkkkkkkk', pincode);
  //   pincode && checkDeliveryStatus(pincode);
  // }, [pincode, cartTotals]);

  // useEffect(() => {
  //   shippingAddress?.postcode ||
  //     (shippingAddress?.pincodeClick?.postcode &&
  //       checkDeliveryStatus(
  //         shippingAddress?.postcode
  //           ? shippingAddress?.postcode
  //           : shippingAddress?.pincodeClick?.postcode,
  //       ));
  // }, []);

  // useEffect(() => {
  //   checkDeliveryCod && checkDeliveryStatus();
  // }, [checkDeliveryCod]);

  return (
    <View style={[styles.outerCard, {paddingHorizontal: 15}]}>
      <Text allowFontScaling={false} style={styles.checkServicesTxt}>
        Check Service Availability
      </Text>
      <View style={styles.textFieldWrapper}>
        <TextInput
          style={styles.inputField}
          keyboardType="numeric"
          onChangeText={text => handlePincodeFieldChange(text)}
          value={codTextField}
          placeholder={'Enter 6 digit pincode'}
          maxLength={6}
          onSubmitEditing={() => handleCodSubmit()}
        />
        <TouchableCustom
          underlayColor={'#ffffff10'}
          onPress={() => handleCodSubmit()}>
          <View style={styles.applyCouponButton}>
            <Text allowFontScaling={false} style={styles.applyCouponButtonText}>
              {!loading ? 'Check' : 'Checking...'}
            </Text>
          </View>
        </TouchableCustom>
      </View>
      {pincodeError ? (
        <Text allowFontScaling={false} style={styles.errorText}>
          {pincodeError}
        </Text>
      ) : null}
      {statusMessage !== '' && (
        <Text
          allowFontScaling={false}
          style={{fontSize: 12.5, marginVertical: 10}}>
          {statusMessage} {` (${successPincode})`}
        </Text>
      )}
      {/* {apiResponse ?
                (<View>
                    <View>
                        <View style={{marginVertical:5,paddingHorizontal:3}}>
                           <Text allowFontScaling={false} style={{fontSize:12.5}}>
                                {apiResponse.data.checkcod.message} {` (${successPincode}`}
                                {(state.length> 5) ? `, ${state.substring(0, 5)}...` :  (state !== "None" ? `, ${state} ` : null)})
                            </Text>
                        </View>
                        <TouchableOpacity style={styles.showmoreView} onPress={()=>handleShowDelivery()}>
                            <Text allowFontScaling={false} style={styles.showmoreTxt}>Show more</Text>
                        </TouchableOpacity>
                    </View>
                    {showDeliveryInfo &&
                            (<View>
                                {pincodeMessageArray.length>0 &&
                                    <View style={{marginTop:3}}>
                                        {pincodeMessageArray.map((info,index) =>{
                                            return(
                                                <Text allowFontScaling={false} style={{fontSize:13}}>{index}. {info}</Text>
                                            )
                                        })}
                                    </View>
                                }
                            </View>
                        )
                    }
             </View>): null
           } */}
    </View>
  );
};
