import React, {Component} from 'react';
import {ApolloProvider} from 'react-apollo';
import {
  StyleSheet,
  Linking,
  Modal,
  View,
  Text,
  TouchableOpacity,
  InteractionManager,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {SafeAreaView} from 'react-navigation';
import AppNavigator from '@config/routes';
import {client, newclient, cartClient, customerClient} from './apollo_client';
import {LOGOUT_QUERY} from '@screens/account/modules/authentication';
import {logout} from '@components/Analytics/AnalyticsCall';
import {DentalkartProvider} from '@dentalkartContext';
import SyncStorage from '@helpers/async_storage';
import {removeCartId} from '@helpers/cart_id';
import Config from 'react-native-config';
import {
  CUSTOMER_INFO_QUERY,
  APP_REVIEW_ACTION_MUTATION,
  GET_BRANDS_QUERY,
} from '@screens/account';
import {
  GET_CUSTOMER_CART_ID,
  GET_GUEST_CART_ID,
  GET_MERGE_CART,
} from '@screens/cart/graphql';
import {BASE_COUNTRY_QUERY} from '@screens/country';
import tokenClass from '@helpers/token';
import {setCartId} from '@helpers/cart_id';
import {setCountry} from '@helpers/country';
import {getUrlData, setUrlData} from '@helpers/url_resolver_keys';
import gql from 'graphql-tag';
import codePush from 'react-native-code-push';
import {DeviceWidth, DeviceHeight, PrimaryColor} from '@config/environment';
import API from '@config/api';
import {postRequest} from '@helpers/post_request';

import {showErrorMessage} from './helpers/show_messages';
import Toast, {BaseToast, InfoToast} from 'react-native-toast-message';
import AnalyticsEvents from './components/Analytics/AnalyticsEvents';

import SpInAppUpdates, {IAUUpdateKind} from 'sp-react-native-in-app-updates';
import {LogLevel, initialize, setCurrentScreenName} from 'react-native-clarity';
import {enabledPushNotification} from './components/Analytics/AnalyticsCall';
import deviceInfoModule from 'react-native-device-info';

let codePushOptions = {
  updateDialog: false,
  installMode: codePush.InstallMode.IMMEDIATE,
};

const clarityConfig = {
  logLevel: LogLevel.Verbose,
  allowMeteredNetworkUsage: true,
  enableWebViewCapture: true,
};

const URL_RESOLVER_QUERY = gql`
  query urlResolver($urlKey: String!) {
    urlResolver(url: $urlKey) {
      id
      type
    }
  }
`;

const GET_ALGOLIA_KEY = gql`
  query {
    storeConfig {
      algolia_api_key
      algolia_application_id
    }
  }
`;

const GET_WHATSAPP_API = gql`
  query {
    getWhatsappApi {
      _id
      icon
      web_link
      app_link
    }
  }
`;

const storeUrl =
  Platform.OS === 'ios'
    ? 'https://itunes.apple.com/us/app/dentalkart/id1382207992?ls=1&mt=8'
    : 'market://details?id=com.vasadental.dentalkart';

function openAppReview(url) {
  try {
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
  } catch (error) {
    console.log('An error occurred', error);
  }
}

const urlResolver = async url => {
  const urlCacheResponse = await getUrlData(url);
  if (urlCacheResponse && urlCacheResponse?.urlResolver !== null) {
    return urlCacheResponse;
  } else {
    try {
      let urlSub = url.replace('.html', '');
      urlSub = `${urlSub}.html`;
      const {data} = await newclient.query({
        query: URL_RESOLVER_QUERY,
        fetchPolicy: 'network-only',
        variables: {urlKey: urlSub},
      });
      setUrlData(url, data);
      return data;
    } catch (error) {
      showErrorMessage(`${error.message}. Please try again.`);
    }
  }
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      userInfo: null,
      brands: null,
      setUserInfo: info => this.setState({userInfo: info || null}),
      setBrands: brands => this.setState({brands: brands || null}),
      whatsAppInfo: null,
      setWhatsAppInfo: whatsAppInfo =>
        this.setState({whatsAppInfo: whatsAppInfo || null}),
      storageSync: false,
      setstorageSynced: () => this.setState({storageSync: true}),
      navigation: null,
      setNavigation: navigation => this.setState({navigation}),
      country: null,
      setAppCountry: country => this.setState({country}),
      appReviewPopup: false,
      setCartCount: count => this.setState({cartCount: count}),
      cartCount: '',
    };
  }

  linking = {
    prefixes: ['https://www.dentalkart.com', 'dentalkart://'],
    config: {
      screens: {
        UrlResolver: ':url_key',
      },
    },
  };

  triggerAppAction = async action => {
    try {
      const {data} = await client.mutate({
        mutation: APP_REVIEW_ACTION_MUTATION,
        variables: {action: action, google_data: ''},
      });
    } catch (e) {
      alert(e);
    }
  };
  setAppReviewPopup = value => {
    if (value) {
      setTimeout(() => {
        this.setState({appReviewPopup: true});
      }, 10000);
    }
  };

  handleError = ({graphQLErrors, networkError, operation, response}) => {
    const type = 'error';
    let msg = null;
    const {navigation} = this.state;
    if (graphQLErrors) {
      graphQLErrors.map(({message, category, path, debugMessage}) => {
        switch (category) {
          case 'graphql-authorization':
            console.warn(`graphql-authorization - ${message}`);
            msg = message;
            break;
          case 'internal':
            console.warn(`internal - ${message}`);
            msg = message;
            break;
          default:
            try {
              let error = JSON.parse(message);
              if (Array.isArray(error)) {
                msg = error[0];
              } else {
                msg = message;
              }
              console.warn(`${message}`);
            } catch (error) {
              console.warn(`${error}`);
            }
        }
      });
    } else if (networkError) {
      console.warn(`networkError - ${networkError}`);
    } else if (operation) {
    } else if (response) {
    }
    return msg;
  };

  setLogout = async (isTokenExpired = false) => {
    try {
      const {setUserInfo} = this.state;
      if (!isTokenExpired) await client.mutate({mutation: LOGOUT_QUERY});
      await tokenClass.removeToken();
      await removeCartId();
      setUserInfo(null);
      await this.getUserInfo();
      await SyncStorage.remove('guest_cart_id');
      await SyncStorage.remove('customer_cart_id');
      await SyncStorage.remove('delivery_address');
      await SyncStorage.remove('pincode');
      await SyncStorage.remove('userInfoData');
      await this.getCartItemCount(0);
      await this.getGuestAndCustomerCartId();
      logout();
      showErrorMessage('Session expired, please login again.');
      this.state.navigation.navigate('Login');
    } catch (error) {
      showErrorMessage(`${error.message}. Please try again1.`);
    }
  };

  initSyncStorage = async () => {
    const {setstorageSynced} = this.state;
    await SyncStorage.init();
    await setstorageSynced();
  };
  setNavigationProp = navigation => {
    //for exposing navigation object of react navigation from authloading(very initial screen)
    const {setNavigation} = this.state;
    setNavigation(navigation);
  };
  getUserInfo = async () => {
    const {setUserInfo} = this.state;
    if (await tokenClass.loginStatus()) {
      try {
        const {data} = await customerClient.query({
          query: CUSTOMER_INFO_QUERY,
          fetchPolicy: 'network-only',
        });
        AnalyticsEvents('USER_INFO', 'User Info', data);
        setUserInfo(data);
        this.setAppReviewPopup(data.IsPopupEnable);
      } catch (e) {
        console.log('eeeeeeeeeee', e);
        const msg = this.handleError(e);
        if (msg) {
          await tokenClass.removeToken();
          await SyncStorage.remove('guest_cart_id');
          await SyncStorage.remove('customer_cart_id');
          await this.getGuestAndCustomerCartId();
          showErrorMessage(msg);
        }
      }
    } else {
      console.warn('Customer Not Logged In');
    }
  };

  getBrands = async () => {
    const {setBrands} = this.state;
    try {
      const {data} = await client.query({
        query: GET_BRANDS_QUERY,
        fetchPolicy: 'network-only',
      });
      setBrands(data?.getBrand || null);
    } catch (e) {
      const msg = this.handleError(e);
      if (msg) {
        showErrorMessage(msg);
      }
    }
  };
  getWhatsAppLink = async () => {
    const {setWhatsAppInfo} = this.state;
    try {
      const {data, loading, error} = await client.query({
        query: GET_WHATSAPP_API,
        fetchPolicy: 'network-only',
      });
      setWhatsAppInfo(data?.getWhatsappApi);
    } catch (e) {
      console.log('Error getWhatsAppLink : ', e);
    }
  };

  appUpdatePopup = () => {
    const inAppUpdates = new SpInAppUpdates(
      false, // isDebug
    );
    // curVersion is optional if you don't provide it will automatically take from the app using react-native-device-info
    inAppUpdates
      .checkNeedsUpdate()
      .then(result => {
        if (result.shouldUpdate) {
          let updateOptions = {};
          if (Platform.OS === 'android') {
            // android only, on iOS the user will be promped to go to your app store page
            updateOptions = {
              updateType: IAUUpdateKind.IMMEDIATE,
            };
          }
          inAppUpdates.startUpdate(updateOptions); // https://github.com/SudoPlz/sp-react-native-in-app-updates/blob/master/src/types.ts#L78
        }
      })
      .catch(e => {
        console.error('app update Error: ', e);
      });
  };

  // getGuestAndCustomerCartId = async () => {
  //   const guest_cart_id = await SyncStorage.get('guest_cart_id');
  //   const customer_cart_id = await SyncStorage.get('customer_cart_id');
  //   const loginStatus = await tokenClass.loginStatus();
  //   try {
  //     if (!loginStatus && !guest_cart_id) {
  //       const {data} = await client.mutate({
  //         mutation: GET_GUEST_CART_ID,
  //         fetchPolicy: 'no-cache',
  //       });
  //       if (data) {
  //         this.getCartItemCount(0);
  //         await SyncStorage.set('guest_cart_id', data.createEmptyCart);
  //         setCartId(data.createEmptyCart);
  //       }
  //     } else if (loginStatus && !customer_cart_id) {
  //       const {data} = await client.query({
  //         query: GET_CUSTOMER_CART_ID,
  //         fetchPolicy: 'network-only',
  //       });
  //       if (data) {
  //         let cartCount = data.customerCart.items.length;
  //         await SyncStorage.set('customer_cart_id', data.customerCart.id);
  //         this.getCartItemCount(cartCount);
  //         setCartId(data.customerCart.id);
  //         if (guest_cart_id) {
  //           await this.getMergeCart(guest_cart_id, data.customerCart.id);
  //         }
  //       }
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   }
  // };
  getGuestAndCustomerCartId = async () => {
    const guest_cart_id = await SyncStorage.get('guest_cart_id');
    const customer_cart_id = await SyncStorage.get('customer_cart_id');
    const loginStatus = await tokenClass.loginStatus();
    console.log(
      '2s222guest_cart_id, customer_cart_id, loginStatus, cartClient',
      guest_cart_id,
      customer_cart_id,
      loginStatus,
    );

    try {
      if (!loginStatus && !guest_cart_id) {
        const {data, error} = await cartClient.mutate({
          mutation: GET_GUEST_CART_ID,
          fetchPolicy: 'no-cache',
        });

        console.log('data===0989891, error', data, error);
        if (data) {
          this.getCartItemCount(0);
          await SyncStorage.set('guest_cart_id', data.createEmptyCartV2);
          setCartId(data.createEmptyCartV2);
        }
      } else if (loginStatus && !customer_cart_id) {
        const {data, error} = await cartClient.mutate({
          mutation: GET_GUEST_CART_ID,
        });
        console.log('data===0989890, error', data, error);
        if (data?.createEmptyCartV2) {
          await SyncStorage.set('customer_cart_id', data.createEmptyCartV2);
          if (guest_cart_id) {
            await this.getMergeCart(guest_cart_id, data.createEmptyCartV2);
          }
        }
      }
    } catch (e) {
      console.log('getGuestAndCustomerCartId======catch121210', e);
    }
  };

  async getMergeCart(guest_cart_id, customer_cart_id) {
    try {
      if (guest_cart_id && customer_cart_id) {
        const {data} = await cartClient.mutate({
          mutation: GET_MERGE_CART,
          variables: {
            source_cart_id: guest_cart_id,
            destination_cart_id: customer_cart_id,
          },
        });
        console.log('data====2211211', data);
        if (data) {
          this.getCartItemCount(data.mergeCartsV2.items.length);
          await SyncStorage.remove('guest_cart_id');
        }
      }
    } catch (err) {
      console.log('getMergeCart', err);
    }
  }

  setInitialBaseCountry = async () => {
    // let country = getCountry();
    let country = false;
    const {setAppCountry} = this.state;
    try {
      if (country) {
        setAppCountry(country);
      } else {
        const {data} = await client.query({
          query: BASE_COUNTRY_QUERY,
          fetchPolicy: 'network-only',
        });
        let countryData = {
          country: data.baseCountry.country,
          country_id: data.baseCountry?.country_id,
          currency_code: data.baseCountry.currency_code,
        };
        setCountry(countryData);
        setAppCountry(countryData);
      }
    } catch (error) {
      console.warn('error', error);
    }
  };

  getAlgoliaKey = async () => {
    try {
      const {data} = await client.query({
        query: GET_ALGOLIA_KEY,
        fetchPolicy: 'network-only',
      });
      if (data && data.storeConfig) {
        SyncStorage.set('app_id', data.storeConfig.algolia_application_id);
        SyncStorage.set('api_key', data.storeConfig.algolia_api_key);
      }
    } catch (error) {
      this.handleError(error);
    }
  };
  setShippingAddress = async () => {
    const country_id = this.state?.country?.country_id;
    const guest_cart_id = await SyncStorage.get('guest_cart_id');
    const customer_cart_id = await SyncStorage.get('customer_cart_id');
    const cart_id = (await tokenClass.loginStatus())
      ? customer_cart_id
      : guest_cart_id;

    const shipingInfoUrl = (await tokenClass.loginStatus())
      ? API.checkout.set_shipping_and_billing_information
      : API.checkout.set_shipping_information(cart_id);

    const address_data = {
      region: '',
      postcode: '',
      country_id: country_id,
    };
    const address_payload = {address: {...address_data}};
    postRequest(
      API.checkout.set_estimate_shipping_methods(cart_id),
      address_payload,
    )
      .then(res => {
        if (!res.ok) {
          throw res;
        }
        return res.json();
      })
      .then(shipping_methods => {
        postRequest(shipingInfoUrl, {
          addressInformation: {
            shipping_address: {...address_data},
            shipping_carrier_code: shipping_methods?.[0]?.carrier_code ?? null,
            shipping_method_code: shipping_methods?.[0]?.method_code ?? null,
          },
        })
          .then(res => {
            if (!res.ok) {
              throw res;
            }
            return res.json();
          })
          .then(data => {
            console.log(data);
          })
          .catch(error => console.log(error));
      })
      .catch(error => console.log('error', error));
  };

  getCartItemCount = async count => {
    this.setState({cartCount: count});
    await SyncStorage.set('cartCount', count);
  };

  checkPermission = async () => {
    if (
      Platform.OS === 'android' &&
      parseInt(deviceInfoModule.getSystemVersion()) > 12
    ) {
      await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      );
      enabledPushNotification();
    }
  };

  async componentDidMount() {
    initialize('jtur52pa4i', clarityConfig);
    this.checkPermission();
    console.log('initialised the clarity project');
    this.appUpdatePopup();
    await this.initSyncStorage();
    await this.getUserInfo();
    await this.getBrands();
    await this.getWhatsAppLink();
    const cart_count = await SyncStorage.get('cartCount');
    this.state.setCartCount(cart_count);
    await this.getGuestAndCustomerCartId();
    this.getCartItemCount(this.state.cartCount);
    this.getAlgoliaKey();
    this.setInitialBaseCountry();
    // await this.setShippingAddress();
  }
  closeAppReviewPopup = () => {
    InteractionManager.runAfterInteractions(() => {
      this.triggerAppAction('a2');
      this.setState({appReviewPopup: false});
    });
  };
  rateApp = () => {
    InteractionManager.runAfterInteractions(() => {
      this.triggerAppAction('a3');
      this.setState({appReviewPopup: false});
      openAppReview(storeUrl);
    });
  };
  setDeeplinkingLoading = status => {
    this.setState({deeplinkingLoading: status});
  };

  render() {
    const {
      userInfo,
      brands,
      storageSync,
      setUserInfo,
      country,
      setAppCountry,
      appReviewPopup,
      whatsAppInfo,
      deeplinkingLoading,
    } = this.state;
    const appContextValues = {
      handleError: this.handleError,
      setLogout: this.setLogout,
      deeplinkingLoading: deeplinkingLoading || false,
      setDeeplinkingLoading: this.setDeeplinkingLoading,
      userInfo,
      brands,
      getUserInfo: this.getUserInfo,
      whatsAppInfo: whatsAppInfo,
      getWhatsAppLink: this.getWhatsAppLink,
      cartCount: this.state.cartCount,
      setUserInfo,
      getGuestAndCustomerCartId: this.getGuestAndCustomerCartId,
      setNavigationProp: this.setNavigationProp,
      getCartItemCount: this.getCartItemCount,
      setShippingAddress: this.setShippingAddress,
      client,
      country,
      setAppCountry,
      urlResolver,
    };
    const AppReviewPopup = () => {
      return (
        <Modal
          animationType="fade"
          visible={appReviewPopup}
          onRequestClose={() => this.closeAppReviewPopup()}
          onShow={() => {
            this.triggerAppAction('a1');
          }}
          transparent={true}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              height: DeviceHeight,
              width: DeviceWidth,
            }}>
            <View
              style={{
                backgroundColor: '#000',
                height: DeviceHeight,
                width: DeviceWidth,
                opacity: 0.5,
                position: 'absolute',
              }}
            />
            <View
              style={{
                width: '70%',
                height: 140,
                backgroundColor: '#fff',
                borderRadius: 5,
                padding: 15,
              }}>
              <View style={{height: 75, width: '100%'}}>
                <Text
                  allowFontScaling={false}
                  style={{fontSize: 15, textAlign: 'center'}}>
                  Your Play Store Review makes a big difference!
                </Text>
              </View>
              <View
                style={{
                  height: 35,
                  width: '100%',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  flexDirection: 'row',
                }}>
                <TouchableOpacity onPress={() => this.closeAppReviewPopup()}>
                  <View
                    style={{
                      borderRadius: 4,
                      borderWidth: 0.5,
                      borderColor: '#fff',
                      width: 100,
                      padding: 5,
                      alignItems: 'center',
                    }}>
                    <Text allowFontScaling={false}>Later</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.rateApp()}>
                  <View
                    style={{
                      borderRadius: 4,
                      borderWidth: 0.5,
                      borderColor: PrimaryColor,
                      width: 100,
                      paddingHorizontal: 5,
                      paddingVertical: 10,
                      alignItems: 'center',
                      backgroundColor: PrimaryColor,
                    }}>
                    <Text allowFontScaling={false} style={{color: '#fff'}}>
                      Rate Now
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      );
    };
    const toastConfig = {
      error: ({text1, text2, props, ...rest}) => (
        <BaseToast
          {...rest}
          style={{borderLeftColor: '#FE6301', height: '100%'}}
          contentContainerStyle={{
            paddingHorizontal: 15,
            paddingVertical: 15,
          }}
          text2Style={{
            fontSize: 13,
            fontWeight: '600',
            color: '#000',
          }}
          text2NumberOfLines={text2 ? Math.ceil(text2.length / 30) : 1}
          text1={text1}
          text2={text2}
        />
      ),
      success: ({text1, text2, props, ...rest}) => (
        <BaseToast
          {...rest}
          style={{borderLeftColor: '#69C779', height: '100%'}}
          contentContainerStyle={{paddingHorizontal: 15, paddingVertical: 15}}
          text2Style={{
            fontSize: 13,
            fontWeight: '600',
            color: '#000',
          }}
          text2NumberOfLines={text2 ? Math.ceil(text2.length / 30) : 1}
          text1={text1}
          text2={text2}
        />
      ),
      info: ({text1, text2, props, ...rest}) => (
        <InfoToast
          {...rest}
          text2Style={{
            fontSize: 13,
            fontWeight: '500',
          }}
          text2NumberOfLines={text2 ? Math.ceil(text2.length / 30) : 1}
          text1={text1}
          text2={text2}
        />
      ),
      my_custom_type: ({text1, props, ...rest}) => (
        <View style={{height: 60, width: '100%', backgroundColor: 'tomato'}}>
          <Text allowFontScaling={false}>{text1}</Text>
        </View>
      ),
    };

    return (
      <ApolloProvider client={client}>
        <SafeAreaView style={styles.safeAndroidArea}>
          <DentalkartProvider value={appContextValues}>
            {storageSync && (
              <AppNavigator
                linking={this.linking}
                onNavigationStateChange={(prevState, newState) => {
                  setCurrentScreenName(newState.routes[0].routeName);
                }}
              />
            )}
            {appReviewPopup && <AppReviewPopup />}
          </DentalkartProvider>
          <Toast config={toastConfig} ref={ref => Toast.setRef(ref)} />
        </SafeAreaView>
      </ApolloProvider>
    );
  }
}

