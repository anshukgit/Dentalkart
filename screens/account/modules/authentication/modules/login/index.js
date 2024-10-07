import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Pressable,
  Platform,
  Linking,
} from 'react-native';
import {NavigationActions, StackActions} from 'react-navigation';
import TouchableCustom from '@helpers/touchable_custom';
import {getCountry} from '@helpers/country';
import {SecondaryColor} from '@config/environment';
import constants from '@config/constants';
import styles from './login.style';
import {RESEND_SIGNUP_OTP_QUERY, CHECK_OTP_QUERY} from '../../graphql';
import {Otp} from '../../modules/otp';
import {client, customerClient} from '@apolloClient';
import {
  validateEmail,
  validatePassword,
  validateOTP,
  validatePhone,
} from '@helpers/validator';
import {
  usernameErrMsg,
  passwordErrMsg,
  mobileNumberErrMsg,
} from '@config/messages';
import tokenClass from '@helpers/token';
import {DentalkartContext} from '@dentalkartContext';
import SyncStorage from '@helpers/async_storage';
import {getCartId} from '@helpers/cart_id';
import GoogleLogin from '@components/googleLogin';
import AppleLogin from '@components/applelogin';
import {SOCIAL_LOGIN} from '../../graphql';
import {fireAnalyticsEvent} from '@helpers/firebase_analytics';
import {
  showErrorMessage,
  showSuccessMessage,
} from '../../../../../../helpers/show_messages';
import appleAuth from '@invertase/react-native-apple-authentication';
import GET_LOGIN_OTP from '../../graphql/mutations/loginOtp.gql';
import {SEND_OTP, VERIFY_OTP} from '../../graphql';
import VERIFY_LOGIN_OTP from '../../graphql/mutations/verfiyLoginOtp.gql';
import GENERATE_MOBILE_NUMBER_TOKEN from '../../graphql/mutations/mobileToken.gql';
import GENERATE_EMAIL_TOKEN from '../../graphql/mutations/emailToken.gql';
import {GET_ADDRESS_VALIDATION_RULES} from '../../graphql';
import TextInputComponent from '@components/TextInputComponent';
import {Icon} from 'native-base';
import Spinner from 'react-native-loading-spinner-overlay';
import AnalyticsEvents from '../../../../../../components/Analytics/AnalyticsEvents';
import CryptoJS from 'crypto-js';

export default class Login extends Component {
  static contextType = DentalkartContext;
  constructor(props) {
    super(props);
    this.state = {
      isVerifiedData: false,
      loginField: '',
      loginFieldError: '',
      password: '',
      showPassword: false,
      passwordError: '',
      otp: '',
      showOtp: false,
      isKeyboard: false,
      isOtpVerified: false,
      isPhoneLogin: false,
      shouldShow: false,
      isLoading: false,
      validationRules: null,
    };
  }

  open = link => {
    try {
      Linking.canOpenURL(link)
        .then(supported => {
          if (!supported) {
            console.log("Can't handle url: " + link);
          } else {
            // let resetAction;
            // resetAction = StackActions.reset({
            //   index: 1,
            //   actions: [
            //     NavigationActions.navigate({routeName: 'AuthLoading'}),
            //     // NavigationActions.navigate({routeName: 'OrdersList'}),
            //   ],
            // });
            // this.props.navigation.dispatch(resetAction);
            return Linking.openURL(link);
          }
        })
        .catch(err => console.log('An error occurred', err));
    } catch (error) {
      console.log('An error occurred', error);
    }
  };

