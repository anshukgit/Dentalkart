import React, {Fragment, Component} from 'react';
import WebView from 'react-native-webview';
import Header from '@components/header';
import {DentalkartContext} from '@dentalkartContext';
import {NavigationActions, StackActions} from 'react-navigation';
import {BackHandler, StyleSheet, View, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export class WebViewScreen extends Component {
  static contextType = DentalkartContext;
  _didFocusSubscription;
  _willBlurSubscription;
  constructor(props) {
    super(props);
    this._didFocusSubscription = props.navigation.addListener(
      'didFocus',
      payload =>
        BackHandler.addEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        ),
    );
  }
  navigate(url) {
    const {push, navigate} = this.props.navigation;
    const route = url.replace(/.*?:\/\//g, '');
    const id = route.match(/\/([^\/]+)\/?$/)?.[1];
    const routeName = route.split('/')[1];
    if (routeName === 'cart') {
      let resetAction;
      resetAction = StackActions.reset({
        index: 1,
        actions: [
          NavigationActions.navigate({routeName: 'Home'}),
          NavigationActions.navigate({
            routeName: 'Cart',
            params: {lastScreen: 'wv'},
          }),
        ],
      });
      this.props.navigation.dispatch(resetAction);
    } else if (routeName === 'orderSuccess') {
      let resetAction;
      resetAction = StackActions.reset({
        index: 1,
        actions: [
          NavigationActions.navigate({routeName: 'Home'}),
          NavigationActions.navigate({routeName: 'OrderSuccess', params: {id}}),
        ],
      });
      this.props.navigation.dispatch(resetAction);
    } else {
      return false;
    }
  }
  openExternalLink = req => {
    const isHTTPS = req.url.search('https://') !== -1;
    if (isHTTPS) {
      return true;
    } else {
      if (req.url.startsWith('dentalkart://')) {
        this.context.getUserInfo();
        this.navigate(req.url);
      }
      return false;
    }
  };
  componentDidMount() {
    this._willBlurSubscription = this.props.navigation.addListener(
      'willBlur',
      payload =>
        BackHandler.removeEventListener(
          'hardwareBackPress',
          this.onBackButtonPressAndroid,
        ),
    );
  }
  onBackButtonPressAndroid = () => {
    console.log('in');
    this.props.navigation.navigate({
      routeName: 'Home',
      param: {lastScreen: 'vw'},
    });
    // let resetAction;
    // resetAction = StackActions.reset({
    //     index: 1,
    //     actions: [
    //         NavigationActions.navigate({ routeName: 'Home' }),
    //         NavigationActions.navigate({ routeName: 'Cart', params: {lastScreen: 'wv'} }),
    //         NavigationActions.navigate({ routeName: 'Payment'})
    //     ]
    // });
    // Alert.alert(
    //     'Payment',
    //     'Are you sure to cance payment',
    //     [
    //         {
    //             text: 'Cancel',
    //             onPress: () => console.log('Cancel Pressed'),
    //             style: 'cancel',
    //         },
    //         {text: 'OK', onPress: () => {
    //             let resetAction;
    //             resetAction = StackActions.reset({
    //                 index: 1,
    //                 actions: [
    //                     NavigationActions.navigate({ routeName: 'Home' }),
    //                     NavigationActions.navigate({ routeName: 'Cart', params: {lastScreen: 'wv'} })
    //                 ]
    //             });
    //             this.props.navigation.dispatch(resetAction);
    //         }},
    //     ],
    //     {cancelable: false},
    // );
    // this._didFocusSubscription && this._didFocusSubscription.remove();
    // this._willBlurSubscription && this._willBlurSubscription.remove();
    // this.props.navigation.dispatch(resetAction);
    return true;
    // this.props.navigation.dispatch(resetAction);
    // if (this.isSelectionModeEnabled()) {
    //     this.disableSelectionMode();
    //
    // } else {
    //   return false;
    // }
  };
  componentWillUnmount() {
    this._didFocusSubscription && this._didFocusSubscription.remove();
    this._willBlurSubscription && this._willBlurSubscription.remove();
  }
  resetNavigation = () => {
    let resetAction;
    resetAction = StackActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({routeName: 'Home'}),
        NavigationActions.navigate({
          routeName: 'Cart',
          params: {lastScreen: 'wv'},
        }),
      ],
    });
    this.props.navigation.dispatch(resetAction);
  };
  render() {
    const url = this.props.navigation.state.params?.url ?? '';
    return (
      <Fragment>
        {/* <Header
                    back
                    heading="Payment"
                    navigation={this.props.navigation}
                    backCoustomMethod={this.resetNavigation}
                /> */}
        <View style={styles.container}>
          <TouchableOpacity
            onPress={() => this.props.navigation.pop()}
            style={styles.header}>
            <Icon name="ios-close-circle-outline" size={25} />
          </TouchableOpacity>
        </View>
        <WebView
          source={{uri: url}}
          startInLoadingState
          scalesPageToFit
          javaScriptEnabled
          originWhitelist={['https://*']}
          mixedContentMode="always"
          scrollEnabled
          style={{flex: 1}}
          onError={syntheticEvent => {
            const {nativeEvent} = syntheticEvent;
            console.warn('WebView error: ', nativeEvent);
          }}
          onShouldStartLoadWithRequest={this.openExternalLink}
        />
      </Fragment>
    );
  }
}

export default WebViewScreen;

const styles = StyleSheet.create({
  container: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: '#ffffff',
  },
  header: {flex: 0.2, justifyContent: 'center', alignItems: 'center'},
});
