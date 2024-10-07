import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
  TouchableHighlight,
  ToastAndroid,
  Pressable,
} from 'react-native';
import {SecondaryColor} from '@config/environment';
import Header from '@components/header';
// import  from 'react-native-vector-icons/MaterialCommunityIcons';
import {Icon} from 'native-base';
import AccountCard from '@components/accountCard';
import tokenClass from '@helpers/token';
import {removeCartId} from '@helpers/cart_id';
import {DentalkartContext} from '@dentalkartContext';
import {LOGOUT_QUERY} from './modules/authentication';
import {GoogleSignin} from '@react-native-community/google-signin';
import {fireAnalyticsEvent} from '@helpers/firebase_analytics';
import SyncStorage from '@helpers/async_storage';
import {
  showErrorMessage,
  showSuccessMessage,
} from '../../helpers/show_messages';
import {Version} from '@config/environment';
import {logout} from '../../components/Analytics/AnalyticsCall';
import {customerClient} from '../../apollo_client';
import referAdd from '../../assets/referAdd.png';
import AnalyticsEvents from '../../components/Analytics/AnalyticsEvents';
export default class Account extends Component {
  static contextType = DentalkartContext;
  constructor(props) {
    super(props);
    this.state = {
      listArr: [
        {
          name: 'My Profile',
          pageName: 'Profile',
          img: require('../../assets/user1.png'),
        },
        {
          iconName: 'location-pin',
          type: 'SimpleLineIcons',
          isIcon: true,
          name: 'Manage Address',
          pageName: 'Address',
        },
        {
          name: 'My Order',
          pageName: 'OrdersList',
          img: require('../../assets/myOrder.png'),
        },
        {
          iconName: 'hearto',
          type: 'AntDesign',
          isIcon: true,
          name: 'My wishlist',
          pageName: 'Wishlist',
        },
        // {  name: 'My ticket', pageName: '' },
        // { name: 'My return', pageName: 'ReturnListScreen', img: require('../../assets/myOrder.png') },
        {
          iconName: 'bitcoin',
          type: 'MaterialCommunityIcons',
          isIcon: true,
          name: 'My rewards',
          pageName: 'MyRewards',
        },
        // {
        //   iconName: 'user',
        //   type: 'MaterialCommunityIcons',
        //   isIcon: true,
        //   name: 'My Referral',
        //   pageName: 'MyReferral',
        // },
        {
          name: 'My Referral',
          pageName: 'MyReferral',
          img: referAdd,
        },
        {
          iconName: 'tag-heart',
          type: 'MaterialCommunityIcons',
          isIcon: true,
          name: 'My Membership',
          pageName: 'MyMemberShip',
        },
        {
          iconName: 'comment-question',
          type: 'MaterialCommunityIcons',
          isIcon: true,
          name: 'Help center',
          pageName: 'HelpCenter',
        },
        // { iconName: 'cog-outline', type: 'MaterialCommunityIcons', isIcon: true, name: 'Account Settings', pageName: 'Profile' },
      ],
    };
  }
  async setLogout() {
    const {
      client,
      getUserInfo,
      setUserInfo,
      getGuestAndCustomerCartId,
      getCartItemCount,
    } = this.context;
    try {
      await customerClient.mutate({mutation: LOGOUT_QUERY});
      await tokenClass.removeToken();
      await removeCartId();
      await setUserInfo(null);
      await getUserInfo();
      await SyncStorage.remove('guest_cart_id');
      await SyncStorage.remove('customer_cart_id');
      await SyncStorage.remove('delivery_address');
      await SyncStorage.remove('pincode');
      await SyncStorage.remove('userInfoData');
      await getCartItemCount(0);
      await getGuestAndCustomerCartId();
      // await GoogleSignin.revokeAccess();
      // await GoogleSignin.signOut();
      logout();
      showSuccessMessage('Logged out successfully.');
      this.props.navigation.navigate('Home');
    } catch (error) {
      showErrorMessage(`${error.message}. Please try again.`);
    }
  }
  handlePress(item) {
    this.props.navigation.navigate(item.path);
  }
  navigateToProfile() {
    this.props.navigation.navigate('Profile');
  }
  triggerScreenEvent = _ => {
    const {userInfo} = this.context;
    fireAnalyticsEvent({
      eventname: 'screenname',
      screenName: 'Account',
      userId: userInfo && userInfo.getCustomer ? userInfo.getCustomer.id : '',
    });
  };
  componentDidMount() {
    AnalyticsEvents('ACCOUNT_PAGE_VIEWED', 'Account Page viewed', {});
    this.triggerScreenEvent();
  }