  login = async () => {
    const {loginField, password} = this.state;
    const {getUserInfo, getGuestAndCustomerCartId, getWhatsAppLink} =
      this.context;
    try {
      this.setState({isLoading: true});
      let mobileVariables = {
        // mobileEmail: loginField,
        // password: password,
        // websiteId: 1,
        email_or_Mobile: loginField,
        otp_or_password: password,
        entityType: 'mobile',
        actionType: 'login_w_pass',
      };
      let emailVariables = {
        // email: loginField,
        // password: password,
        email_or_Mobile: loginField,
        otp_or_password: password,
        entityType: 'email',
        actionType: 'login_w_pass',
      };
      const {data, error} = await customerClient.mutate({
        mutation: this.state.isPhoneLogin
          ? // ? GENERATE_MOBILE_NUMBER_TOKEN
            // : GENERATE_EMAIL_TOKEN,
            VERIFY_OTP
          : VERIFY_OTP,
        variables: this.state.isPhoneLogin ? mobileVariables : emailVariables,
      });
      // const loginResponse = this.state.isPhoneLogin
      //   ? data?.login
      //   : data?.generateCustomerToken;
      if (data.verifyOTP.token) {
        const token = data.verifyOTP.token;
        await tokenClass.setToken(token);
        await getUserInfo();
        await getWhatsAppLink();
        await getGuestAndCustomerCartId();
        this.setState({isLoading: false});
        // AnalyticsEvents("LOGIN", "Login", data)
        AnalyticsEvents('LOGIN', 'User Login', {});
        return this.navigateToLastScreen();
      } else {
        this.setState({isLoading: false});
        console.warn('login message : ', data?.verifyOTP?.message);
        showErrorMessage(data?.verifyOTP?.message, 'top');
      }
    } catch (err) {
      console.log('loginERORRRRRRRRR', err);
      showErrorMessage(
        String(err).replace('[Error: GraphQL error: ').replace(']'),
        'top',
      );
      this.setState({isLoading: false});
      if (Array.isArray(err)) {
        err.map(e => {
          if (e?.errorCode && e?.errorCode === 'NC01') {
            this.setState({showOtp: true});
          }
        });
      } else if (
        String(err).includes(`"errorCode":"NC01"`) ||
        String(err).includes(`"NC01"`)
      ) {
        showErrorMessage(
          "This account isn't confirmed. Verify and try again.",
          'top',
        );
        this.setState({showOtp: true});
      } else if (String(err).includes(`Invalid login or password.`)) {
        showErrorMessage('Invalid login or password.', 'top');
      } else if (String(err).includes(`Current password is incorrect.`)) {
        showErrorMessage('Current password is incorrect.', 'top');
      } else if (
        String(err).includes(
          `This email ID is not registered with us, Kindly sign up first.`,
        )
      ) {
        showErrorMessage(
          'This email ID is not registered with us, Kindly sign up first.',
          'top',
        );
      }
    }
  };
  navigateToLastScreen = async key => {
    const {navigate, state, push} = this.props.navigation;
    let lastScreen = state?.params?.screen;
    if (key === 'later') {
      await SyncStorage.set('firstTime', 'installed ha ha ha!');
      return navigate('Home');
    }
    try {
      // lastScreen = lastScreen === 'UrlResolver' ? 'Home' : lastScreen;
      let params = state.params?.params ?? {};
      return navigate(lastScreen ? lastScreen : 'Home', params);
    } catch (e) {
      return navigate('Home');
    }
  };

  confirmOtp = async () => {
    const {loginField, otp} = this.state;
    const {handleError} = this.context;
    try {
      this.setState({isLoading: true});
      const {data, error} = await client.mutate({
        mutation: CHECK_OTP_QUERY,
        variables: {email: loginField, otp: otp},
      });
      showSuccessMessage('OTP Verified!', 'top');
      this.login();
      this.setState({isLoading: false});
    } catch (error) {
      const msg = handleError(typeof error === 'object' ? {...error} : error);
      this.setState({isLoading: false});
      showErrorMessage(msg?.message, 'top');
      console.log(error);
    }
  };

  getRules = async () => {
    const {handleError} = this.context;
    const country = await getCountry();
    console.log('country===32w223', country);
    try {
      this.setState({isLoading: true});
      const {data} = await client.query({
        query: GET_ADDRESS_VALIDATION_RULES,
        variables: {countryId: country?.country_id || 'IN'},
      });
      this.setState({isLoading: false});
      this.setState({validationRules: data.getValidationRules});
    } catch (err) {
      this.setState({isLoading: false});
    }
  };

