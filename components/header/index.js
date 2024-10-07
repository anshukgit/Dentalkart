import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  Platform,
  Image,
  SafeAreaView,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './header.style';
import InfoHeader from '../infoheader';
import {StatusBarScreen} from '../statusbar';
import {fireAnalyticsEvent} from '@helpers/firebase_analytics';
import {DentalkartContext} from '@dentalkartContext';
import SyncStorage from '@helpers/async_storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../config/colors';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';

export default class Header extends Component {
  static contextType = DentalkartContext;
  render() {
    const {userInfo, cartCount} = this.context;
    const {
      home,
      cart,
      title,
      search,
      menu,
      navigation,
      heading,
      scrollToTop,
      showSearchBar,
      hideSearch,
    } = this.props;
    //const cartCount = SyncStorage.get('cartCount');
    return (
      <SafeAreaView>
        {/* <StatusBarScreen /> */}
        {home && <InfoHeader />}
        <View
          style={{
            backgroundColor: '#F1F3F6',
            // borderBottomWidth: 1,
            // borderBottomColor: "#B0D8FF"
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Home')}
              style={{
                marginHorizontal: wp('3%'),
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={{
                  uri: 'https://images.dentalkart.com/Dentalkart_Logo_XDiq2JLyp.png?updatedAt=1686124352821',
                }}
                resizeMode="contain"
                style={{
                  width: wp('35%'),
                  height: hp('7%'),
                }}
              />
            </TouchableOpacity>
            <View style={{flexDirection: 'row'}}>
              {!showSearchBar && !hideSearch && (
                <TouchableOpacity
                  onPress={() => _handlePress(this, 'Search', 'Search')}
                  style={{
                    paddingHorizontal: wp('3%'),
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Image
                    source={require('../../assets/Header/search.png')}
                    resizeMode="contain"
                    style={{
                      width: wp('4.5%'),
                      height: hp('4%'),
                    }}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => _handlePress(this, 'Cart', 'cart')}
                style={{
                  paddingHorizontal: wp('4%'),
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../../assets/Header/cart.png')}
                  resizeMode="contain"
                  style={{
                    width: wp('4.5%'),
                    height: hp('4%'),
                  }}
                />
                {cartCount ? (
                  <View
                    style={{
                      backgroundColor: '#FA9627',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: wp('5%'),
                      height: wp('5%'),
                      borderRadius: hp('2%'),
                      position: 'absolute',
                      top: hp('1.5%'),
                      right: wp('1%'),
                    }}>
                    <Text
                      allowFontScaling={false}
                      style={{
                        color: '#FFFF',
                        fontWeight: '500',
                        fontSize: wp('3%'),
                      }}>
                      {cartCount}
                    </Text>
                  </View>
                ) : null}
              </TouchableOpacity>
            </View>
          </View>
          {showSearchBar && (
            <TouchableOpacity
              onPress={() => _handlePress(this, 'Search', 'Search')}
              activeOpacity={0.5}
              style={{
                flexDirection: 'row',
                backgroundColor: colors.white,
                marginHorizontal: wp('3%'),
                height: hp('5%'),
                borderRadius: hp('3%'),
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingHorizontal: wp('5%'),
                marginBottom: hp('1.5%'),
              }}>
              <Text allowFontScaling={false} style={{color: colors.text}}>
                Search your products here
              </Text>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderLeftWidth: 1,
                  paddingLeft: wp('2.5%'),
                  borderColor: colors.grey,
                }}>
                <Image
                  source={require('../../assets/Header/search.png')}
                  resizeMode="contain"
                  style={{
                    tintColor: colors.grey,
                    width: wp('4.5%'),
                    height: hp('3%'),
                  }}
                />
              </View>
            </TouchableOpacity>
          )}
        </View>
        {/*<View
          style={[
            styles.headerWrapper,
            {
              justifyContent: title ? 'space-between' : 'flex-start',
            },
          ]}>
          <View style={styles.leftIconsWrapper}>
            {menu ? (
              <DrawerIcon
                iconName="menu"
                navigation={navigation}
                userInfo={userInfo}
              />
            ) : (
              <BackIcon _this={this} />
            )}
          </View>
          {title ? (
            <DentalkartLogo _this={this} scrollToTop={scrollToTop} />
          ) : (
            <Text allowFontScaling={false} style={styles.heading}>{heading}</Text>
          )}
          <View style={styles.rightIconsWrapper}>
            {search ? <SearchIcon _this={this} /> : null}
            {cart ? <CartIcon _this={this} cartCount={cartCount ?? 0} /> : null}
          </View>
        </View>
        {home ? (
          <View style={styles.headerWrapperSearch}>
            <TouchableCustom
              underlayColor={'#ffffff10'}
              onPress={() =>
                _handlePress(this, 'ShopByCategory', 'ShopByCategory')
              }>
              <View style={styles.shopByCategory}>
                <Text allowFontScaling={false} style={styles.shopByCategoryText}>Shop by</Text>
                <Text allowFontScaling={false} style={styles.categoryText}>Category</Text>
              </View>
            </TouchableCustom>
            <TouchableCustom
              underlayColor={'#ffffff10'}
              onPress={() => _handlePress(this, 'Search', 'Search')}>
              <View style={styles.inputField}>
                <Icon
                  style={styles.searchIcon}
                  name="md-search"
                  size={25}
                  color={'#cdcdcd'}
                />
                <Text allowFontScaling={false} style={styles.inputFieldPlaceholder}>
                  Search your requirements
                </Text>
              </View>
            </TouchableCustom>
          </View>
        ) : null} */}
      </SafeAreaView>
    );
  }
}

function _handlePress(_this, routeName, operation = null, scrollToTop) {
  const {goBack, state, navigate} = _this.props.navigation;
  this.requestAnimationFrame(() => {
    if (operation == 'home') {
      if (state.routeName != 'Home') {
        navigate('Home');
      } else {
        scrollToTop();
      }
    } else if (operation == 'cart') {
      _this.props.navigation.push('Cart');
    } else if (operation == 'back') {
      const {backCoustomMethod} = _this.props;
      if (backCoustomMethod) {
        backCoustomMethod();
      } else {
        goBack();
      }
    } else {
      navigate(routeName);
    }
  });
}
const BackIcon = ({_this}) => (
  <TouchableOpacity
    style={styles.backIconWrapper}
    onPress={() => _handlePress(_this, 'Back', 'back')}
    hitSlop={{top: 20, right: 10, bottom: 20, left: 20}}>
    <Icon name="md-arrow-back" size={23} color="#ffffff" />
  </TouchableOpacity>
);
const DrawerIcon = ({iconName, navigation, userInfo}) => {
  triggerScreenEvent = routeName => {
    fireAnalyticsEvent({
      eventname: 'screenname',
      screenName: 'Left Navigation Pane',
      baseScreen: routeName,
      userId: userInfo && userInfo.getCustomer ? userInfo.getCustomer.id : '',
    });
  };
  return (
    <TouchableOpacity
      style={styles.drawerWrapper}
      onPress={() => {
        triggerScreenEvent(navigation.state.routeName);
        navigation.openDrawer();
      }}
      hitSlop={{top: 20, right: 20, bottom: 20, left: 10}}>
      <MIcon name={iconName} size={28} color="#fff" />
    </TouchableOpacity>
  );
};
const DentalkartLogo = ({_this, scrollToTop}) => (
  <TouchableOpacity
    style={styles.logoWrapper}
    onPress={() => _handlePress(_this, 'Home', 'home', scrollToTop)}>
    <Text allowFontScaling={false} style={styles.logo}>
      Dentalkart
    </Text>
  </TouchableOpacity>
);
const SearchIcon = ({_this}) => (
  <TouchableOpacity
    style={styles.searchIconWrapper}
    onPress={() => _handlePress(_this, 'Search')}
    hitSlop={{top: 20, right: 10, bottom: 20, left: 20}}>
    <MCIcon name="magnify" size={22} color={'#fff'} />
  </TouchableOpacity>
);
const CartIcon = ({_this, cartCount}) => (
  <TouchableOpacity
    style={styles.cartWrapper}
    onPress={() => _handlePress(_this, 'Cart', 'cart')}
    hitSlop={{top: 20, right: 20, bottom: 20, left: 10}}>
    <MIcon name={'shopping-cart'} size={20} style={styles.rightIcon} />
    <View style={styles.cartCountWrapper}>
      <Text allowFontScaling={false} style={styles.cartCount}>
        {cartCount}
      </Text>
    </View>
  </TouchableOpacity>
);
