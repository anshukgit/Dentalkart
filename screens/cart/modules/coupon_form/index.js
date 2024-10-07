import React, {Fragment, useState, useContext, useEffect} from 'react';
import {
  View,
  ScrollView,
  TextInput,
  Text,
  Pressable,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {GET_CUSTOMER_COUPONS} from '../../graphql';
import TouchableCustom from '@helpers/touchable_custom';
import styles from './coupon_form.style';
import NIcon from 'react-native-vector-icons/EvilIcons';
import Header from '@components/header';
import {SafeAreaView} from 'react-native';
import {useQuery} from '@apollo/react-hooks';
import Loader from '@components/loader';
import TextInputComponent from '@components/TextInputComponent';

export default CouponForm = ({
  _this,
  cart,
  appliedCoupon,
  coupon,
  DataLoading,
}) => {
  const [selectedCouponCode, setSelectedCouponCode] = useState(null);

  const CouponBox = ({coupon, onPress, style}) => (
    <TouchableOpacity onPress={onPress} style={styles.CouponModalView}>
      <Pressable style={styles.couponeCodeTextView}>
        <View style={styles.orangeDot}></View>
      </Pressable>
      <View style={styles.couponCodeTxtView}>
        <Text allowFontScaling={false} style={styles.title}>
          {coupon.coupon_code}
        </Text>
        {/* <Text allowFontScaling={false} style={styles.titleDesc}>{coupon.description}</Text> */}
      </View>
    </TouchableOpacity>
  );

  const RenderCouponContainer = ({item}) => {
    const proceedSubmitCoupon = couponCode => {
      setSelectedCouponCode(couponCode);
      _this.setState({couponCode});
    };

    const backgroundColor =
      item.coupon_code === _this.state.couponCode ? '#ddd' : '#fff';

    return (
      <CouponBox
        coupon={item}
        onPress={() => proceedSubmitCoupon(item.coupon_code)}
        style={{backgroundColor}}
      />
    );
  };

  const handleCouponFieldChange = couponCode => {
    _this.setState({couponCode});
    setSelectedCouponCode(null);
  };

  const {loading, error, data} = useQuery(GET_CUSTOMER_COUPONS, {
    fetchPolicy: 'cache-and-network',
  });

  if (loading) {
    return null;
  } else if (error) {
    return <Text allowFontScaling={false}>{error}</Text>;
  } else if (data && data.CustomerCoupons) {
    return (
      <Pressable
        style={[styles.modalMainView, {}]}
        onPress={() => _this.setState({isCouponModal: false})}>
        <View style={styles.applyCouponcodeMainView}>
          <View style={styles.inputWithError}>
            <View style={styles.textInputView}>
              <View style={styles.txtView}>
                <Text allowFontScaling={false} style={styles.couponsTxt}>
                  Coupons
                </Text>
                <TextInputComponent
                  placeholder="Select a coupon code to apply"
                  placeholderTextColor={'#DEE0E3'}
                  onChangeText={couponCode =>
                    handleCouponFieldChange(couponCode)
                  }
                  value={_this.state.couponCode}
                  style={styles.textInput}
                />
              </View>
              <View style={styles.applyBtn}>
                {!appliedCoupon && (
                  <TouchableCustom
                    underlayColor={'#ffffff10'}
                    onPress={() =>
                      _this.state.couponCode
                        ? !DataLoading
                          ? coupon()
                          : null
                        : _this.setState({
                            couponErrorMsg: 'Please enter coupon code.',
                          })
                    }>
                    <View style={[styles.applyCouponButton, {}]}>
                      <Text
                        allowFontScaling={false}
                        style={styles.applyCouponButtonText}>
                        {!DataLoading ? 'Apply' : 'Applying...'}
                      </Text>
                    </View>
                  </TouchableCustom>
                )}
              </View>
            </View>
            {!!_this.state?.couponErrorMsg && (
              <Text allowFontScaling={false} style={styles.couponErrorText}>
                {_this.state?.couponErrorMsg}
              </Text>
            )}
          </View>
          <View style={styles.codeBtn}>
            {data?.CustomerCoupons?.length > 0 && (
              <FlatList
                data={data.CustomerCoupons}
                renderItem={({item, index}) => (
                  <RenderCouponContainer item={item} />
                )}
                keyExtractor={(item, index) => index.toString()}
                extraData={selectedCouponCode}
              />
            )}
          </View>
        </View>
      </Pressable>
    );
  }
};
