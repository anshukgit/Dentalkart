import React from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  Linking,
} from 'react-native';
import {NavigationActions} from 'react-navigation';
import {DentalkartContext} from '@dentalkartContext';
import {fireAnalyticsEvent} from '@helpers/firebase_analytics';
import API from '@config/api';
import getRequest from '@helpers/get_request';
import HeaderComponent from '@components/HeaderComponent';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {THANKYOU_PAGE} from './graphql';
import {newclient} from '@apolloClient';
import {Query} from 'react-apollo';
import {AirbnbRating} from 'react-native-ratings';

function _handelPress(reset) {
  this.requestAnimationFrame(() => {
    reset([NavigationActions.navigate({routeName: 'Tabs'})], 0);
  });
}

export class OrderSuccessScreen extends React.Component {
  static contextType = DentalkartContext;
  constructor(props) {
    super(props);
    this.state = {
      order_id: props.navigation.state.params.orderId,
      rating: 0,
      retryPayment: props.navigation.state.params
        ? props.navigation.state.params.retryPayment
        : false,
    };
  }

  triggerScreenEvent = _ => {
    const {userInfo} = this.context;
    fireAnalyticsEvent({
      eventname: 'screenname',
      screenName: `Order Success`,
      userId: userInfo && userInfo.getCustomer ? userInfo.getCustomer.id : '',
    });
  };
  componentDidMount() {
    this.triggerScreenEvent();
    const {getUserInfo, getCartItemCount} = this.context;
    getUserInfo();
    this.checkNewOrder();
  }

  async checkNewOrder() {
    const {handleError, getGuestAndCustomerCartId} = this.context;
    getRequest(API.checkout.order_success)
      .then(res => res.json())
      .then(data => {
        if (data.isValid) {
        }
      })
      .catch(error => handleError(error));
  }

  getBanner = () => {
    return (
      <Query
        query={THANKYOU_PAGE}
        client={newclient}
        variables={{source: 'app'}}
        fetchPolicy="network-only">
        {({loading, error, data, refetch}) => {
          if (data && data?.thankyoupage?.length) {
            return data?.thankyoupage.map(item => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    if (item.link && item.link.includes('membership')) {
                      this.props.navigation.navigate('MemberShip');
                    } else if (item.link) {
                      this.props.navigation.navigate('UrlResolver', {
                        url_key: item.link,
                      });
                    }
                  }}>
                  <Image
                    source={{uri: item?.img}}
                    style={styles.bannerImage}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              );
            });
          }
          return null;
        }}
      </Query>
    );
  };

  ratingCompleted(rating) {
    this.setState({rating: rating});
    Linking.openURL(
      Platform.OS == 'android'
        ? 'https://play.google.com/store/apps/details?id=com.vasadental.dentalkart'
        : 'https://apps.apple.com/app/dentalkart/id1382207992?ls=1',
    );
  }

  render() {
    const {reset, state} = this.props.navigation;
    const order_id = this.state?.order_id ?? state.params.orderId;
    return (
      <View style={{flex: 1}}>
        <HeaderComponent
          navigation={this.props.navigation}
          label={'Order Confirmed'}
          style={styles.headerContainer}
        />
        <ScrollView style={{flex: 1}} bounces={false}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
            }}>
            <Icon name="check-circle" size={50} color={'#7da7d9'} />
            {/* <Image
              source={{
                uri: 'https://s3.ap-south-1.amazonaws.com/dentalkart-media/React/Web+Icon+%26+Skeleton+Gif/order_succcess.gif',
              }}
              style={styles.confirmIcon}
            /> */}
            <Text style={styles.titleText}>Order placed successfully!</Text>
            <Text style={styles.subTitleText}>Order ID: #{order_id}</Text>
          </View>
          <View style={styles.playStoreContainer}>
            <Image
              source={require('../../assets/playstore.png')}
              style={styles.playStoreContainerImage}
            />
            <View style={styles.playStoreDataContainer}>
              <Text style={styles.playStoreContainerText}>
                Support us by rating us on Play Store/Apple Store
              </Text>
              <View style={{alignItems: 'flex-start', marginTop: 5}}>
                <AirbnbRating
                  count={5}
                  defaultRating={this.state.rating}
                  size={22}
                  showRating={false}
                  onFinishRating={rating => this.ratingCompleted(rating)}
                />
              </View>
            </View>
          </View>
          {this.getBanner()}
          <View style={styles.trackContainer}>
            <Image
              source={require('../../assets/tracking.png')}
              style={styles.playStoreContainerImage}
            />
            <View style={styles.playStoreDataContainer}>
              <Text style={styles.trackContainerText}>
                Track and manage your order easily
              </Text>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate('OrdersList')}
                style={styles.viewOrderContainer}>
                <Text
                  allowFontScaling={false}
                  style={styles.viewOrderContainerText}>
                  View Order
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => _handelPress(reset)}
            style={styles.continueShoppingContainer}>
            <Text
              allowFontScaling={false}
              style={styles.continueShoppingContainerText}>
              Continue Shopping
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }
}

export default OrderSuccessScreen;

const styles = StyleSheet.create({
  headerContainer: {height: 40},
  confirmIcon: {
    aspectRatio: 2 / 3,
    width: wp('18%'),
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: wp('5%'),
  },
  subTitleText: {
    marginTop: hp('.5%'),
    fontWeight: '500',
    fontSize: wp('3.5%'),
  },
  playStoreContainer: {
    marginTop: hp('3%'),
    width: wp('95%'),
    alignSelf: 'center',
    borderWidth: 1,
    flexDirection: 'row',
    borderRadius: hp('.5%'),
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('2%'),
    borderColor: '#C0C0C0',
    marginBottom: hp('2%'),
  },
  playStoreContainerImage: {
    borderRadius: hp('.5%'),
    height: wp('15%'),
    width: wp('15%'),
  },
  playStoreDataContainer: {flex: 1, marginLeft: wp('2%')},
  playStoreContainerText: {
    color: '#808080',
    fontWeight: '600',
    fontSize: wp('3.8%'),
  },
  playStoreStarContainer: {
    flexDirection: 'row',
    marginTop: hp('1%'),
  },
  trackContainer: {
    marginTop: hp('2%'),
    width: wp('95%'),
    alignSelf: 'center',
    flexDirection: 'row',
    borderRadius: hp('.5%'),
    paddingVertical: hp('1.5%'),
    paddingHorizontal: wp('2%'),
    backgroundColor: '#F5F5F5',
  },
  trackContainerText: {
    fontWeight: '500',
    fontSize: wp('4%'),
  },
  viewOrderContainer: {
    width: wp('30%'),
    borderRadius: hp('.5%'),
    paddingVertical: hp('.8%'),
    alignItems: 'center',
    marginTop: hp('1.5%'),
    backgroundColor: '#2b79ac',
  },
  viewOrderContainerText: {
    color: '#212121',
    fontWeight: '500',
    fontSize: 16,
    color: '#FFF',
  },
  continueShoppingContainer: {
    width: wp('90%'),
    alignSelf: 'center',
    borderWidth: 1,
    borderRadius: hp('.5%'),
    paddingVertical: hp('1.5%'),
    alignItems: 'center',
    marginVertical: hp('2%'),
  },
  continueShoppingContainerText: {
    color: '#212121',
    fontWeight: '500',
    fontSize: 16,
  },
  bannerImage: {
    alignSelf: 'center',
    width: wp('95%'),
    height: hp('28%'),
    marginBottom: hp('1%'),
  },
});
