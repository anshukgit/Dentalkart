import React, {Component} from 'react';
import {View, StyleSheet, Platform, Linking, Alert} from 'react-native';
import tokenClass from '@helpers/token';
import {DentalkartContext} from '@dentalkartContext';
import SyncStorage from '@helpers/async_storage';
import {ActivityIndicator} from 'react-native';
import {SecondaryColor} from '@config/environment';
import SplashScreen from 'react-native-splash-screen';
import appsFlyer from 'react-native-appsflyer';
import WebEngage from 'react-native-webengage';
import {extractQueryParams} from '@helpers/url_resolver_keys';
import {getDeepLinkData} from '@helpers/get_request';
var webengage = new WebEngage();

// await firebase.analytics().logEvent("screenname", {
//     screenName: "Login",
//     appName: "Dentalkart",
// });

const storeUrl =
  Platform.OS === 'ios'
    ? 'https://itunes.apple.com/us/app/dentalkart/id1382207992?ls=1&mt=8'
    : 'market://details?id=com.vasadental.dentalkart';
function handleUpdate(url) {
  this.requestAnimationFrame(() => {
    Linking.canOpenURL(url)
      .then(supported => {
        if (!supported) {
          console.log("Can't handle url: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch(err => console.log('An error occurred', err));
  });
}

export default class AuthLoading extends Component {
  static contextType = DentalkartContext;
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }
  updateAlert() {
    Alert.alert(
      'Update App',
      'We have resolved some major bugs/issue to make the experience better.\n' +
        'Please upgrade to the app to have better experience.',
      [
        {
          text: 'UPDATE',
          onPress: () => {
            handleUpdate(storeUrl);
            this.updateAlert();
          },
        },
      ],
      {
        cancelable: false,
        onDismiss: () => this.updateAlert(),
      },
    );
  }
  setInitialScreen = async (notification = null) => {
    const {navigate} = this.props.navigation;
    if (!notification) {
      const isFirstTime = await SyncStorage.get('firstTime');
      const isLoggedIn = await tokenClass.loginStatus();
      if (isLoggedIn || isFirstTime) {
        navigate('Home', {entry: true});
      } else {
        navigate('Login', {screen: 'Home', entry: true});
      }
    } else {
      this.navigateToTarget(notification, true);
    }
  };
  setParentNavigationProp = () => {
    const {navigation} = this.props;
    const {setNavigationProp} = this.context;
    setNavigationProp(navigation);
  };
  navigate = url => {
    const {navigate} = this.props.navigation;
    const route = url.replace(/.*?:\/\//g, '');
    const id = route.match(/\/([^\/]+)\/?$/)?.[1];
    const routeName = route.split('/')[1];
    if (routeName === 'cart') {
      navigate('Cart', {id});
    } else if (routeName === 'orderSuccess') {
      navigate('OrderSuccess', {id});
    }
  };

  proceedToLogin = async (token, entry) => {
    return new Promise(async (resolve, reject) => {
      const {getUserInfo, getGuestAndCustomerCartId, getWhatsAppLink} =
        this.context;
      await getUserInfo();
      await getWhatsAppLink();
      await getGuestAndCustomerCartId();
      resolve(true);
    });
  };

  // handleInitialScreen = async res => {
  //   console.log(
  //     'NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN',
  //     res.data,
  //   );
  //   const urlKey = res?.data?.path;
  //   return setTimeout(() => {
  //     return this.props.navigation.navigate('UrlResolver', {
  //       url_key: urlKey,
  //       // referralCode: res?.data?.referralCode,
  //       // referType: res?.data?.referType,
  //     });
  //   }, 1000);
  // };

  handleInitialScreen = async res => {
    console.log(
      'NNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN',
      res.data,
    );
    if (res?.data?.path) {
      const urlKey = res?.data?.path;
      return setTimeout(() => {
        return this.props.navigation.navigate('UrlResolver', {
          url_key: urlKey,
          referralCode: res?.data?.referralCode,
          referType: res?.data?.referType,
        });
      }, 1000);
    }
    if (!!res?.data?.path) {
      if (res?.data?.deep_link_value === 'shorts') {
        const videoId = res?.data?.videoId;
        return this.props.navigation.navigate('VideoNews', {
          videoId: videoId,
        });
      }
      if (res?.data?.deep_link_value === 'cart') {
        return this.props.navigation.navigate('Cart');
      }
      if (res?.data?.deep_link_value === 'products') {
        const urlKey = res?.data?.path;
        console.log('hdhsfdhfsfdhsfdh', urlKey);
        return setTimeout(() => {
          return this.props.navigation.navigate('UrlResolver', {
            url_key: '/' + urlKey,
            referralCode: res?.data?.referralCode,
            referType: res?.data?.referType,
          });
        }, 3000);
      }
      if (res?.data?.deep_link_value === 'profile') {
        return this.props.navigation.navigate('Account');
      }
      if (res?.data?.deep_link_value === 'order-list') {
        return setTimeout(() => {
          setTimeout(() => {
            this.props.navigation.navigate('OrdersList');
          }, 0);
          this.props.navigation.navigate('Account');
        }, 3000);
      }
      if (res?.data?.deep_link_value === 'sale') {
        return this.props.navigation.navigate('Branding', {
          saleUrl: 'https://www.dentalkart.com' + res?.data?.urlKey,
        });
      }
      if (res?.data?.deep_link_value === 'home') {
        return this.props.navigation.navigate('Home');
      }
    }

    return this.props.navigation.navigate('UrlResolver', {
      url_key: res?.data?.urlKey,
      entry: false,
    });
  };

  extractDeeplinkData = async url => {
    try {
      const extraParams = extractQueryParams(url);
      const urlBeforeQueryParams = url.split('?');
      const extractedUrlBeforeQueryParams = urlBeforeQueryParams[0]
        .split('/')
        .reverse();
      const deeplinkId = extractedUrlBeforeQueryParams[0];
      const onelinkId = extractedUrlBeforeQueryParams[1];
      const resultPromise = await getDeepLinkData(onelinkId, deeplinkId);
      const result = await resultPromise.json();
      const res = {
        data: {},
      };
      if (Object.keys(result).length > 0) {
        Object.keys(result).forEach((k, i) => {
          res.data[k] = result[k];
        });
      }
      if (Object.keys(extraParams).length > 0) {
        Object.keys(extraParams).forEach((k, i) => {
          res.data[k] = extraParams[k];
        });
      }
      this.handleInitialScreen(res);
    } catch (error) {
      console.error(error);
    }
  };

  componentDidMount() {
    const init = async () => {
      // TODO:// change isDubug flag to false after testing
      const cthis = this;
      webengage.push.onClick(function (notificationData) {
        console.log('notificationData' + JSON.stringify(notificationData));
        cthis.extractDeeplinkData(notificationData['deeplink']);
      });
      webengage.notification.onClick(function (notificationData, clickId) {
        console.log(
          'App: in-app notification clicked: click-id: ' +
            clickId +
            ', deep-link: ' +
            JSON.stringify(notificationData),
        );
        cthis.extractDeeplinkData(notificationData['deepLink']);
      });
      try {
        let isDeeplink = false;
        appsFlyer.onDeepLink(res => {
          console.log('appsFlyer.onDeepLink', res);
          isDeeplink = true;
          if (
            res?.deepLinkStatus !== 'NOT_FOUND' &&
            res?.status !== 'failure'
          ) {
            this.handleInitialScreen(res);
          } else {
            this.props.navigation.navigate('Home');
          }
        });

        if (!isDeeplink) {
          this.setInitialScreen();
          this.setParentNavigationProp();
        }
      } catch (error) {
        console.error('deeplink error: ', error);
        this.setInitialScreen();
        this.setParentNavigationProp();
      }
      let path = ['deeply', 'nested', 'deep_link', 'deeplink', 'link'];
      appsFlyer.addPushNotificationDeepLinkPath(
        path,
        res => console.log('pushresult', res),
        error => console.log('pusherror', error),
      );

      appsFlyer.initSdk(
        {
          devKey: '56HVuQCdooe9EBMnNkzPnC',
          isDebug: true,
          appId: 'com.vasadental.dentalkart',
          onDeepLinkListener: true,
        },
        result => {
          console.log('appsFlyer result ==================', result);
        },
        error => {
          console.log('appsFlyer error ==================', error);
        },
      );

      appsFlyer.startSdk();
    };
    init().finally(() => {
      SplashScreen.hide();
      console.log('Bootsplash has been hidden successfully');
    });
    // this.updateAlert();
  }
  render() {
    return this.state.loading ? (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={SecondaryColor} />
      </View>
    ) : (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={SecondaryColor} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

// import React, {Component} from 'react';
// import {
//   View,
//   StyleSheet,
//   Platform,
//   Linking,
//   Alert,
//   ActivityIndicator,
// } from 'react-native';
// import tokenClass from '@helpers/token';
// import {DentalkartContext} from '@dentalkartContext';
// import SyncStorage from '@helpers/async_storage';
// import {SecondaryColor} from '@config/environment';
// import SplashScreen from 'react-native-splash-screen';
// import appsFlyer from 'react-native-appsflyer';
// import WebEngage from 'react-native-webengage';
// import {extractQueryParams} from '@helpers/url_resolver_keys';
// import {getDeepLinkData} from '@helpers/get_request';

// const webengage = new WebEngage();

// const storeUrl =
//   Platform.OS === 'ios'
//     ? 'https://itunes.apple.com/us/app/dentalkart/id1382207992?ls=1&mt=8'
//     : 'market://details?id=com.vasadental.dentalkart';

// class AuthLoading extends Component {
//   static contextType = DentalkartContext;

//   constructor(props) {
//     super(props);
//     this.state = {
//       loading: false,
//     };
//   }

//   handleUpdate(url) {
//     Linking.canOpenURL(url)
//       .then(supported => {
//         if (!supported) {
//           console.log("Can't handle url: " + url);
//         } else {
//           return Linking.openURL(url);
//         }
//       })
//       .catch(err => console.log('An error occurred', err));
//   }

//   updateAlert() {
//     Alert.alert(
//       'Update App',
//       'We have resolved some major bugs/issues to improve your experience.\n' +
//         'Please upgrade the app for a better experience.',
//       [{text: 'UPDATE', onPress: () => this.handleUpdate(storeUrl)}],
//       {cancelable: false},
//     );
//   }

//   setInitialScreen = async (notification = null) => {
//     const {navigate} = this.props.navigation;
//     if (!notification) {
//       const isFirstTime = await SyncStorage.get('firstTime');
//       const isLoggedIn = await tokenClass.loginStatus();
//       if (isLoggedIn || isFirstTime) {
//         navigate('Home', {entry: true});
//       } else {
//         navigate('Login', {screen: 'Home', entry: true});
//       }
//     } else {
//       this.navigateToTarget(notification, true);
//     }
//   };

//   extractDeeplinkData = async url => {
//     try {
//       const extraParams = extractQueryParams(url);
//       const urlBeforeQueryParams = url.split('?')[0].split('/').reverse();
//       const deeplinkId = urlBeforeQueryParams[0];
//       const onelinkId = urlBeforeQueryParams[1];
//       const resultPromise = await getDeepLinkData(onelinkId, deeplinkId);
//       const result = await resultPromise.json();

//       const res = {data: {...result, ...extraParams}};
//       this.handleInitialScreen(res);
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   componentDidMount() {
//     const init = async () => {
//       webengage.push.onClick(notificationData => {
//         this.extractDeeplinkData(notificationData['deeplink']);
//       });

//       webengage.notification.onClick((notificationData, clickId) => {
//         this.extractDeeplinkData(notificationData['deepLink']);
//       });

//       appsFlyer.onDeepLink(res => {
//         if (res?.deepLinkStatus !== 'NOT_FOUND' && res?.status !== 'failure') {
//           this.handleInitialScreen(res);
//         } else {
//           this.props.navigation.navigate('Home');
//         }
//       });

//       this.setInitialScreen();
//     };

//     init().finally(() => {
//       SplashScreen.hide();
//       console.log('Bootsplash has been hidden successfully');
//     });
//   }

//   render() {
//     return (
//       <View style={styles.loading}>
//         <ActivityIndicator size="large" color={SecondaryColor} />
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   loading: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default AuthLoading;
