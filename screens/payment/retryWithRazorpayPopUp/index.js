import React, {useState, useContext, useEffect} from 'react';
import {FETCH_ORDER_DETAILS_QUERY} from '../graphql';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {DentalkartContext} from '@dentalkartContext';
import {client} from '@apolloClient';
// import {showErrorMessage} from '@helpers/show_messages';
import {showErrorMessage} from '../../../helpers/show_messages';

import RazorpayCheckout from 'react-native-razorpay';
import {NavigationActions, StackActions} from 'react-navigation';
import AnalyticsEvents from '../../../components/Analytics/AnalyticsEvents';

export const RetryPaymentButton = props => {
  // const {amount, order_id, reference_number, merchant_id, currency} =
  //   props.paymentData;
  const {userInfo, handleError} = useContext(DentalkartContext);
  const [selectedAddress, setSelectedAddress] = useState([]);
  const [fetchOrderResData, setFetchOrderResData] = useState('');
  const [CircularProgress, setCircularProgress] = useState(false);

  useEffect(() => {
    if (userInfo?.getCustomer?.addresses) {
      let res = userInfo?.getCustomer?.addresses.filter(
        item => item.default_shipping,
      );
      setSelectedAddress(res);
    }
  }, [userInfo]);

  const getRefetchRes = async () => {
    console.log('incrementId============mahesh', props.incrementId);

    try {
      const {data, loading, error} = await client.query({
        query: FETCH_ORDER_DETAILS_QUERY,
        fetchPolicy: 'network-only',
        variables: {
          order_id: props.incrementId,
          rzp_payment_id: '',
          rzp_order_id: '',
          rzp_signature: '',
        },
      });
      console.log('data========data=======', data);
      if (data && data.fetchOrderV2 && data.fetchOrderV2.order_id) {
        // this.setState({fetchOrderRes: data.fetchOrderV2});
        setFetchOrderResData(data.fetchOrderV2);
        return data.fetchOrderV2;
      }
    } catch (e) {
      console.log('============== error==========', e.message);
    }
  };

  async function onPressRetry() {
    getRefetchRes().then(res => {
      console.log('response================', res);
      handleRazorpaySubmit(res);
    });
  }

  function handleRazorpaySubmit(res) {
    const payload = {order_id: res.order_id};
    console.log('payload================', payload);
    try {
      const options = {
        description: '',
        image: 'https://www.dentalkart.com/dentalkarticon.png',
        currency: res.currency,
        key: res.merchant_id,
        amount: res.amount,
        order_id: res.reference_number,
        name: 'Dentalkart',
        prefill: {
          email: userInfo.getCustomer.email,
          contact: selectedAddress.length ? selectedAddress[0].telephone : '',
          name: `${userInfo.getCustomer.firstname} ${userInfo.getCustomer.lastname}`,
        },
        theme: {color: ''},
      };
      RazorpayCheckout.open(options)
        .then(response => {
          const rzpres = {
            rzp_payment_id: response.razorpay_payment_id,
            rzp_order_id: response.razorpay_order_id,
            rzp_signature: response.razorpay_signature,
          };
          const RzpPayload = {...payload, ...rzpres};
          setCircularProgress('true');
          setTimeout(() => {
            submitOrder(RzpPayload);
          }, 5000);
        })
        .catch(error => {
          setCircularProgress('true');
          setTimeout(() => {
            submitOrder(payload);
          }, 5000);
          showErrorMessage(
            `${
              error.error ? error.error.description : error.description
            }. Please try again.`,
          );
        });
    } catch (error) {
      handleError(error);
      setCircularProgress('false');
    }
  }

  const submitOrder = async payload => {
    try {
      const {data} = await client.query({
        query: FETCH_ORDER_DETAILS_QUERY,
        fetchPolicy: 'network-only',
        variables: {...payload},
      });
      if (data && data.fetchOrderV2 && data.fetchOrderV2.order_id) {
        setCircularProgress('false');

        AnalyticsEvents('CHECKOUT_COMPLETED', 'Checkout Completed', []);
        if (data.fetchOrderV2 && data.fetchOrderV2.status === 'success') {
          let resetAction;
          resetAction = StackActions.reset({
            index: 1,
            actions: [
              NavigationActions.navigate({routeName: 'Tabs'}),
              NavigationActions.navigate({
                routeName: 'OrderSuccess',
                params: {
                  orderId: data.fetchOrderV2.order_id,
                  retryPayment: true,
                },
              }),
            ],
          });

          props.navigation.dispatch(resetAction);
        } else {
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
          props.navigation.dispatch(resetAction);
        }
      } else {
        setCircularProgress(false);
        console.log('not success');
      }
    } catch (e) {
      setCircularProgress(false);
      handleError(e);
    }
  };

  return (
    <View>
      {/* <Text allowFontScaling={false} style={{ fontSize: 12, marginTop:10, marginBottom: 15}}>Your payment has failed. please try again.</Text> */}
      {CircularProgress === false ? (
        // <TouchableOpacity
        //   style={{
        //     padding: 8,
        //     borderRadius: 5,
        //     backgroundColor: '#FFFFFF',
        //     borderWidth: 1,
        //     borderColor: '#6B90BC',
        //   }}
        //   onPress={() => handleRazorpaySubmit()}>
        //   <Text
        //     allowFontScaling={false}
        //     style={{color: '#54595C', fontSize: 12, textAlign: 'center'}}>
        //     Retry Payment
        //   </Text>
        // </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onPressRetry()}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image source={require('../../../assets/Package.png')} />
          <View style={{paddingHorizontal: 4}}></View>
          <Text>Retry Payment</Text>
        </TouchableOpacity>
      ) : (
        // <TouchableOpacity
        //   style={{
        //     padding: 8,
        //     borderRadius: 5,
        //     backgroundColor: '#FFFFFF',
        //     borderWidth: 1,
        //     borderColor: '#6B90BC',
        //   }}
        //   onPress={() => null}>
        //   <Text
        //     allowFontScaling={false}
        //     style={{color: '#54595C', fontSize: 12, textAlign: 'center'}}>
        //     Retrying...
        //   </Text>
        // </TouchableOpacity>
        <TouchableOpacity
          onPress={() => null}
          style={{flexDirection: 'row', alignItems: 'center'}}>
          <Image source={require('../../../assets/Package.png')} />
          <View style={{paddingHorizontal: 4}}></View>
          <Text>Retrying...</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