  resendSignUpOtp = async () => {
    const {handleError} = this.context;
    const {loginField, otp} = this.state;
    try {
      this.setState({isLoading: true});
      const {data} = await client.mutate({
        mutation: RESEND_SIGNUP_OTP_QUERY,
        variables: {email: loginField},
      });
      showErrorMessage('Please check your email for OTP.', 'top');
      this.setState({isLoading: false});
    } catch (err) {
      const msg = handleError(err);
      this.setState({isLoading: false});
      showErrorMessage(msg, 'top');
      console.log(err);
    }
  };
  handleLoginErrors = error => {
    const {handleError} = this.context;
    const msg = handleError(error);
    try {
      const errorJSON = JSON.parse(msg);
      if (errorJSON.errorCode) {
        this.resendSignUpOtp();
        this.setState({showOtp: true});
      }
    } catch (e) {
      showErrorMessage(msg, 'top');
    }
  };
  async validate(type, data) {
    if (type == 'loginField') {
      if (data !== '') {
        let dataType = parseInt(data);
        if (dataType != data) {
          !validateEmail(data)
            ? this.setState({[`${type}Error`]: usernameErrMsg})
            : this.setState({
                loginFieldError: '',
                isEmailLogin: true,
                isPhoneLogin: false,
                loginType: 'email',
              });
        } else {
          !validatePhone(data)
            ? this.setState({[`${type}Error`]: mobileNumberErrMsg})
            : this.setState({
                loginFieldError: '',
                isPhoneLogin: true,
                loginType: 'mobile',
              });
        }
      }
      await this.setState({loginField: data});
    } else if (type == 'password') {
      await this.setState({password: data});
      !validatePassword(data)
        ? this.setState({[`${type}Error`]: passwordErrMsg})
        : this.setState({passwordError: ''});
    } else if (type == 'otp') {
      await this.setState({otp: data});
      !validateOTP(data)
        ? this.setState({isOtpVerified: false})
        : this.setState({isOtpVerified: true});
    }
    if (
      this.state.loginField &&
      this.state.password &&
      !this.state.loginFieldError &&
      !this.state.passwordError
    ) {
      this.setState({isVerifiedData: true});
    } else {
      this.setState({isVerifiedData: false});
    }
  }
  _next() {
    this._passwordInput && this._passwordInput.focus();
  }
  googleLogin = async data => {
    const variables = {
      type: 'google',
      token: data.idToken,
      // quoteId: await getCartId(),
    };
    try {
      this.setState({isLoading: true});
      const {data} = await customerClient
        .mutate({
          mutation: SOCIAL_LOGIN,
          variables: variables,
        })
        .catch(error => {
          console.log('erroraayahai', error);
          this.setState({isLoading: false});
          //globalObject.handleError(error);
        });
      console.log('nicheGoogleWalaData', data);
      // if (data && data.dkgenerateSocialLoginCustomerToken.token) {
      //   await tokenClass.setToken(
      //     data.dkgenerateSocialLoginCustomerToken.token,
      //   );
      //   await this.context.getUserInfo();
      //   await this.context.getGuestAndCustomerCartId();
      //   this.setState({isLoading: false});
      //   // AnalyticsEvents("LOGIN", "Login", data)
      //   AnalyticsEvents('LOGIN', 'User Login', {});
      //   AnalyticsEvents('SOCIAL_LOGIN', 'Social Action', {type: 'Google'});
      //   this.navigateToLastScreen();
      // }
      if (data && data.socialLogin.token) {
        await tokenClass.setToken(data.socialLogin.token);
        await this.context.getUserInfo();
        await this.context.getGuestAndCustomerCartId();
        this.setState({isLoading: false});
        // AnalyticsEvents("LOGIN", "Login", data)
        AnalyticsEvents('LOGIN', 'User Login', {});
        AnalyticsEvents('SOCIAL_LOGIN', 'Social Action', {type: 'Google'});
        this.navigateToLastScreen();
      }
    } catch (error) {
      console.log('yhdatakaErrorhaiLoginwala', error);
      this.setState({isLoading: false});
      // globalObject.handleError(error);
    }
  };
  appleLogin = async data => {
    const variables = {
      type: 'applelogin',
      token: data.idToken,
      quoteId: await getCartId(),
    };
    try {
      this.setState({isLoading: true});
      const {data} = await client
        .mutate({
          mutation: SOCIAL_LOGIN,
          variables: variables,
        })
        .catch(error => {
          this.setState({isLoading: false});
          showErrorMessage(error.message, 'top');
        });
      if (data && data.dkgenerateSocialLoginCustomerToken.token) {
        await tokenClass.setToken(
          data.dkgenerateSocialLoginCustomerToken.token,
        );
        await this.context.getUserInfo();
        await this.context.getGuestAndCustomerCartId();
        this.setState({isLoading: false});
        // AnalyticsEvents("LOGIN", "Login", data)
        AnalyticsEvents('LOGIN', 'User Login', {});
        AnalyticsEvents('SOCIAL_LOGIN', 'Social Action', {type: 'Apple'});
        this.navigateToLastScreen();
      }
    } catch (error) {
      this.setState({isLoading: false});
      // globalObject.handleError(error);
    }
  };
  triggerScreenEvent = _ => {
    fireAnalyticsEvent({
      eventname: 'screenname',
      screenName: 'Login',
      userId: '',
    });
  };
  componentDidMount() {
    this.triggerScreenEvent();
    this.getRules();
  }

