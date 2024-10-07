import React, {useState, useEffect} from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  SafeAreaView,
  Touchable,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {GET_CUSTOMER_MEMBERSHIP} from '../graphql';
import HeaderComponent from '@components/HeaderComponent';
import styles from './myMemberShip.style';
import {useQuery} from 'react-apollo';
import moment from 'moment';
import Loader from '@components/loader';
export default MyMemberShip = ({navigation}) => {
  const [membership, setMembership] = useState({});

  const {data: membershipData, loading} = useQuery(GET_CUSTOMER_MEMBERSHIP, {
    fetchPolicy: 'cache-and-network',
  });

  useEffect(() => {
    let setData = () => {
      console.log('plansData', membershipData?.customerMembership);
      if (membershipData?.customerMembership) {
        setMembership(membershipData?.customerMembership);
      }
    };
    return setData();
  }, [membershipData]);

  return loading ? (
    <Loader loading={true} transparent={true} />
  ) : (
    <>
      <SafeAreaView>
        <HeaderComponent
          navigation={navigation}
          label={'My Membership'}
          style={{height: 40}}
          hideCart={true}
        />
      </SafeAreaView>
      <ScrollView style={styles.mainContainer}>
        {membership?.currentPlan?.orderId === null &&
        membership?.memberships?.length === 0 ? (
          <>
            <View style={styles.noPlanView}>
              <Image
                style={styles.noPlanBanner}
                source={require('../../../assets/social-responsibility-flat-modern-design-illustration_566886-106.jpeg')}
              />
              <View style={styles.textGroup}>
                <Text style={styles.textYay}>YAY!!</Text>
                <Text style={styles.beforeMembershipText}>
                  Become a DentalKart Plus{' '}
                </Text>
                <Text style={styles.beforeMembershipText}>
                  member and start saving more.
                </Text>
              </View>
              <TouchableOpacity
                style={styles.enrollButton}
                onPress={() => navigation.navigate('MemberShip')}>
                <Text style={styles.labelActive}>ENROLL NOW</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.container}>
            {membership?.currentPlan?.orderId !== null ? (
              <View style={styles.planCard}>
                <Image
                  style={styles.benefitsBanner}
                  source={require('../../../assets/benefits-3.png')}
                />
                <View style={styles.cardContent}>
                  <Text style={styles.currentPlan} allowFontScaling={false}>
                    Current Plan
                  </Text>
                  <Text style={styles.planDuration} allowFontScaling={false}>
                    {membership?.currentPlan?.duration}
                  </Text>
                  <Text style={styles.daysLeft} allowFontScaling={false}>
                    @{membership?.currentPlan?.price}
                  </Text>
                  <Text style={styles.daysLeft} allowFontScaling={false}>
                    {membership?.daysLeft}
                  </Text>
                </View>
              </View>
            ) : (
              <View style={styles.planCard}>
                <View style={styles.cardContent}>
                  <Text
                    style={styles.renewTextHeading}
                    allowFontScaling={false}>
                    Oh no!
                  </Text>
                  <Text
                    style={styles.renewTextDescription}
                    allowFontScaling={false}>
                    We hate to see you go, but your membership has expired.
                    renew your membership now
                  </Text>
                  <TouchableOpacity
                    style={styles.enrollButton}
                    onPress={() => navigation.navigate('MemberShip')}>
                    <View style={styles.renew}>
                      <Icon
                        name={'refresh'}
                        size={18}
                        color={'#fff'}
                        style={styles.renewIcon}
                      />
                      <Text style={styles.labelActive}>RENEW</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}
            <View style={styles.totalSavingCard}>
              <Image
                style={styles.savingsBanner}
                source={require('../../../assets/savings.png')}
              />
              <View style={styles.cardContent}>
                <Text style={styles.daysLeft} allowFontScaling={false}>
                  Total savings till now{' '}
                  <Text
                    style={styles.totalSavingTotal}
                    allowFontScaling={false}>
                    {membership?.monetoryValue}
                  </Text>
                </Text>
                <Text allowFontScaling={false}>
                  <Text
                    style={styles.savingDescription}
                    allowFontScaling={false}>
                    Be a Dentalkart premium member and enjoy multiple benfits
                    like free shipping, double rewards value and many more.
                  </Text>
                  <Text
                    onPress={() => navigation.navigate('MemberShip')}
                    style={styles.viewDetails}
                    allowFontScaling={false}>
                    View Details
                  </Text>
                </Text>
              </View>
            </View>
            <View style={styles.scrollView}>
              <View style={styles.cardContainer}>
                <View style={styles.cardHeading}>
                  <Text style={styles.headingText} allowFontScaling={false}>
                    MEMBERSHIP ORDERS
                  </Text>
                </View>
                {membership?.memberships?.map((item, index) => {
                  const createdAt = moment(item?.createdAt);
                  const expiryDate = moment(item?.expiryDate);
                  const diffInMonths = Math.ceil(
                    expiryDate.diff(createdAt, 'months', true),
                  );
                  return (
                    <View
                      style={styles.membershipOrdersCard}
                      key={index?.toString()}>
                      <View>
                        <View style={styles.itemDetail}>
                          <View style={styles.cardContentLeft}>
                            <Text
                              style={[styles.labelLeft, {paddingBottom: 4}]}
                              allowFontScaling={false}>
                              Status:
                            </Text>
                            <Text
                              style={styles.labelLeft}
                              allowFontScaling={false}>
                              Order Id:
                            </Text>
                            <Text
                              style={styles.labelLeft}
                              allowFontScaling={false}>
                              Purchased On:
                            </Text>
                            <Text
                              style={[styles.labelLeft]}
                              allowFontScaling={false}>
                              Validity:
                            </Text>
                          </View>
                          <View style={styles.cardContentRight}>
                            {item?.isActive === true ? (
                              <View style={styles.labelActiveView}>
                                <Text
                                  style={styles.labelActive}
                                  allowFontScaling={false}>
                                  ACTIVE
                                </Text>
                              </View>
                            ) : (
                              <View style={styles.labelExpiredView}>
                                <Text
                                  style={styles.labelActive}
                                  allowFontScaling={false}>
                                  EXPIRED
                                </Text>
                              </View>
                            )}
                            <Text
                              style={styles.labelLeft}
                              allowFontScaling={false}>
                              {item?.orderId}
                            </Text>

                            <Text
                              style={styles.labelLeft}
                              allowFontScaling={false}>
                              {moment(item?.createdAt).format('Do MMM YYYY')}
                            </Text>
                            <Text
                              style={styles.labelLeft}
                              allowFontScaling={false}>
                              {/* {new moment().to(moment(item.expiryDate), true)} */}
                              {`${diffInMonths} ${
                                diffInMonths === 1 ? 'Month' : 'Months'
                              }`}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      {/* </SafeAreaView> */}
    </>
  );
};
