import React, {Component} from 'react';
import {View, Text, FlatList, TouchableOpacity, Image} from 'react-native';
import TouchableCustom from '@helpers/touchable_custom';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './drawersidebar.style';
import tokenClass from '@helpers/token';
import {removeCartId} from '@helpers/cart_id';
import {DentalkartContext} from '@dentalkartContext';
import {MEDIA_URL, Version} from '@config/environment';
import {
  showErrorMessage,
  showSuccessMessage,
} from '../../helpers/show_messages';
import {StatusBarScreen} from '../statusbar';
import {LOGOUT_QUERY} from '../../screens/account/modules/authentication';
import imageConstant from '@helpers/images';
import SyncStorage from '@helpers/async_storage';
import {logout} from '../Analytics/AnalyticsCall';
import {customerClient} from '../../apollo_client';
function handlePress(navigation, path, loginRequired) {
  const {state, navigate} = navigation;
  this.requestAnimationFrame(async () => {
    try {
      const routerLength = state.routes.length;
      const innerRouteLength = state.routes[0].routes.length;
      const lastScreen =
        state.routes[routerLength - 1].routes[innerRouteLength - 1].routeName;
      if (path != lastScreen) {
        if (loginRequired) {
          const isLoggedIn = await tokenClass.loginStatus();
          if (isLoggedIn) {
            navigate(path);
            navigation.closeDrawer();
          } else {
            navigate('Login', {screen: lastScreen});
          }
        } else {
          navigate(path);
          navigation.closeDrawer();
        }
      } else {
        navigation.closeDrawer();
      }
    } catch (error) {
      showErrorMessage(`${error.message}. Please try again.`);
    }
  });
}

export default class DrawerSidebar extends Component {
  static contextType = DentalkartContext;

  sliderList = [
    {key: 'Home', path: 'Home', icon: 'home', loginRequired: false},
    {
      key: 'Shop By Category',
      path: 'ShopByCategory',
      icon: 'file-tree',
      type: 'MaterialCommunityIcons',
      loginRequired: false,
    },
    {
      key: 'My Orders',
      path: 'OrdersList',
      isImg: true,
      loginRequired: true,
      img: imageConstant.myOrder,
    },
    {
      key: 'My Rewards',
      path: 'MyRewards',
      icon: 'bitcoin',
      loginRequired: true,
    },
    {
      key: 'My Addresses',
      path: 'Address',
      icon: 'map-marker-outline',
      loginRequired: true,
      type: 'MaterialCommunityIcons',
    },
    {
      key: 'My Wishlist',
      path: 'Wishlist',
      icon: 'heart-outline',
      loginRequired: true,
      type: 'MaterialCommunityIcons',
    },
    // {key: 'My Tickets', path: 'TicketList', icon: 'inbox', loginRequired: true},
    {
      key: 'My Profile',
      path: 'Profile',
      img: imageConstant.user,
      loginRequired: true,
      isImg: true,
      // type: 'MaterialCommunityIcons',
    },
    // {
    //   key: 'My Returns',
    //   path: 'ReturnListScreen',
    //   icon: 'home-export-outline',
    //   loginRequired: true,
    // },
    // {
    //   key: 'Change Country',
    //   path: 'Country',
    //   icon: 'flag-variant',
    //   loginRequired: false,
    //   type: 'MaterialCommunityIcons',
    // },
    {
      key: 'Help Center',
      path: 'HelpCenter',
      icon: 'comment-question',
      loginRequired: false,
      type: 'MaterialCommunityIcons',
    },
    // {
    //   key: 'My return',
    //   path: 'ReturnListScreen',
    //   isImg:true,
    //   loginRequired: false,
    //   img: imageConstant.myOrder
    // },
  ];

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

  sliderListTemplate = (item, navigation) => {
    const countryCode = this.context?.country?.country_id ?? null;
    const flagUrl = countryCode
      ? `${MEDIA_URL}flags/${countryCode.toLowerCase()}.png`
      : null;
    return (
      <TouchableCustom
        underlayColor={'#ffffff10'}
        activeOpacity={0.4}
        onPress={() => handlePress(navigation, item.path, item.loginRequired)}>
        <View style={[styles.drawerList, {}]}>
          <View style={styles.listarrMappingView}>
            <View style={styles.listarrMappingIconView}>
              {item.isImg ? (
                <Image
                  source={item.img}
                  style={styles.listarrMappingImgSize}
                  resizeMode={'contain'}
                />
              ) : (
                <Icon
                  name={item.icon}
                  size={22}
                  style={styles.listarrMappingIconSize}
                />
              )}
            </View>
            <Text allowFontScaling={false} style={styles.sliderListName}>
              {item.key}
            </Text>
            {item.path === 'Country' ? (
              <Image source={{uri: flagUrl}} style={styles.flagImage} />
            ) : null}
          </View>
          <Icon name={'menu-right'} size={22} style={styles.menuRightIcon} />
        </View>
      </TouchableCustom>
    );
  };
  render() {
    const {userInfo} = this.context;
    const name = userInfo?.getCustomer
      ? userInfo.getCustomer.firstname + ' ' + userInfo.getCustomer.lastname
      : 'Hello Guest';
    const email = userInfo?.getCustomer ? userInfo.getCustomer.email : '';
    return (
      <View style={styles.drawerWrapper}>
        <StatusBarScreen />
        <View style={styles.detailsWrapper}>
          <View style={styles.userIconView}>
            <Image
              source={imageConstant.user1}
              style={styles.userIcon}
              resizeMode={'contain'}
            />
          </View>
          <View style={{}}>
            <Text
              allowFontScaling={false}
              numberOfLines={1}
              style={styles.userName}>
              {name}
            </Text>
          </View>
        </View>

        <FlatList
          data={this.sliderList}
          renderItem={({item}) =>
            this.sliderListTemplate(item, this.props.navigation)
          }
          numColounms={this.sliderList.length}
          extraData={this.props}
        />

        <TouchableOpacity
          style={styles.logoutBtnView}
          onPress={() =>
            userInfo
              ? this.setLogout()
              : this.props.navigation.navigate('Login')
          }>
          <View style={{flexDirection: 'row'}}>
            <Image
              source={imageConstant.logOut}
              style={styles.logoutIcon}
              resizeMode={'contain'}
            />
            <Text allowFontScaling={false} style={styles.logoutTxt}>
              {userInfo ? 'Logout' : 'Login'}
            </Text>
          </View>
        </TouchableOpacity>
        <Text allowFontScaling={false} style={styles.version}>
          Version: {Version}
        </Text>
      </View>
    );
  }
}