  encryption = () => {
    const getTwoHalf = input => {
      const midpoint = Math.floor(input.length / 2);
      const firstHalf = input.substr(0, midpoint);
      const secondHalf = input.substr(midpoint);
      return {firstHalf, secondHalf};
    };

    const secret_key = '2b7e151628aed2a6abf7168809cf2f3c';
    let inputType =
      this.state.loginType === 'mobile'
        ? this.state.loginField.toString()
        : this.state.loginField;
    const {firstHalf, secondHalf} = getTwoHalf(inputType);
    const stringToBeEncrypted = firstHalf + secret_key + secondHalf;
    const key = CryptoJS.enc.Hex.parse(secret_key); // 128-bit key
    const encrypted = CryptoJS.AES.encrypt(stringToBeEncrypted, key, {
      mode: CryptoJS.mode.ECB,
    });
    return encrypted;
  };

  phoneLogin = async () => {
    if (this.state.isPhoneLogin || this.state.isEmailLogin) {
      const encrypted = this.encryption();
      try {
        this.setState({isLoading: true});
        const {data} = await customerClient.mutate({
          // mutation: GET_LOGIN_OTP,
          // variables: {mobileNumber: this.state.loginField, websiteId: 1},
          mutation: SEND_OTP,
          variables: {
            email_or_Mobile: this.state.loginField,
            // entityType: 'mobile',
            entityType: this.state.loginType,
            actionType: 'login',
          },
          context: {
            headers: {
              ETag: encrypted,
            },
          },
        });
        // if (data) {
        //   if (data.loginOTP.status) {
        //     this.setState({showOtp: true, shouldShow: true});
        //   } else {
        //     showErrorMessage(data.loginOTP.message, 'top');
        //   }
        //   this.setState({isLoading: false});
        // }
        if (data) {
          if (data.sendOTP.message) {
            showSuccessMessage(data.sendOTP.message, 'top');
            this.setState({showOtp: true, shouldShow: true});
          } else {
            showErrorMessage(data.sendOTP.message, 'top');
          }
          this.setState({isLoading: false});
        }
      } catch (error) {
        console.log('LoginOTPPPPPPPPPPPPPPP', error);
        // showErrorMessage(error.message, 'top');
        showErrorMessage(
          String(error).replace('[Error: GraphQL error: ').replace(']'),
          'top',
        );
        this.setState({isLoading: false});
      }
    } else {
      showErrorMessage('Please enter mobile / email', 'top');
      this.setState({isLoading: false});
    }
  };

  phoneLoginResendOTP = async () => {
    const encrypted = this.encryption();
    try {
      this.setState({isLoading: true});
      const {data} = await customerClient.mutate({
        mutation: SEND_OTP,
        // variables: {mobileNumber: this.state.loginField, websiteId: 1},
        variables: {
          email_or_Mobile: this.state.loginField,
          // entityType: 'mobile',
          entityType: this.state.loginType,
          actionType: 'login',
        },
        context: {
          headers: {
            ETag: encrypted,
          },
        },
      });
      // if (data) {
      //   if (data.loginOTP.status) {
      //     this.setState({shouldShow: true});
      //   } else {
      //     showErrorMessage(data.loginOTP.message, 'top');
      //   }
      //   this.setState({isLoading: false});
      // }
      if (data) {
        if (data.sendOTP.message) {
          this.setState({shouldShow: true});
        } else {
          showErrorMessage(data.sendOTP.message, 'top');
        }
        this.setState({isLoading: false});
      }
    } catch (error) {
      this.setState({isLoading: false});
      // showErrorMessage(error.message, 'top');
      showErrorMessage(
        String(error).replace('[Error: GraphQL error: ').replace(']'),
        'top',
      );
    }
  };

  completeOTPTimer = async () => {
    this.setState({shouldShow: false});
  };

