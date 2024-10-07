import React from 'react';
import {Icon} from 'native-base';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  Image,
  Pressable,
  ScrollView,
  SafeAreaView,
} from 'react-native';
// import { screenPadding, moderateScale, writeLog, verticalScale, responsiveHeight, responsiveFontSize, responsiveWidth } from '../helpers/functions';
import colors from '@config/colors';
import {DentalkartContext} from '@dentalkartContext';

// import fonts from '../helpers/font'
class headerComponent extends React.Component {
  static contextType = DentalkartContext;
  render() {
    const {userInfo, cartCount} = this.context;
    const {
      navigation,
      label,
      isheart,
      onPress,
      onHeartPress,
      isempty,
      getHelp,
      style,
      AddnewAddress,
      gethelpPress,
      addressBtnPress,
      hideCart,
      newsHeader,
      bookmarkNews,
      likeNews,
      bookmark,
      like,
      shareNews,
      onSearchPress,
      cartPress,
    } = this.props;
    return (
      <SafeAreaView>
        <View style={[styles.headerView]}>
          <StatusBar
            // barStyle="default"
            hidden={false}
            backgroundColor={'#fff'}
            barStyle={'dark-content'}
            translucent={false}
          />
          <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
            <Pressable
              style={[styles.leftimgView]}
              onPress={() => (onPress ? onPress() : navigation.goBack())}>
              <Icon
                name="md-arrow-back"
                type="Ionicons"
                style={{fontSize: 25, color: colors.blueColor, right: 5}}
              />
            </Pressable>
            <View style={{marginStart: 5}}>
              <Text
                allowFontScaling={false}
                style={{color: colors.productHeaderText, fontSize: 16}}>
                {label}
              </Text>
            </View>
          </View>
          {newsHeader && (
            <View style={styles.headerLeftSideView}>
              <Pressable onPress={() => likeNews()} style={styles.shareBtnView}>
                {like ? (
                  <AntDesignIcon name={'like1'} size={22} />
                ) : (
                  <AntDesignIcon name={'like2'} size={22} />
                )}
              </Pressable>
              <Pressable
                onPress={() => shareNews()}
                style={styles.shareBtnView}>
                <Ionicons name={'share-social-outline'} size={22} />
              </Pressable>
              <Pressable
                onPress={() => bookmarkNews()}
                style={styles.shareBtnView}>
                {bookmark ? (
                  <FontistoIcon name={'bookmark-alt'} size={22} />
                ) : (
                  <FontistoIcon name={'bookmark'} size={22} />
                )}
              </Pressable>
            </View>
          )}
          {isempty ? null : (
            <View style={styles.headerLeftSideView}>
              <Pressable
                onPress={() => {
                  onSearchPress ? onSearchPress() : null;
                  navigation.navigate('Search');
                }}
                style={styles.shareBtnView}>
                <Image
                  source={require('../../assets/Header/search.png')}
                  resizeMode="contain"
                  style={{
                    width: 20,
                    height: 20,
                  }}
                />
              </Pressable>
              {!hideCart && (
                <Pressable
                  onPress={() => {
                    cartPress ? cartPress() : null;
                    navigation.navigate('Cart');
                  }}
                  style={{paddingLeft: 10}}>
                  <View style={styles.cartView}>
                    <Image
                      source={require('../../assets/Header/cart.png')}
                      resizeMode="contain"
                      style={{
                        width: 20,
                        height: 20,
                      }}
                    />
                    {cartCount > 0 && (
                      <View style={styles.cartCount}>
                        <Text
                          allowFontScaling={false}
                          style={{fontSize: 9, color: colors.white}}>
                          {cartCount}
                        </Text>
                      </View>
                    )}
                  </View>
                </Pressable>
              )}
            </View>
          )}

          {/* {
          getHelp ?
            <View style={[styles.headerLeftSideView, { alignItems: 'center', justifyContent: 'flex-end' }]}>
              <Pressable style={[styles.heartView, { borderWidth: 1, borderColor: colors.orangeBtn, width: '55%', height: '60%', }]} onPress={gethelpPress}>
                <Text allowFontScaling={false} style={{ fontSize: 10, color: colors.orangeBtn }}>Get Help</Text>
              </Pressable>

            </View>
            :
            null
        } */}

          {/* {
          AddnewAddress ?
            <Pressable style={[styles.headerLeftSideView, { alignItems: 'center', justifyContent: 'center', width: '100%', }]} onPress={addressBtnPress}>
              <Text allowFontScaling={false} style={{ fontSize: 14, width: '100%', alignContent: 'center', color: colors.blueColor }}>+  Add new address</Text>
            </Pressable>
            :
            null
        } */}
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  headerView: {
    height: 50,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingStart: 20,
    backgroundColor: colors.white,
  },
  leftimgView: {width: '7%', height: '70%', justifyContent: 'center'},
  headerLeftSideView: {
    height: '70%',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginRight: 10,
  },
  heartView: {
    width: '20%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareBtnView: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  cartView: {
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  cartCount: {
    width: 15,
    height: 15,
    borderRadius: 12,
    backgroundColor: colors.NeonCarrot,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 2,
    right: -2,
  },
});
export default headerComponent;