const styles = StyleSheet.create({
  safeAndroidArea: {
    height: '100%',
  },
});

// export default App;
export default codePush(codePushOptions)(App);
// export default Config.ENV === 'development'
//   ? App
//   : codePush(codePushOptions)(App);

// import React, {Component} from 'react';
// import {ApolloProvider} from 'react-apollo';
// import {
//   StyleSheet,
//   Linking,
//   Modal,
//   View,
//   Text,
//   TouchableOpacity,
//   InteractionManager,
//   Platform,
//   PermissionsAndroid,
// } from 'react-native';
// import {SafeAreaView} from 'react-navigation';
// import AppNavigator from '@config/routes';
// import {client, newclient, cartClient, customerClient} from './apollo_client';
// import {LOGOUT_QUERY} from '@screens/account/modules/authentication';
// import {logout} from '@components/Analytics/AnalyticsCall';
// import {DentalkartProvider} from '@dentalkartContext';
// import SyncStorage from '@helpers/async_storage';
// import {removeCartId} from '@helpers/cart_id';
// import Config from 'react-native-config';
// import {
//   CUSTOMER_INFO_QUERY,
//   APP_REVIEW_ACTION_MUTATION,
//   GET_BRANDS_QUERY,
// } from '@screens/account';
// import {
//   GET_CUSTOMER_CART_ID,
//   GET_GUEST_CART_ID,
//   GET_MERGE_CART,
// } from '@screens/cart/graphql';
// import {BASE_COUNTRY_QUERY} from '@screens/country';
// import tokenClass from '@helpers/token';
// import {setCartId} from '@helpers/cart_id';
// import {setCountry} from '@helpers/country';
// import {getUrlData, setUrlData} from '@helpers/url_resolver_keys';
// import gql from 'graphql-tag';
// import codePush from 'react-native-code-push';
// import {DeviceWidth, DeviceHeight, PrimaryColor} from '@config/environment';
// import API from '@config/api';
// import {postRequest} from '@helpers/post_request';