  phoneLoginConfirmOTP = async () => {
    const {loginField, otp} = this.state;
    const {handleError} = this.context;
    try {
      this.setState({isLoading: true});
      const {data} = await customerClient.mutate({
        // mutation: VERIFY_LOGIN_OTP,
        // variables: {mobileNumber: loginField, otp: otp, websiteId: 1},
        mutation: VERIFY_OTP,
        variables: {
          email_or_Mobile: loginField,
          otp_or_password: otp,
          // entityType: 'mobile',
          entityType: this.state.loginType,
          actionType: 'login_w_otp',
        },
      });
      // if (data) {
      //   if (data.loginOTPVerify.status) {
      //     const {getUserInfo, getGuestAndCustomerCartId, getWhatsAppLink} =
      //       this.context;
      //     const token = data.loginOTPVerify.token;
      //     await tokenClass.setToken(token);
      //     await getUserInfo();
      //     await getWhatsAppLink();
      //     await getGuestAndCustomerCartId();

      //     this.setState({isLoading: false});
      //     this.navigateToLastScreen();
      //   } else {
      //     this.setState({isLoading: false});
      //     showErrorMessage(data.loginOTPVerify.message, 'top');
      //   }
      // }
      if (data) {
        if (data.verifyOTP.token) {
          const {getUserInfo, getGuestAndCustomerCartId, getWhatsAppLink} =
            this.context;
          const token = data.verifyOTP.token;
          await tokenClass.setToken(token);
          await getUserInfo();
          await getWhatsAppLink();
          await getGuestAndCustomerCartId();

          this.setState({isLoading: false});
          this.navigateToLastScreen();
        } else {
          this.setState({isLoading: false});
          showErrorMessage(data.loginOTPVerify.message, 'top');
        }
      }
    } catch (err) {
      console.log('verifyOTPLOGINERORRRRR', err);
      this.setState({isLoading: false});
      // const msg = handleError(err);
      // showErrorMessage(msg, 'top');
      showErrorMessage(
        String(err).replace('[Error: GraphQL error: ').replace(']'),
        'top',
      );
    }
  };

