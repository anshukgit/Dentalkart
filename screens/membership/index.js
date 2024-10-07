import React, {useState, useEffect, useContext, useCallback} from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import HeaderComponent from '@components/HeaderComponent';
import RadioButton from '@components/radioButton';
import styles from './memberShip.style';
import LinearGradient from 'react-native-linear-gradient';
import {useQuery} from 'react-apollo';
import {DentalkartContext} from '@dentalkartContext';
import {GET_FAQ, GET_PLANS} from './graphql';
import SyncStorage from '@helpers/async_storage';
import tokenClass from '@helpers/token';
import getSavingAmount from '@helpers/getSavingAmount';
import {showErrorMessage} from '@helpers/show_messages';
import RangeSlider from 'rn-range-slider';
import Thumb from './Thumb';
import Rail from './Rail';
import RailSelected from './RailSelected';
import {addToCart} from '@screens/cart';

export default MemberShip = ({navigation}) => {
  const [total, setTotal] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const context = useContext(DentalkartContext);
  const FREE_DELIVERY_PRICE = 100;

  const NO_OF_MONTHS = +(selectedPlan?.plan_duration / 30).toFixed(0);
  const total_gain_price = total.reduce(function (accumulator, currentValue) {
    return accumulator + currentValue.value;
  }, 0);
  const [selectValue, setSelectValue] = useState(5000);

  const [state, setState] = useState({});
  const [plans, setPlans] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [isPlanActive, setPlanActive] = useState(false);
  const [addToCartLoading, setAddToCartLoading] = useState(false);

  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);

  const {data: plansData} = useQuery(GET_PLANS, {
    fetchPolicy: 'cache-and-network',
  });

  const {data: faqData} = useQuery(GET_FAQ, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    let setData = async () => {
      let guest_cart_id = await SyncStorage.get('guest_cart_id');
      let customer_cart_id = await SyncStorage.get('customer_cart_id');
      let isLoggedIn = await tokenClass.loginStatus();
      let cart_id = isLoggedIn ? customer_cart_id : guest_cart_id;
      setState({
        ...state,
        isLoggedIn,
        customer_cart_id,
        guest_cart_id,
        cart_id,
      });
    };
    setData();
  }, [state]);

  useEffect(() => {
    let setData = () => {
      console.log('faqs', faqData);
      if (faqData?.faqcategoryitem) setFaqs(faqData?.faqcategoryitem);
    };
    return setData();
  }, [faqData]);
  useEffect(() => {
    let setData = () => {
      console.log('plansData', plansData?.memberShipInfo?.plans);
      if (plansData?.memberShipInfo) {
        setPlans(plansData?.memberShipInfo?.plans);
        setPlanActive(plansData?.memberShipInfo?.isActive);
        let INDExx = plansData?.memberShipInfo?.plans.findIndex(
          item => item.is_default,
        );
        setSelectedPlan(plansData?.memberShipInfo?.plans?.[INDExx]);
      }
    };
    return setData();
  }, [plansData]);

  const addToCartPress = async () => {
    if (!state.isLoggedIn) {
      showErrorMessage('Login required for membership.');
      return navigation.navigate('Login');
    }
    setAddToCartLoading(true);
    await addToCart(
      {...selectedPlan, type_id: selectedPlan?.__typename},
      context,
    );
    setAddToCartLoading(false);
  };

  const onValueChanged = useCallback(
    (low, high) => {
      console.log('onValueChanged', low, high);
      setSelectValue(low);
    },
    [setSelectValue],
  );

  useEffect(() => {
    return setTotal([
      {
        label: 'Reward benefit',
        gain_per_price: getSavingAmount(selectValue),
        value: getSavingAmount(selectValue) * NO_OF_MONTHS,
      },
      {
        label: 'Free delivery *',
        gain_per_price: FREE_DELIVERY_PRICE,
        value: FREE_DELIVERY_PRICE * NO_OF_MONTHS,
      },
    ]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPlan, NO_OF_MONTHS, selectValue]);

  return (
    <SafeAreaView>
      <>
        <ScrollView>
          <View style={styles.container}>
            <HeaderComponent
              navigation={navigation}
              label={'Membership'}
              style={{height: 40}}
              hideCart={true}
            />
            <View style={styles.bannerContainer}>
              <Image
                style={styles.membershipBanner}
                source={require('../../assets/Membership-Page-Final-Desktop_01.jpg')}
              />
            </View>
            <View style={styles.bannerContainer}>
              <Image
                style={styles.membershipBenefitBanner}
                source={require('../../assets/Membership-Page-Final-Desktop_02.jpg')}
              />
            </View>
            <View style={styles.planDetails}>
              <View style={styles.planHeading}>
                <Text allowFontScaling={false} style={styles.planTitle}>
                  TWO MEMBERSHIP PLANS TO CHOOSE
                </Text>
              </View>
              <View style={styles.planCardContainer}>
                {plans?.map(plan => {
                  return (
                    <View
                      style={[
                        styles.planCard,
                        {
                          shadowColor:
                            selectedPlan?.sku === plan?.sku
                              ? '#ecbf6b'
                              : '#e4dede',
                        },
                      ]}>
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedPlan(plan);
                        }}>
                        <View style={styles.cardTitle}>
                          <RadioButton
                            selected={selectedPlan?.sku === plan?.sku}
                            style={styles.radioButton}
                            dotStyle={styles.dotStyle}
                          />
                          <Text
                            allowFontScaling={false}
                            style={styles.planName}>
                            {Number(plan?.plan_duration) / 30 >= 12
                              ? Number(plan?.plan_duration) / 30 / 12
                              : Number(plan?.plan_duration) / 30}{' '}
                            {Number(plan?.plan_duration) / 30 < 12
                              ? 'Month'
                              : 'Year'}{' '}
                            plan
                          </Text>
                        </View>
                        <View style={styles.planName}>
                          <Text
                            allowFontScaling={false}
                            style={[styles.planName, {fontSize: 14}]}>
                            ₹ {plan?.price}
                          </Text>
                          <Text
                            allowFontScaling={false}
                            style={[
                              styles.planName,
                              {fontWeight: '600', fontSize: 10},
                            ]}>
                            ₹{' '}
                            {(
                              Number(plan?.price) /
                              (Number(plan?.plan_duration) / 30)
                            ).toFixed(1)}
                            / month
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
              <View style={[{marginTop: 10, alignSelf: 'center'}]}>
                <LinearGradient
                  colors={['rgba(249, 105, 75, 1)', 'rgba(247, 179, 102, 0.9)']}
                  start={{x: 0, y: 0}}
                  style={styles.ButtonMember}>
                  <Text allowFontScaling={false} style={styles.becomeAMember}>
                    Become a member now
                  </Text>
                </LinearGradient>
              </View>

              <View style={styles.sliderContainer}>
                <RangeSlider
                  style={styles.rangeSliderStyle}
                  id={3}
                  disableRange={true}
                  floatingLabel
                  low={selectValue}
                  minRange={5000}
                  // high={filters?.price?.max || 500000}
                  renderThumb={renderThumb}
                  renderRail={renderRail}
                  // renderLabel={renderLabel}
                  renderRailSelected={renderRailSelected}
                  min={0}
                  max={20000}
                  step={5000}
                  selectionColor="#1976d2"
                  blankColor="#abcbef"
                  onValueChanged={onValueChanged}
                  // onTouchEnd={onValueChangeEnd}
                />
                <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                  <Text
                    allowFontScaling={false}
                    style={[
                      {
                        fontSize: 12,
                        color: '#000000de',
                        alignSelf: 'center',
                        marginVertical: 4,
                        paddingHorizontal: 5,
                      },
                    ]}>
                    ₹5000/month
                  </Text>
                  <Text
                    allowFontScaling={false}
                    style={[
                      {
                        fontSize: 12,
                        color: '#000000de',
                        alignSelf: 'center',
                        marginVertical: 4,
                        paddingHorizontal: 5,
                      },
                    ]}>
                    ₹10000/month
                  </Text>
                  <Text
                    allowFontScaling={false}
                    style={[
                      {
                        fontSize: 12,
                        color: '#000000de',
                        alignSelf: 'center',
                        marginVertical: 4,
                        paddingHorizontal: 5,
                      },
                    ]}>
                    ₹15000/month
                  </Text>
                </View>
              </View>
              <View style={styles.centeraign}>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.becomeAMember,
                    {
                      fontSize: 14,
                      color: '#1a81b6',
                      alignSelf: 'flex-start',
                      marginVertical: 4,
                      paddingHorizontal: 10,
                    },
                  ]}>
                  As a Plus Member, you will save upto.
                </Text>
                <View
                  style={[styles.ButtonMember, {backgroundColor: '#FFFFFF'}]}>
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.becomeAMember,
                      {
                        fontSize: 17,
                        color: '#1a81b6',
                        alignSelf: 'flex-start',
                        marginLeft: 15,
                      },
                    ]}>
                    ₹ {total_gain_price}
                  </Text>
                </View>
              </View>
              <View style={styles.centeraign}>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.becomeAMember,
                    {
                      fontSize: 14,
                      color: '#464444',
                      alignSelf: 'flex-start',
                      marginVertical: 4,
                      paddingHorizontal: 10,
                    },
                  ]}>
                  Break Down
                </Text>
                <View style={styles.amountBox}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 14,
                      color: '#464444',
                      fontWeight: 'bold',
                    }}>
                    Reward benefit
                  </Text>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 14,
                      color: '#464444',
                      fontWeight: 'bold',
                    }}>
                    ₹{total?.[0]?.gain_per_price} x {NO_OF_MONTHS} = ₹
                    {total?.[0]?.value}
                  </Text>
                </View>
              </View>
              <View style={styles.centeraign}>
                <View style={[styles.amountBox, {backgroundColor: '#f3f8f4'}]}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 14,
                      color: '#464444',
                      fontWeight: 'bold',
                    }}>
                    Free delivery *
                  </Text>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 14,
                      color: '#464444',
                      fontWeight: 'bold',
                    }}>
                    ₹{total?.[1]?.gain_per_price} x {NO_OF_MONTHS} = ₹
                    {total?.[1]?.value}
                  </Text>
                </View>
              </View>
              <View style={styles.centeraign}>
                <View style={styles.amountBox}>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 14,
                      color: '#464444',
                      fontWeight: 'bold',
                    }}>
                    Total
                  </Text>
                  <Text
                    allowFontScaling={false}
                    style={{
                      fontSize: 14,
                      color: '#464444',
                      fontWeight: 'bold',
                    }}>
                    ₹{total_gain_price}
                  </Text>
                </View>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.becomeAMember,
                    {
                      fontSize: 14,
                      color: '#afaeae',
                      alignSelf: 'flex-start',
                      marginVertical: 4,
                      paddingHorizontal: 10,
                    },
                  ]}>
                  *Assuming 1 order per month.
                </Text>
              </View>
            </View>
            {/* ======================================== */}

            <View>
              <Image
                style={styles.imgbanner1}
                source={require('../../assets/Membership-Page-Final-mobile_04.jpg')}
              />
              <Image
                style={styles.imgbanner2}
                source={require('../../assets/Membership-Page-Final-mobile_05.jpg')}
              />
            </View>
            <View
              style={[{marginTop: 10, marginBottom: 10, alignSelf: 'center'}]}>
              <LinearGradient
                colors={
                  isPlanActive ? ['#e6e1df', '#cecccb'] : ['#2b85bd', '#5baddc']
                }
                start={{x: 0, y: 0}}
                style={[
                  styles.ButtonMember,
                  {alignItems: 'center', borderRadius: 5},
                ]}>
                {isPlanActive ? (
                  <View style={styles.CartButton}>
                    <>
                      <Icon
                        name={'cart'}
                        size={18}
                        style={{
                          fontSize: 18,
                          color: '#FFFFFF',
                          marginRight: 5,
                          marginTop: 2,
                        }}
                      />
                      <Text
                        allowFontScaling={false}
                        style={{
                          fontSize: 18,
                          color: '#FFFFFF',
                          fontWeight: '600',
                        }}>
                        Add to Cart
                      </Text>
                    </>
                  </View>
                ) : (
                  <TouchableOpacity
                    style={styles.CartButton}
                    onPress={addToCartPress}>
                    {addToCartLoading ? (
                      <ActivityIndicator size="small" color="#343434" />
                    ) : (
                      <>
                        <Icon
                          name={'cart'}
                          size={18}
                          style={{
                            fontSize: 18,
                            color: '#FFFFFF',
                            marginRight: 5,
                            marginTop: 2,
                          }}
                        />
                        <Text
                          allowFontScaling={false}
                          style={{
                            fontSize: 18,
                            color: '#FFFFFF',
                            fontWeight: '600',
                          }}>
                          Add to Cart
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                )}
              </LinearGradient>
              <LinearGradient
                colors={['#ec7f55', '#f1ae67']}
                start={{x: 0, y: 0}}
                style={[
                  styles.ButtonMember,
                  {marginTop: 30, paddingHorizontal: 15},
                ]}>
                <Text
                  allowFontScaling={false}
                  style={[
                    styles.becomeAMember,
                    {alignSelf: 'flex-start', fontWeight: '600'},
                  ]}>
                  Frequenty Asked Questions
                </Text>
              </LinearGradient>
            </View>

            {faqs.map(element => {
              return (
                <View style={styles.BorderBox}>
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.becomeAMember,
                      {
                        fontSize: 16,
                        color: '#464444',
                        alignSelf: 'flex-start',
                        marginVertical: 1,
                        fontWeight: '600',
                      },
                    ]}>
                    Q. {element?.question?.replace(/<\/?[^>]+(>|$)/g, '')}
                  </Text>
                  <Text
                    allowFontScaling={false}
                    style={[
                      styles.becomeAMember,
                      {
                        fontSize: 16,
                        color: '#afaeae',
                        alignSelf: 'flex-start',
                        marginVertical: 1,
                        fontWeight: '600',
                      },
                    ]}>
                    {element?.answer?.replace(/<\/?[^>]+(>|$)/g, '')}
                  </Text>
                </View>
              );
            })}

            <LinearGradient
              colors={['#ec7f55', '#f1ae67']}
              start={{x: 0, y: 0}}
              style={[
                styles.ButtonMember,
                {
                  marginTop: 30,
                  marginBottom: 10,
                  paddingHorizontal: 15,
                  alignSelf: 'center',
                },
              ]}>
              <Text
                allowFontScaling={false}
                style={[
                  styles.becomeAMember,
                  {alignSelf: 'flex-start', fontWeight: '600'},
                ]}>
                Terms & conditions
              </Text>
            </LinearGradient>
            <View style={[styles.BorderBox, {marginBottom: 10}]}>
              <Text
                allowFontScaling={false}
                style={[
                  styles.becomeAMember,
                  {
                    fontSize: 16,
                    color: '#464444',
                    alignSelf: 'flex-start',
                    marginVertical: 5,
                    fontWeight: '600',
                  },
                ]}>
                1. Plus membership duration begins from the date of purchase.
              </Text>
              <Text
                allowFontScaling={false}
                style={[
                  styles.becomeAMember,
                  {
                    fontSize: 16,
                    color: '#464444',
                    alignSelf: 'flex-start',
                    marginVertical: 5,
                    fontWeight: '600',
                  },
                ]}>
                2. One Plus membership applicable to only one account.
              </Text>
              <Text
                allowFontScaling={false}
                style={[
                  styles.becomeAMember,
                  {
                    fontSize: 16,
                    color: '#464444',
                    alignSelf: 'flex-start',
                    marginVertical: 5,
                    fontWeight: '600',
                  },
                ]}>
                3. Plus membership plan fee is non-refundable. Amount once paid
                will not be refunded under any circumstances.
              </Text>
              <Text
                allowFontScaling={false}
                style={[
                  styles.becomeAMember,
                  {
                    fontSize: 16,
                    color: '#464444',
                    alignSelf: 'flex-start',
                    marginVertical: 5,
                    fontWeight: '600',
                  },
                ]}>
                4. Buyer can choose if Plus membership has to be renewed.
                Auto-renewal will not be implemented on its own.
              </Text>
              <Text
                allowFontScaling={false}
                style={[
                  styles.becomeAMember,
                  {
                    fontSize: 16,
                    color: '#464444',
                    alignSelf: 'flex-start',
                    marginVertical: 5,
                    fontWeight: '600',
                  },
                ]}>
                5. Plus membership depend upon date of purchase and inventory
                availability.
              </Text>
              <Text
                allowFontScaling={false}
                style={[
                  styles.becomeAMember,
                  {
                    fontSize: 16,
                    color: '#464444',
                    alignSelf: 'flex-start',
                    marginVertical: 5,
                    fontWeight: '600',
                  },
                ]}>
                6. Benefits will not be applicable on any purchase before the
                purchase of Plus membership or after membership gets over.
              </Text>
              <Text
                allowFontScaling={false}
                style={[
                  styles.becomeAMember,
                  {
                    fontSize: 16,
                    color: '#464444',
                    alignSelf: 'flex-start',
                    marginVertical: 5,
                    fontWeight: '600',
                  },
                ]}>
                7. Plus benefits cannot be redeemed in any other way than
                mentioned.
              </Text>
            </View>
          </View>
        </ScrollView>
      </>
    </SafeAreaView>
  );
};