// import {showErrorMessage} from './helpers/show_messages';
// import Toast, {BaseToast, InfoToast} from 'react-native-toast-message';
// import AnalyticsEvents from './components/Analytics/AnalyticsEvents';

// import SpInAppUpdates, {IAUUpdateKind} from 'sp-react-native-in-app-updates';
// import {LogLevel, initialize, setCurrentScreenName} from 'react-native-clarity';
// import {enabledPushNotification} from './components/Analytics/AnalyticsCall';
// import deviceInfoModule from 'react-native-device-info';
// import {AppStack} from './config/navigators/app_stack_navigator';

// let codePushOptions = {
//   updateDialog: false,
//   installMode: codePush.InstallMode.IMMEDIATE,
// };

// const clarityConfig = {
//   logLevel: LogLevel.Verbose,
//   allowMeteredNetworkUsage: true,
//   enableWebViewCapture: true,
// };

// const URL_RESOLVER_QUERY = gql`
//   query urlResolver($urlKey: String!) {
//     urlResolver(url: $urlKey) {
//       id
//       type
//     }
//   }
// `;

// const GET_ALGOLIA_KEY = gql`
//   query {
//     storeConfig {
//       algolia_api_key
//       algolia_application_id
//     }
//   }
// `;

// const GET_WHATSAPP_API = gql`
//   query {
//     getWhatsappApi {
//       _id
//       icon
//       web_link
//       app_link
//     }
//   }
// `;