  render() {
    const {
      loginField,
      password,
      showPassword,
      loginFieldError,
      passwordError,
      isVerifiedData,
      showOtp,
      otp,
    } = this.state;
    const {navigation} = this.props;
    const {deeplinkingLoading} = this.context;
    const activeGuestCart = navigation.getParam('activeGuestCart', false);
    return (
      <View style={styles.loginPageContainer}>
        <Spinner
          visible={this.state.isLoading || deeplinkingLoading}
          // textContent={''}
          // textStyle={{ color: colors.White }}
          indicatorStyle={{activeOpacity: 1}}
        />
        <View style={{flex: 1}}>
          {!showOtp ? (
            <ScrollView
              contentContainerStyle={[
                styles.loginScreenWrapper,
                this.state.isKeyboard ? {justifyContent: 'flex-start'} : null,
              ]}
              keyboardDismissMode="interactive"
              keyboardShouldPersistTaps="handled">
              <View style={{width: '100%', position: 'absolute', bottom: 0}}>
                <Image
                  source={require('../../../../../../assets/loginbg.png')}
                  style={{width: '100%'}}
                  resizeMode={'contain'}
                />
              </View>
              <View style={styles.logoMinView}>
                <Image
                  source={require('../../../../../../assets/logo.png')}
                  style={{width: '50%'}}
                  resizeMode={'contain'}
                />
                <Text
                  allowFontScaling={false}
                  style={{fontSize: 20, color: colors.blueColor}}>
                  Welcome to Dentalkart
                </Text>
              </View>

              <View style={styles.midView}>
                {console.warn('error : ', loginFieldError)}
                <View
                  style={[
                    styles.emailTextInputView,
                    {
                      borderColor: loginFieldError
                        ? colors.red
                        : colors.borderColor,
                    },
                  ]}>
                  <Icon name="email" type="Fontisto" style={styles.emailIcon} />
                  <TextInputComponent
                    placeholder="Enter Email / Mobile Number"
                    placeholderTextColor={SecondaryColor}
                    onChangeText={loginField => {
                      console.warn('login field: ', loginField);
                      loginField = loginField.replace(/\s/g, '');
                      this.validate('loginField', loginField);
                    }}
                    value={loginField}
                    autoCapitalize="none"
                    style={{}}
                    onSubmitEditing={() => {
                      this.emailInput.focus();
                    }}
                    // error={loginFieldError}
                    returnKeyType="next"
                    blurOnSubmit={false}
                    autoFocus={true}
                    keyboardType="email-address"
                  />
                </View>
                {isVerifiedData && this.state.email == '' ? (
                  <View
                    style={{marginBottom: responsiveHeight(-1), width: '90%'}}>
                    <Text
                      allowFontScaling={false}
                      style={[styles.textError, {fontFamily: fonts.LatoBold}]}>
                      Enter Email.
                    </Text>
                  </View>
                ) : null}
                <View
                  style={[
                    styles.emailTextInputView,
                    {
                      borderColor: passwordError
                        ? colors.red
                        : colors.borderColor,
                      marginTop: 12,
                    },
                  ]}>
                  <Icon
                    name="lock"
                    type="SimpleLineIcons"
                    style={styles.emailIcon}
                  />
                  <TextInputComponent
                    placeholder="Password"
                    placeholderTextColor={SecondaryColor}
                    onChangeText={password => {
                      password = password.replace(/\s/g, '');
                      this.validate('password', password);
                    }}
                    value={password}
                    autoCapitalize="none"
                    returnKeyType="done"
                    id={input => {
                      this.emailInput = input;
                    }}
                    secureTextEntry={!showPassword}
                  />

                  <TouchableOpacity
                    onPress={() =>
                      this.setState({
                        showPassword: !this.state.showPassword,
                      })
                    }
                    style={styles.eyeIcon}>
                    <Icon
                      name={this.state.showPassword ? 'eye-off' : 'eye'}
                      color={this.state.password ? SecondaryColor : '#ddd'}
                      style={{fontSize: 22, color: colors.blueColor}}
                      type="MaterialCommunityIcons"
                    />
                  </TouchableOpacity>
                </View>

                <Pressable
                  style={[
                    styles.phoneNumberView,
                    {marginBottom: this.state.isLogin ? -8 : null},
                  ]}
                  onPress={this.phoneLogin}>
                  <Text allowFontScaling={false} style={{}}>
                    <Text allowFontScaling={false} style={{color: colors.text}}>
                      Or login with{' '}
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={{color: colors.normalText}}>
                      {' '}
                      Mobile / Email OTP.
                    </Text>
                  </Text>
                </Pressable>

                <TouchableCustom
                  underlayColor={'#ffffff10'}
                  onPress={() => (isVerifiedData ? this.login() : null)}>
                  <View
                    style={
                      isVerifiedData ? styles.loginBtn : styles.loginBtnDisabled
                    }>
                    <Text
                      allowFontScaling={false}
                      style={styles.signInButtonText}>
                      Sign In
                    </Text>
                  </View>
                </TouchableCustom>
              </View>

              <View style={styles.footerView}>
                <Text
                  allowFontScaling={false}
                  style={{color: '#9098B1', fontSize: 14, marginVertical: 15}}>
                  OR
                </Text>
                {Platform.OS == 'android' ? (
                  <View
                    style={{
                      top: -13,
                      width: '100%',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <GoogleLogin getUserData={this.googleLogin} />
                    {appleAuth.isSupported ? (
                      <AppleLogin getUserData={this.appleLogin} />
                    ) : null}
                  </View>
                ) : null}

                <Pressable
                  style={{marginTop: -5}}
                  onPress={() =>
                    this.props.navigation.navigate('ForgotPassword')
                  }>
                  <Text
                    allowFontScaling={false}
                    style={{color: colors.normalText, fontSize: 12}}>
                    Forgot Password?
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() =>
                    this.props.navigation.navigate(
                      'SignUp',
                      this.props?.navigation?.state?.params,
                    )
                  }
                  style={{marginTop: 8}}>
                  <Text allowFontScaling={false} style={{fontSize: 12}}>
                    <Text allowFontScaling={false} style={{color: colors.text}}>
                      Don't have an account?
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={{color: colors.normalText}}>
                      {' '}
                      Register
                    </Text>
                  </Text>
                </Pressable>
                {!activeGuestCart && (
                  <TouchableOpacity
                    style={styles.OtherFormNavigatorWrapper}
                    onPress={() => this.navigateToLastScreen('later')}>
                    <Text
                      allowFontScaling={false}
                      style={styles.OtherFormNavigatorText}>
                      I'll Login Later
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          ) : this.state.isPhoneLogin || this.state.isEmailLogin ? (
            <Otp
              _this={this}
              resendOtp={this.phoneLoginResendOTP}
              shouldShow={this.state.shouldShow}
              completeOTPTimer={this.completeOTPTimer}
              confirmOtp={this.phoneLoginConfirmOTP}
            />
          ) : (
            <Otp
              _this={this}
              resendOtp={this.resendSignUpOtp}
              confirmOtp={this.confirmOtp}
            />
          )}
        </View>
      </View>
    );
  }
}