  listarrMapping(userInfo) {
    return this.state.listArr.map((data, index) => {
      return (
        <Pressable
          key={index?.toString()}
          style={styles.listarrMappingMainView}
          onPress={() =>
            userInfo
              ? this.props.navigation.navigate(data.pageName)
              : this.props.navigation.navigate('Login', {screen: data.pageName})
          }>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.listarrMappingIconView}>
              {data.isIcon ? (
                <Icon
                  name={data.iconName}
                  type={data.type}
                  style={styles.listarrMappingIconSize}
                />
              ) : (
                <Image
                  source={data.img}
                  style={styles.listarrMappingImgSize}
                  resizeMode={'contain'}
                />
              )}
            </View>
            <Text allowFontScaling={false} style={styles.listarrMappingName}>
              {data.name}
            </Text>
          </View>

          <Icon
            name="chevron-small-right"
            type="Entypo"
            style={{fontSize: 25, color: '#9098B1'}}
          />
        </Pressable>
      );
    });
  }
  render() {
    const {userInfo} = this.context;
    const user = userInfo ? userInfo.getCustomer : {};
    return (
      <View style={{flex: 1}}>
        <Header
          menu
          title
          account
          search
          cart
          navigation={this.props.navigation}
        />

        <View style={styles.container}>
          <TouchableOpacity
            style={styles.userIconMainView}
            onPress={() => this.navigateToProfile()}>
            <View style={styles.userIconView}>
              <Image
                source={require('../../assets/user.png')}
                style={styles.userIcon}
                resizeMode={'contain'}
              />
            </View>
            <View style={{}}>
              <Text allowFontScaling={false} style={styles.userName}>
                {user?.firstname ?? ''} {user?.lastname ?? ''}
              </Text>
              <Text allowFontScaling={false} style={styles.userEmail}>
                {user?.email ? user?.email : user?.mobile ? user?.mobile : ''}
              </Text>
            </View>
          </TouchableOpacity>
          <View style={styles.listarrView}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {this.listarrMapping(userInfo)}

              <TouchableOpacity
                style={styles.logoutBtnView}
                onPress={() =>
                  userInfo
                    ? this.setLogout()
                    : this.props.navigation.navigate('Login')
                }>
                <View style={{flexDirection: 'row'}}>
                  <Image
                    source={require('../../assets/logOut.png')}
                    style={styles.logoutIcon}
                    resizeMode={'contain'}
                  />
                  {/* <Icon name="logout" type='MaterialCommunityIcons'style={{color:'#fff',fontSize:20,left:-5}} /> */}
                  <Text allowFontScaling={false} style={styles.logoutTxt}>
                    {userInfo ? 'Logout' : 'Login'}
                  </Text>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
        <Text allowFontScaling={false} style={styles.version}>
          Version: {Version}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFfF',
    flex: 1,
  },
  userInfoContainer: {
    backgroundColor: SecondaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    marginBottom: 10,
  },
  userImage: {
    width: 80,
    height: 80,
  },
  name: {
    color: '#fff',
    fontSize: 18,
    marginVertical: 5,
  },
  email: {
    color: '#fff',
    fontSize: 12,
  },
  editButton: {
    position: 'absolute',
    bottom: 10,
    right: 30,
  },
  buttonContainer: {
    elevation: 3,
    marginVertical: 10,
    marginBottom: 50,
  },
  buttonWrapper: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#00000050',
    padding: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 15,
    marginLeft: 10,
  },
  listarrMappingMainView: {
    width: '100%',
    height: 55,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listarrMappingIconView: {
    width: 35,
    height: 35,
    borderRadius: 2,
    backgroundColor: '#F1FCFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listarrMappingName: {fontSize: 16, left: 20, color: colors.normalText},
  userIconMainView: {
    flex: 0.15,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  userIconView: {
    width: 70,
    height: 70,
    borderWidth: 0.5,
    borderColor: '#c3c3c3',
    borderRadius: 70 / 2,
    marginRight: 8,
  },
  userIcon: {width: '100%', height: '100%', borderRadius: 40},
  userName: {fontSize: 15, color: '#223263', height: 25, fontWeight: '800'},
  userEmail: {fontSize: 12, color: '#9098B1', height: 25},
  listarrView: {
    flex: 0.85,
    width: '100%',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  logoutBtnView: {
    height: 50,
    width: 140,
    borderRadius: 3,
    marginTop: 50,
    backgroundColor: colors.blueColor,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  logoutIcon: {width: 20, height: 20, marginRight: 10},
  logoutTxt: {color: colors.white, fontSize: 15, fontWeight: '800'},
  listarrMappingIconSize: {fontSize: 19, color: colors.blueColor},
  listarrMappingImgSize: {
    width: '60%',
    height: '60%',
    tintColor: colors.blueColor,
  },
  version: {textAlign: 'center', fontSize: 12, paddingBottom: 5},
});