// const storeUrl =
//   Platform.OS === 'ios'
//     ? 'https://itunes.apple.com/us/app/dentalkart/id1382207992?ls=1&mt=8'
//     : 'market://details?id=com.vasadental.dentalkart';

// function openAppReview(url) {
//   try {
//     this.requestAnimationFrame(() => {
//       Linking.canOpenURL(url)
//         .then(supported => {
//           if (!supported) {
//             console.log("Can't handle url: " + url);
//           } else {
//             return Linking.openURL(url);
//           }
//         })
//         .catch(err => console.log('An error occurred', err));
//     });
//   } catch (error) {
//     console.log('An error occurred', error);
//   }
// }

// const urlResolver = async url => {
//   const urlCacheResponse = await getUrlData(url);
//   if (urlCacheResponse && urlCacheResponse?.urlResolver !== null) {
//     return urlCacheResponse;
//   } else {
//     try {
//       let urlSub = url.replace('.html', '');
//       urlSub = `${urlSub}.html`;
//       const {data} = await newclient.query({
//         query: URL_RESOLVER_QUERY,
//         fetchPolicy: 'network-only',
//         variables: {urlKey: urlSub},
//       });
//       setUrlData(url, data);
//       return data;
//     } catch (error) {
//       showErrorMessage(`${error.message}. Please try again.`);
//     }
//   }
// };

// class App extends Component {
//   constructor() {
//     super();
//     this.state = {
//       userInfo: null,
//       brands: null,
//       setUserInfo: info => this.setState({userInfo: info || null}),
//       setBrands: brands => this.setState({brands: brands || null}),
//       whatsAppInfo: null,
//       setWhatsAppInfo: whatsAppInfo =>
//         this.setState({whatsAppInfo: whatsAppInfo || null}),
//       storageSync: false,
//       setstorageSynced: () => this.setState({storageSync: true}),
//       navigation: null,
//       setNavigation: navigation => this.setState({navigation}),
//       country: null,
//       setAppCountry: country => this.setState({country}),
//       appReviewPopup: false,
//       setCartCount: count => this.setState({cartCount: count}),
//       cartCount: '',
//     };
//   }

//   linking = {
//     prefixes: ['https://www.dentalkart.com', 'com.vasadental.dentalkart://'],
//     config: {
//       screens: {
//         UrlResolver: ':url_key',
//       },
//     },
//   };

//   // componentDidMount() {
//   //   this.linking();
//   // }

//   triggerAppAction = async action => {
//     try {
//       const {data} = await client.mutate({
//         mutation: APP_REVIEW_ACTION_MUTATION,
//         variables: {action: action, google_data: ''},
//       });
//     } catch (e) {
//       alert(e);
//     }
//   };

//   setAppReviewPopup = value => {
//     if (value) {
//       setTimeout(() => {
//         this.setState({appReviewPopup: true});
//       }, 10000);
//     }
//   };

//   handleError = ({graphQLErrors, networkError, operation, response}) => {
//     const type = 'error';
//     let msg = null;
//     const {navigation} = this.state;
//     if (graphQLErrors) {
//       graphQLErrors.map(({message, category, path, debugMessage}) => {
//         switch (category) {
//           case 'graphql-authorization':
//             console.warn(`graphql-authorization - ${message}`);
//             msg = message;
//             break;
//           case 'internal':
//             console.warn(`internal - ${message}`);
//             msg = message;
//             break;
//           default:
//             try {
//               let error = JSON.parse(message);
//               if (Array.isArray(error)) {
//                 msg = error[0];
//               } else {
//                 msg = message;
//               }
//               console.warn(`${message}`);
//             } catch (error) {
//               console.warn(`${error}`);
//             }
//         }
//       });
//     } else if (networkError) {
//       console.warn(`networkError - ${networkError}`);
//     } else if (operation) {
//     } else if (response) {
//     }
//     return msg;
//   };

//   setLogout = async (isTokenExpired = false) => {
//     try {
//       const {setUserInfo} = this.state;
//       if (!isTokenExpired) await client.mutate({mutation: LOGOUT_QUERY});
//       await tokenClass.removeToken();
//       await removeCartId();
//       setUserInfo(null);
//       await this.getUserInfo();
//       await SyncStorage.remove('guest_cart_id');
//       await SyncStorage.remove('customer_cart_id');
//       await SyncStorage.remove('delivery_address');
//       await SyncStorage.remove('pincode');
//       await SyncStorage.remove('userInfoData');
//       await this.getCartItemCount(0);
//       await this.getGuestAndCustomerCartId();
//       logout();
//       showErrorMessage('Session expired, please login again.');
//       this.state.navigation.navigate('Login');
//     } catch (error) {
//       showErrorMessage(`${error.message}. Please try again1.`);
//     }
//   };

//   initSyncStorage = async () => {
//     const {setstorageSynced} = this.state;
//     await SyncStorage.init();
//     await setstorageSynced();
//   };
//   setNavigationProp = navigation => {
//     //for exposing navigation object of react navigation from authloading(very initial screen)
//     const {setNavigation} = this.state;
//     setNavigation(navigation);
//   };
//   getUserInfo = async () => {
//     const {setUserInfo} = this.state;
//     if (await tokenClass.loginStatus()) {
//       try {
//         const {data} = await customerClient.query({
//           query: CUSTOMER_INFO_QUERY,
//           fetchPolicy: 'network-only',
//         });
//         AnalyticsEvents('USER_INFO', 'User Info', data);
//         setUserInfo(data);
//         this.setAppReviewPopup(data.IsPopupEnable);
//       } catch (e) {
//         console.log('eeeeeeeeeee', e);
//         const msg = this.handleError(e);
//         if (msg) {
//           await tokenClass.removeToken();
//           await SyncStorage.remove('guest_cart_id');
//           await SyncStorage.remove('customer_cart_id');
//           await this.getGuestAndCustomerCartId();
//           showErrorMessage(msg);
//         }
//       }
//     } else {
//       console.warn('Customer Not Logged In');
//     }
//   };

//   getBrands = async () => {
//     const {setBrands} = this.state;
//     try {
//       const {data} = await client.query({
//         query: GET_BRANDS_QUERY,
//         fetchPolicy: 'network-only',
//       });
//       setBrands(data?.getBrand || null);
//     } catch (e) {
//       const msg = this.handleError(e);
//       if (msg) {
//         showErrorMessage(msg);
//       }
//     }
//   };
//   getWhatsAppLink = async () => {
//     const {setWhatsAppInfo} = this.state;
//     try {
//       const {data, loading, error} = await client.query({
//         query: GET_WHATSAPP_API,
//         fetchPolicy: 'network-only',
//       });
//       setWhatsAppInfo(data?.getWhatsappApi);
//     } catch (e) {
//       console.log('Error getWhatsAppLink : ', e);
//     }
//   };

//   appUpdatePopup = () => {
//     const inAppUpdates = new SpInAppUpdates(
//       false, // isDebug
//     );
//     // curVersion is optional if you don't provide it will automatically take from the app using react-native-device-info
//     inAppUpdates
//       .checkNeedsUpdate()
//       .then(result => {
//         if (result.shouldUpdate) {
//           let updateOptions = {};
//           if (Platform.OS === 'android') {
//             // android only, on iOS the user will be promped to go to your app store page
//             updateOptions = {
//               updateType: IAUUpdateKind.IMMEDIATE,
//             };
//           }
//           inAppUpdates.startUpdate(updateOptions); // https://github.com/SudoPlz/sp-react-native-in-app-updates/blob/master/src/types.ts#L78
//         }
//       })
//       .catch(e => {
//         console.error('app update Error: ', e);
//       });
//   };

//   // getGuestAndCustomerCartId = async () => {
//   //   const guest_cart_id = await SyncStorage.get('guest_cart_id');
//   //   const customer_cart_id = await SyncStorage.get('customer_cart_id');
//   //   const loginStatus = await tokenClass.loginStatus();
//   //   try {
//   //     if (!loginStatus && !guest_cart_id) {
//   //       const {data} = await client.mutate({
//   //         mutation: GET_GUEST_CART_ID,
//   //         fetchPolicy: 'no-cache',
//   //       });
//   //       if (data) {
//   //         this.getCartItemCount(0);
//   //         await SyncStorage.set('guest_cart_id', data.createEmptyCart);
//   //         setCartId(data.createEmptyCart);
//   //       }
//   //     } else if (loginStatus && !customer_cart_id) {
//   //       const {data} = await client.query({
//   //         query: GET_CUSTOMER_CART_ID,
//   //         fetchPolicy: 'network-only',
//   //       });
//   //       if (data) {
//   //         let cartCount = data.customerCart.items.length;
//   //         await SyncStorage.set('customer_cart_id', data.customerCart.id);
//   //         this.getCartItemCount(cartCount);
//   //         setCartId(data.customerCart.id);
//   //         if (guest_cart_id) {
//   //           await this.getMergeCart(guest_cart_id, data.customerCart.id);
//   //         }
//   //       }
//   //     }
//   //   } catch (e) {
//   //     console.log(e);
//   //   }
//   // };
//   getGuestAndCustomerCartId = async () => {
//     const guest_cart_id = await SyncStorage.get('guest_cart_id');
//     const customer_cart_id = await SyncStorage.get('customer_cart_id');
//     const loginStatus = await tokenClass.loginStatus();
//     console.log(
//       '2s222guest_cart_id, customer_cart_id, loginStatus, cartClient',
//       guest_cart_id,
//       customer_cart_id,
//       loginStatus,
//     );

//     try {
//       if (!loginStatus && !guest_cart_id) {
//         const {data, error} = await cartClient.mutate({
//           mutation: GET_GUEST_CART_ID,
//           fetchPolicy: 'no-cache',
//         });

//         console.log('data===0989891, error', data, error);
//         if (data) {
//           this.getCartItemCount(0);
//           await SyncStorage.set('guest_cart_id', data.createEmptyCartV2);
//           setCartId(data.createEmptyCartV2);
//         }
//       } else if (loginStatus && !customer_cart_id) {
//         const {data, error} = await cartClient.mutate({
//           mutation: GET_GUEST_CART_ID,
//         });
//         console.log('data===0989890, error', data, error);
//         if (data?.createEmptyCartV2) {
//           await SyncStorage.set('customer_cart_id', data.createEmptyCartV2);
//           if (guest_cart_id) {
//             await this.getMergeCart(guest_cart_id, data.createEmptyCartV2);
//           }
//         }
//       }
//     } catch (e) {
//       console.log('getGuestAndCustomerCartId======catch121210', e);
//     }
//   };

//   async getMergeCart(guest_cart_id, customer_cart_id) {
//     try {
//       if (guest_cart_id && customer_cart_id) {
//         const {data} = await cartClient.mutate({
//           mutation: GET_MERGE_CART,
//           variables: {
//             source_cart_id: guest_cart_id,
//             destination_cart_id: customer_cart_id,
//           },
//         });
//         console.log('data====2211211', data);
//         if (data) {
//           this.getCartItemCount(data.mergeCartsV2.items.length);
//           await SyncStorage.remove('guest_cart_id');
//         }
//       }
//     } catch (err) {
//       console.log('getMergeCart', err);
//     }
//   }

//   setInitialBaseCountry = async () => {
//     // let country = getCountry();
//     let country = false;
//     const {setAppCountry} = this.state;
//     try {
//       if (country) {
//         setAppCountry(country);
//       } else {
//         const {data} = await client.query({
//           query: BASE_COUNTRY_QUERY,
//           fetchPolicy: 'network-only',
//         });
//         let countryData = {
//           country: data.baseCountry.country,
//           country_id: data.baseCountry?.country_id,
//           currency_code: data.baseCountry.currency_code,
//         };
//         setCountry(countryData);
//         setAppCountry(countryData);
//       }
//     } catch (error) {
//       console.warn('error', error);
//     }
//   };

//   getAlgoliaKey = async () => {
//     try {
//       const {data} = await client.query({
//         query: GET_ALGOLIA_KEY,
//         fetchPolicy: 'network-only',
//       });
//       if (data && data.storeConfig) {
//         SyncStorage.set('app_id', data.storeConfig.algolia_application_id);
//         SyncStorage.set('api_key', data.storeConfig.algolia_api_key);
//       }
//     } catch (error) {
//       this.handleError(error);
//     }
//   };
//   setShippingAddress = async () => {
//     const country_id = this.state?.country?.country_id;
//     const guest_cart_id = await SyncStorage.get('guest_cart_id');
//     const customer_cart_id = await SyncStorage.get('customer_cart_id');
//     const cart_id = (await tokenClass.loginStatus())
//       ? customer_cart_id
//       : guest_cart_id;

//     const shipingInfoUrl = (await tokenClass.loginStatus())
//       ? API.checkout.set_shipping_and_billing_information
//       : API.checkout.set_shipping_information(cart_id);

//     const address_data = {
//       region: '',
//       postcode: '',
//       country_id: country_id,
//     };
//     const address_payload = {address: {...address_data}};
//     postRequest(
//       API.checkout.set_estimate_shipping_methods(cart_id),
//       address_payload,
//     )
//       .then(res => {
//         if (!res.ok) {
//           throw res;
//         }
//         return res.json();
//       })
//       .then(shipping_methods => {
//         postRequest(shipingInfoUrl, {
//           addressInformation: {
//             shipping_address: {...address_data},
//             shipping_carrier_code: shipping_methods?.[0]?.carrier_code ?? null,
//             shipping_method_code: shipping_methods?.[0]?.method_code ?? null,
//           },
//         })
//           .then(res => {
//             if (!res.ok) {
//               throw res;
//             }
//             return res.json();
//           })
//           .then(data => {
//             console.log(data);
//           })
//           .catch(error => console.log(error));
//       })
//       .catch(error => console.log('error', error));
//   };

//   getCartItemCount = async count => {
//     this.setState({cartCount: count});
//     await SyncStorage.set('cartCount', count);
//   };

//   checkPermission = async () => {
//     if (
//       Platform.OS === 'android' &&
//       parseInt(deviceInfoModule.getSystemVersion()) > 12
//     ) {
//       await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
//       );
//       enabledPushNotification();
//     }
//   };

//   async componentDidMount() {
//     initialize('jtur52pa4i', clarityConfig);
//     this.checkPermission();
//     console.log('initialised the clarity project');
//     this.appUpdatePopup();
//     await this.initSyncStorage();
//     await this.getUserInfo();
//     await this.getBrands();
//     await this.getWhatsAppLink();
//     const cart_count = await SyncStorage.get('cartCount');
//     this.state.setCartCount(cart_count);
//     await this.getGuestAndCustomerCartId();
//     this.getCartItemCount(this.state.cartCount);
//     this.getAlgoliaKey();
//     this.setInitialBaseCountry();
//     // await this.setShippingAddress();
//   }
//   closeAppReviewPopup = () => {
//     InteractionManager.runAfterInteractions(() => {
//       this.triggerAppAction('a2');
//       this.setState({appReviewPopup: false});
//     });
//   };
//   rateApp = () => {
//     InteractionManager.runAfterInteractions(() => {
//       this.triggerAppAction('a3');
//       this.setState({appReviewPopup: false});
//       openAppReview(storeUrl);
//     });
//   };
//   setDeeplinkingLoading = status => {
//     this.setState({deeplinkingLoading: status});
//   };
//   9;
//   // getLinkingConfig() {
//   //   return {
//   //     prefixes: [prefix],
//   //     config: {
//   //       screens: {
//   //         Home: '',
//   //         ProductDetails: {
//   //           path: 'waldent-micropex-apex-locator.html',
//   //           parse: {
//   //             pg_rf: pg_rf => `${pg_rf}`,
//   //           },
//   //         },
//   //       },
//   //     },
//   //   };
//   // }

//   render() {
//     const {
//       userInfo,
//       brands,
//       storageSync,
//       setUserInfo,
//       country,
//       setAppCountry,
//       appReviewPopup,
//       whatsAppInfo,
//       deeplinkingLoading,
//     } = this.state;
//     const appContextValues = {
//       handleError: this.handleError,
//       setLogout: this.setLogout,
//       deeplinkingLoading: deeplinkingLoading || false,
//       setDeeplinkingLoading: this.setDeeplinkingLoading,
//       userInfo,
//       brands,
//       getUserInfo: this.getUserInfo,
//       whatsAppInfo: whatsAppInfo,
//       getWhatsAppLink: this.getWhatsAppLink,
//       cartCount: this.state.cartCount,
//       setUserInfo,
//       getGuestAndCustomerCartId: this.getGuestAndCustomerCartId,
//       setNavigationProp: this.setNavigationProp,
//       getCartItemCount: this.getCartItemCount,
//       setShippingAddress: this.setShippingAddress,
//       client,
//       country,
//       setAppCountry,
//       urlResolver,
//     };

//     // const linking = this.getLinkingConfig();

//     const AppReviewPopup = () => {
//       return (
//         <Modal
//           animationType="fade"
//           visible={appReviewPopup}
//           onRequestClose={() => this.closeAppReviewPopup()}
//           onShow={() => {
//             this.triggerAppAction('a1');
//           }}
//           transparent={true}>
//           <View
//             style={{
//               justifyContent: 'center',
//               alignItems: 'center',
//               height: DeviceHeight,
//               width: DeviceWidth,
//             }}>
//             <View
//               style={{
//                 backgroundColor: '#000',
//                 height: DeviceHeight,
//                 width: DeviceWidth,
//                 opacity: 0.5,
//                 position: 'absolute',
//               }}
//             />
//             <View
//               style={{
//                 width: '70%',
//                 height: 140,
//                 backgroundColor: '#fff',
//                 borderRadius: 5,
//                 padding: 15,
//               }}>
//               <View style={{height: 75, width: '100%'}}>
//                 <Text
//                   allowFontScaling={false}
//                   style={{fontSize: 15, textAlign: 'center'}}>
//                   Your Play Store Review makes a big difference!
//                 </Text>
//               </View>
//               <View
//                 style={{
//                   height: 35,
//                   width: '100%',
//                   justifyContent: 'center',
//                   alignItems: 'flex-end',
//                   flexDirection: 'row',
//                 }}>
//                 <TouchableOpacity onPress={() => this.closeAppReviewPopup()}>
//                   <View
//                     style={{
//                       borderRadius: 4,
//                       borderWidth: 0.5,
//                       borderColor: '#fff',
//                       width: 100,
//                       padding: 5,
//                       alignItems: 'center',
//                     }}>
//                     <Text allowFontScaling={false}>Later</Text>
//                   </View>
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => this.rateApp()}>
//                   <View
//                     style={{
//                       borderRadius: 4,
//                       borderWidth: 0.5,
//                       borderColor: PrimaryColor,
//                       width: 100,
//                       paddingHorizontal: 5,
//                       paddingVertical: 10,
//                       alignItems: 'center',
//                       backgroundColor: PrimaryColor,
//                     }}>
//                     <Text allowFontScaling={false} style={{color: '#fff'}}>
//                       Rate Now
//                     </Text>
//                   </View>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
//         </Modal>
//       );
//     };
//     const toastConfig = {
//       error: ({text1, text2, props, ...rest}) => (
//         <BaseToast
//           {...rest}
//           style={{borderLeftColor: '#FE6301', height: '100%'}}
//           contentContainerStyle={{
//             paddingHorizontal: 15,
//             paddingVertical: 15,
//           }}
//           text2Style={{
//             fontSize: 13,
//             fontWeight: '600',
//             color: '#000',
//           }}
//           text2NumberOfLines={text2 ? Math.ceil(text2.length / 30) : 1}
//           text1={text1}
//           text2={text2}
//         />
//       ),
//       success: ({text1, text2, props, ...rest}) => (
//         <BaseToast
//           {...rest}
//           style={{borderLeftColor: '#69C779', height: '100%'}}
//           contentContainerStyle={{paddingHorizontal: 15, paddingVertical: 15}}
//           text2Style={{
//             fontSize: 13,
//             fontWeight: '600',
//             color: '#000',
//           }}
//           text2NumberOfLines={text2 ? Math.ceil(text2.length / 30) : 1}
//           text1={text1}
//           text2={text2}
//         />
//       ),
//       info: ({text1, text2, props, ...rest}) => (
//         <InfoToast
//           {...rest}
//           text2Style={{
//             fontSize: 13,
//             fontWeight: '500',
//           }}
//           text2NumberOfLines={text2 ? Math.ceil(text2.length / 30) : 1}
//           text1={text1}
//           text2={text2}
//         />
//       ),
//       my_custom_type: ({text1, props, ...rest}) => (
//         <View style={{height: 60, width: '100%', backgroundColor: 'tomato'}}>
//           <Text allowFontScaling={false}>{text1}</Text>
//         </View>
//       ),
//     };

//     return (
//       <ApolloProvider client={client}>
//         <SafeAreaView style={styles.safeAndroidArea}>
//           <DentalkartProvider value={appContextValues}>
//             {storageSync && (
//               <AppNavigator
//                 linking={this.linking}
//                 onNavigationStateChange={(prevState, newState) => {
//                   setCurrentScreenName(newState.routes[0].routeName);
//                 }}
//               />
//             )}
//             {appReviewPopup && <AppReviewPopup />}
//           </DentalkartProvider>
//           <Toast config={toastConfig} ref={ref => Toast.setRef(ref)} />
//         </SafeAreaView>
//       </ApolloProvider>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   safeAndroidArea: {
//     height: '100%',
//   },
// });

// // export default App;
// export default codePush(codePushOptions)(App);
// // export default Config.ENV === 'development'
// //   ? App
// //   : codePush(codePushOptions)(App);
