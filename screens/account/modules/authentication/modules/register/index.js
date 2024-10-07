import React, {Component} from 'react';
import {
  Text,
  View,
  Image,
  ToastAndroid,
  ScrollView,
  Platform,
  TouchableOpacity,
  KeyboardAvoidingView,
} from 'react-native';
import {TextField} from 'react-native-material-textfield';
import {SecondaryColor} from '@config/environment';
import {Query} from 'react-apollo';
import {
  CHECK_NEW_EMAIL_QUERY,
  CREATE_NEW_USER,
  VERIFY_OTP,
  RESEND_SIGNUP_OTP_QUERY,
  LOGIN_QUERY,
  SEND_OTP,
} from '../../graphql';
import TouchableCustom from '@helpers/touchable_custom';
import styles from './register.style';
import {client, customerClient} from '@apolloClient';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Icon} from 'native-base';
import {
  validateEmail,
  validatePassword,
  validateName,
  validateOTP,
  validatePhone,
} from '@helpers/validator';
import {Otp} from '../../modules/otp';
import tokenClass from '@helpers/token';
import {getCartId} from '@helpers/cart_id';
import {DentalkartContext} from '@dentalkartContext';
import AsyncStorage from '@react-native-community/async-storage';
import {
  usernameErrMsg,
  passwordErrMsg,
  otpSentMsg,
  emailExistenceErrMsg,
  unconfirmedEmailMsg,
  incorrectCredentialMsg,
  emailExistMsg,
  firstNameErrMsg,
  lastNameErrMsg,
  mobileNumberErrMsg,
} from '@config/messages';
import {fireAnalyticsEvent} from '@helpers/firebase_analytics';
import {
  showErrorMessage,
  showSuccessMessage,
} from '../../../../../../helpers/show_messages';
import {SafeAreaView} from 'react-native';
import CREATE_ACCOUNT_OTP from '../../graphql/mutations/createAccountOtp.gql';
import VERIFY_CREATE_ACCOUNT_OTP from '../../graphql/mutations/verifyCreateAccount.gql';
import CREATE_NEW_MOBILE_USER from '../../graphql/mutations/createMobileNewUser.gql';
import TextInputComponent from '@components/TextInputComponent';
import Spinner from 'react-native-loading-spinner-overlay';
import AnalyticsEvents from '../../../../../../components/Analytics/AnalyticsEvents';
import CryptoJS from 'crypto-js';

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginField: '',
      phoneField: '',
      loginFieldError: '',
      phoneFieldError: '',
      isVerifiedData: false,
      isEmailVerified: false,
      firstname: '',
      firstnameError: '',
      lastname: '',
      lastnameError: '',
      password: '',
      passwordError: '',
      hidePassword: true,
      otp: '',
      showOtp: false,
      shouldShow: false,
      showOTPTimer: false,
      isPhoneVerified: false,
      isLoading: false,
      referralText: '',
    };
    this._inputs = {};
  }
  static contextType = DentalkartContext;
  static navigationOptions = {
    title: 'Sign Up',
  };
  async validate(type, data) {
    if (type == 'loginField') {
      await this.setState({loginField: data});
      if (!this.state.isPhoneVerified) {
        !validateEmail(data)
          ? this.setState({[`${type}Error`]: usernameErrMsg})
          : this.setState({loginFieldError: ''});
      }
    } else if (type == 'phoneField') {
      await this.setState({phoneField: data});
      !validatePhone(data)
        ? this.setState({[`${type}Error`]: mobileNumberErrMsg})
        : this.setState({phoneFieldError: ''});
    } else if (type == 'firstname') {
      await this.setState({firstname: data});
      !validateName(data)
        ? this.setState({[`${type}Error`]: firstNameErrMsg})
        : this.setState({firstnameError: ''});
    } else if (type == 'lastname') {
      await this.setState({lastname: data});
      !validateName(data)
        ? this.setState({[`${type}Error`]: lastNameErrMsg})
        : this.setState({lastnameError: ''});
    } else if (type == 'password') {
      await this.setState({password: data});
      !validatePassword(data)
        ? this.setState({passwordError: 'Password must be of 6 characters.'})
        : this.setState({passwordError: ''});
    } else if (type == 'otp') {
      await this.setState({otp: data});
      !validateOTP(data)
        ? this.setState({isOtpVerified: false})
        : this.setState({isOtpVerified: true});
    }
    if (this.state.loginField && !this.state.loginFieldError) {
      this.setState({isVerifiedData: true});
    } else {
      this.setState({isVerifiedData: false});
    }
  }
  // emailVerify = async () => {
  //   const {loginField, loginFieldError} = this.state;
  //   const {handleError} = this.context;
  //   if (loginField && !loginFieldError) {
  //     try {
  //       this.setState({isLoading: true});
  //       const {data} = await client.query({
  //         query: CHECK_NEW_EMAIL_QUERY,
  //         variables: {email: loginField},
  //         fetchPolicy: 'network-only',
  //       });
  //       if (!data.checkCustomerEmail.is_exist) {
  //         // this.setState({
  //         //   isEmailVerified: true,
  //         // });
  //         this.resendSignUpOtp();
  //       } else {
  //         data.checkCustomerEmail.message
  //           ? showErrorMessage(data.checkCustomerEmail.message, 'top')
  //           : showErrorMessage(emailExistMsg, 'top');
  //       }
  //       this.setState({isLoading: false});
  //     } catch (error) {
  //       const msg = handleError(typeof error === 'object' ? {...error} : error);
  //       this.setState({isLoading: false});
  //       showErrorMessage(msg?.message, 'top');
  //     }
  //   }
  // };

  encryption = value => {
    let toStringValue = String(value);
    console.log('type=====of===', typeof toStringValue);
    console.log('value=====', toStringValue);
    const getTwoHalf = input => {
      const midpoint = Math.floor(input.length / 2);
      const firstHalf = input.substr(0, midpoint);
      const secondHalf = input.substr(midpoint);
      return {firstHalf, secondHalf};
    };

    const secret_key = '2b7e151628aed2a6abf7168809cf2f3c';
    let inputType = toStringValue;
    const {firstHalf, secondHalf} = getTwoHalf(inputType);
    const stringToBeEncrypted = firstHalf + secret_key + secondHalf;
    const key = CryptoJS.enc.Hex.parse(secret_key); // 128-bit key
    const encrypted = CryptoJS.AES.encrypt(stringToBeEncrypted, key, {
      mode: CryptoJS.mode.ECB,
    });
    return encrypted;
  };

  resendSignUpOtp = async () => {
    const {handleError} = this.context;
    const {loginField, otp} = this.state;
    const encrypted = this.encryption(loginField);
    try {
      this.setState({isLoading: true});
      const {data} = await customerClient.mutate({
        mutation: SEND_OTP,
        variables: {
          email_or_Mobile: loginField,
          entityType: 'email',
          actionType: 'signup',
        },
        context: {
          headers: {
            ETag: encrypted,
          },
        },
      });
      if (data.sendOTP.message) {
        showSuccessMessage(data.sendOTP.message, 'top');
      } else {
        data.resendSignupOtp.message
          ? showErrorMessage(data.resendSignupOtp.message, 'top')
          : showSuccessMessage(otpSentMsg, 'top');
      }
      this.setState({showOtp: true, showOTPTimer: true});
      this.setState({isLoading: false});
    } catch (error) {
      console.log('EROROTPppppppppppp---!', error);
      // const msg = handleError(typeof error === 'object' ? {...error} : error);
      // console.log('messsssssssssss', msg);
      this.setState({isLoading: false});
      showErrorMessage(
        String(error).replace('[Error: GraphQL error: ').replace(']'),
        'top',
      );
    }
  };
  newUserData = async () => {
    const {loginField, firstname, lastname, password, referralText} =
      this.state;
    console.log('LoLLLLLLLLLLLLl', loginField, firstname, lastname, password);
    // const {handleError} = this.context;
    const {
      getUserInfo,
      handleError,
      getGuestAndCustomerCartId,
      getWhatsAppLink,
    } = this.context;
    try {
      this.setState({isLoading: true});
      const {data, error} = await customerClient.mutate({
        mutation: CREATE_NEW_USER,
        variables: {
          email: loginField,
          firstname: firstname,
          lastname: lastname,
          password: password,
          referralCode: referralText,
        },
      });
      // this.resendSignUpOtp();
      // this.setState({showOtp: true});
      if (data.createCustomerV2.token) {
        const token = data.createCustomerV2.token;
        await tokenClass.setToken(token);
        await getUserInfo();
        await getWhatsAppLink();
        await getGuestAndCustomerCartId();
        this.setState({isLoading: false});
        showSuccessMessage('Registration Successful', 'top');
        return this.navigateToLastScreen();
      }
      this.setState({isLoading: false});
    } catch (err) {
      console.log('rrrrrrrrrrrrrrr-------------', err);
      // const msg = handleError(typeof error === 'object' ? {...error} : error);
      this.setState({isLoading: false});
      // showErrorMessage(msg?.message, 'top');
      showErrorMessage(
        String(err).replace('[Error: GraphQL error: ').replace(']'),
        'top',
      );
    }
  };
  confirmOtp = async () => {
    const {loginField, firstname, lastname, password, otp} = this.state;
    const {handleError} = this.context;
    try {
      this.setState({isLoading: true});
      const {data, error} = await customerClient.mutate({
        mutation: VERIFY_OTP,
        variables: {
          email_or_Mobile: loginField,
          otp_or_password: otp,
          entityType: 'email',
          actionType: 'signup_w_otp',
        },
      });
      showSuccessMessage(data.verifyOTP.message, 'top');
      this.setState({showOtp: false});
      this.setState({
        isEmailVerified: true,
      });
      AnalyticsEvents('SIGNUP', 'signup', {
        firstname: firstname,
        lastname: lastname,
        email: loginField,
      });

      // this.login();
      this.setState({isLoading: false});
    } catch (error) {
      console.log('verifyErorrr!!', error);
      this.setState({isLoading: false});

      if (typeof error === 'object') {
        let errorMsg = '';
        Object.keys(error).map(key => {
          const err = String(error[key]).split(':');
          if (err[0] === 'GraphQL error') {
            errorMsg = err[1];
          }
        });
        if (errorMsg) {
          showErrorMessage(errorMsg, 'top');
        }
      }
    }
  };

  navigateToLastScreen = async key => {
    const {navigate, state, push} = this.props.navigation;
    let lastScreen = state?.params?.screen;
    try {
      let params = state.params?.params ?? {};
      return navigate(
        lastScreen && lastScreen !== 'undefined' ? lastScreen : 'Home',
        params,
      );
    } catch (e) {
      return navigate('Home');
    }
  };

  login = async () => {
    const {loginField, password} = this.state;
    const {
      getUserInfo,
      handleError,
      getGuestAndCustomerCartId,
      getWhatsAppLink,
    } = this.context;
    try {
      this.setState({isLoading: true});
      const {data} = await client.mutate({
        mutation: LOGIN_QUERY,
        variables: {username: loginField, password: password},
      });
      if (data.generateCustomerToken.token) {
        const token = data.generateCustomerToken.token;
        await tokenClass.setToken(token);
        await getUserInfo();
        await getWhatsAppLink();
        await getGuestAndCustomerCartId();
        this.setState({isLoading: false});
        return this.navigateToLastScreen();
      }
    } catch (err) {
      const msg = handleError(typeof error === 'object' ? {...error} : error);
      this.setState({isLoading: false});
      showErrorMessage(msg?.message, 'top');
      console.warn(err);
    }
  };

  _next(field) {
    this._inputs[field] && this._inputs[field].focus();
  }
  triggerScreenEvent = _ => {
    fireAnalyticsEvent({
      eventname: 'screenname',
      screenName: 'Register',
      userId: '',
    });
  };
  componentDidMount() {
    this.triggerScreenEvent();
  }
  otpScreeen = () => {
    this.setState({showOtp: true});
  };
  createMobileRegisterOTP = async () => {
    const encrypted = this.encryption(this.state.phoneField);
    try {
      this.setState({isLoading: true});
      const {data} = await customerClient.mutate({
        // mutation: CREATE_ACCOUNT_OTP,
        mutation: SEND_OTP,
        // variables: {mobileNumber: this.state.phoneField, websiteId: 1},
        variables: {
          email_or_Mobile: this.state.phoneField,
          entityType: 'mobile',
          actionType: 'signup',
        },
        context: {
          headers: {
            ETag: encrypted,
          },
        },
      });
      // if (data) {
      //   if (data.createAccountOTP.status) {
      //     this.setState({
      //       showOtp: true,
      //       shouldShow: false,
      //       showOTPTimer: true,
      //       isLoading: false,
      //     });
      //   } else {
      //     this.setState({isLoading: false});
      //     showErrorMessage(data.createAccountOTP.message, 'top');
      //   }
      // }
      if (data.sendOTP.message) {
        showSuccessMessage(data.sendOTP.message, 'top');
      }
      if (data) {
        if (data.sendOTP.message) {
          this.setState({
            showOtp: true,
            shouldShow: false,
            showOTPTimer: true,
            isLoading: false,
          });
        } else {
          this.setState({isLoading: false});
          showErrorMessage(data.sendOTP.message, 'top');
        }
      }
    } catch (error) {
      console.log('mobileerrorSSSSSSSSS', error);
      this.setState({isLoading: false});
      // showErrorMessage(error, 'top');
      showErrorMessage(
        String(error).replace('[Error: GraphQL error: ').replace(']'),
        'top',
      );
    }
  };
  confirmOtpPhone = async () => {
    const {phoneField, otp} = this.state;
    const {handleError} = this.context;
    try {
      this.setState({isLoading: true});
      const {data} = await customerClient.mutate({
        // mutation: VERIFY_CREATE_ACCOUNT_OTP,
        // variables: {mobileNumber: phoneField, otp: otp, websiteId: 1},
        mutation: VERIFY_OTP,
        variables: {
          email_or_Mobile: phoneField,
          otp_or_password: otp,
          entityType: 'mobile',
          actionType: 'signup_w_otp',
        },
      });
      // if (data) {
      //   if (data.createAccountOTPVerify.status) {
      //     this.setState({
      //       showOtp: false,
      //       shouldShow: true,
      //       showOTPTimer: false,
      //       isPhoneVerified: true,
      //       isLoading: false,
      //     });
      //   } else {
      //     this.setState({isLoading: false});
      //     showErrorMessage(data.createAccountOTPVerify.message, 'top');
      //   }
      // }
      if (data) {
        if (data.verifyOTP.message) {
          showSuccessMessage(data.verifyOTP.message, 'top');
          this.setState({
            showOtp: false,
            shouldShow: true,
            showOTPTimer: false,
            isPhoneVerified: true,
            isLoading: false,
          });
        } else {
          this.setState({isLoading: false});
          showErrorMessage(data.verifyOTP.message, 'top');
        }
      }
    } catch (error) {
      // console.log('MObileVerifyError', error);
      // const msg = handleError(typeof error === 'object' ? {...error} : error);
      // showErrorMessage(msg?.message, 'top');
      this.setState({isLoading: false});
      showErrorMessage(
        String(error).replace('[Error: GraphQL error: ').replace(']'),
        'top',
      );
    }
  };
  resendSignUpOtpPhone = async () => {
    const encrypted = this.encryption(this.state.phoneField);
    try {
      this.setState({isLoading: true});
      const {data} = await customerClient.mutate({
        // mutation: CREATE_ACCOUNT_OTP,
        // variables: {mobileNumber: this.state.phoneField, websiteId: 1},
        mutation: SEND_OTP,
        variables: {
          email_or_Mobile: this.state.phoneField,
          entityType: 'mobile',
          actionType: 'signup',
        },
        context: {
          headers: {
            ETag: encrypted,
          },
        },
      });
      // if (data) {
      //   this.setState({isLoading: false});
      //   if (data.createAccountOTP.status) {
      //     this.setState({showOTPTimer: true});
      //   } else {
      //     showErrorMessage(data.createAccountOTP.message, 'top');
      //   }
      // }

      if (data) {
        if (data.sendOTP.message) {
          showSuccessMessage(data.sendOTP.message, 'top');

          this.setState({
            shouldShow: false,
            showOTPTimer: true,
            isLoading: false,
          });
        } else {
          this.setState({isLoading: false});
          showErrorMessage(data.sendOTP.message, 'top');
        }
      }
    } catch (error) {
      this.setState({isLoading: false});
      // showErrorMessage(error, 'top');
      showErrorMessage(
        String(error).replace('[Error: GraphQL error: ').replace(']'),
        'top',
      );
    }
  };
  completeOTPTimer = async () => {
    this.setState({showOTPTimer: false});
  };
  newAccountCreatePhone = async () => {
    const {
      phoneField,
      otp,
      loginField,
      firstname,
      lastname,
      password,
      referralText,
    } = this.state;
    const {
      getUserInfo,
      handleError,
      getGuestAndCustomerCartId,
      getWhatsAppLink,
    } = this.context;
    console.log(
      'kkkkkkkkkkkkkkkk',
      phoneField,
      otp,
      loginField,
      firstname,
      lastname,
      password,
    );
    try {
      this.setState({isLoading: true});
      // let emailData = '';
      // ifs (loginField != '') {
      //   emailData = loginField;
      // } else {
      //   emailData = phoneField + '@dentalkart.user';
      // }
      const {data} = await customerClient.mutate({
        // mutation: CREATE_NEW_MOBILE_USER,
        // variables: {
        //   customerEmail: emailData,
        //   firstname: firstname,
        //   lastname: lastname,
        //   password: password,
        //   mobileNumber: phoneField,
        //   otp: otp,
        //   websiteId: 1,
        // },
        mutation: CREATE_NEW_USER,
        variables: {
          // email: emailData,
          // ...(loginField ? {email: loginField} : {}),
          email: loginField || undefined,
          mobile: phoneField,
          firstname: firstname,
          lastname: lastname,
          password: password,
          referralCode: referralText,
        },
      });
      // data.createCustomer.token;
      // if (data) {
      //   if (data.createCustomerAccount.status) {
      //     const token = data.createCustomerAccount.token;
      //     await tokenClass.setToken(token);
      //     await getUserInfo();
      //     await getWhatsAppLink();
      //     await getGuestAndCustomerCartId();
      //     this.setState({isLoading: false});
      //     AnalyticsEvents('SIGNUP', 'signup', {
      //       firstname: firstname,
      //       lastname: lastname,
      //       mobileNumber: phoneField,
      //     });
      //     return this.navigateToLastScreen();
      //   } else {
      //     this.setState({isLoading: false});
      //     showErrorMessage(data.createCustomerAccount.message, 'top');
      //   }
      // }
      if (data) {
        if (data.createCustomerV2.token) {
          const token = data.createCustomerV2.token;
          await tokenClass.setToken(token);
          await getUserInfo();
          await getWhatsAppLink();
          await getGuestAndCustomerCartId();
          this.setState({isLoading: false});
          AnalyticsEvents('SIGNUP', 'signup', {
            firstname: firstname,
            lastname: lastname,
            mobileNumber: phoneField,
          });
          showSuccessMessage('Registration Successful', 'top');
          return this.navigateToLastScreen();
        } else {
          this.setState({isLoading: false});
          showErrorMessage(data.createCustomerAccount.message, 'top');
        }
      }
    } catch (error) {
      // const msg = handleError(typeof error === 'object' ? {...error} : error);
      this.setState({isLoading: false});
      // showErrorMessage(msg?.message, 'top');
      showErrorMessage(
        String(error).replace('[Error: GraphQL error: ').replace(']'),
        'top',
      );
      // console.log(error);
    }
  };
  render() {
    const buttonText = this.state.shouldShow
      ? 'Use Mobile Number'
      : 'Use Email';
    return (
      <View style={{flex: 1}}>
        <Spinner
          visible={this.state.isLoading}
          // textContent={''}
          // textStyle={{ color: colors.White }}
          indicatorStyle={{activeOpacity: 1}}
        />
        {/* <KeyboardAvoidingScrollView > */}
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
        </View>
        {!this.state.showOtp ? (
          <View style={{flex: 0.75}}>
            <View style={[styles.midView]}>
              {(this.state.shouldShow &&
                (!this.state.isEmailVerified || this.state.isPhoneVerified)) ||
              (this.state.isEmailVerified && !this.state.isPhoneVerified) ? (
                <View
                  style={[
                    styles.emailTextInputView,
                    {
                      borderColor:
                        this.state.isSignUp && loginField == ''
                          ? colors.red
                          : colors.borderColor,
                      marginTop: 15,
                    },
                  ]}>
                  <Icon name="email" type="Fontisto" style={styles.emailIcon} />
                  <TextInputComponent
                    placeholder="Youremail@mail.com"
                    editable={this.state.isEmailVerified ? false : true}
                    placeholderTextColor={SecondaryColor}
                    value={this.state.loginField}
                    onChangeText={loginField => {
                      loginField = loginField.replace(/\s/g, '');
                      this.validate('loginField', loginField);
                    }}
                    keyboardType="email-address"
                    autoFocus={true}
                    autoCapitalize="none"
                  />
                </View>
              ) : null}
              {(!this.state.shouldShow &&
                (this.state.isEmailVerified || !this.state.isPhoneVerified)) ||
              (!this.state.isEmailVerified && this.state.isPhoneVerified) ? (
                <View
                  style={[
                    styles.emailTextInputView,
                    {
                      borderColor:
                        this.state.isSignUp && this.state.email == ''
                          ? colors.red
                          : colors.borderColor,
                      marginTop: 15,
                    },
                  ]}>
                  <Icon
                    name="phone"
                    type="Feather"
                    style={[styles.emailIcon, {fontSize: 20}]}
                  />
                  <TextInputComponent
                    placeholder="Mobile Number"
                    editable={this.state.isPhoneVerified ? false : true}
                    placeholderTextColor={SecondaryColor}
                    onChangeText={phoneField => {
                      phoneField = phoneField.replace(/\s/g, '');
                      this.validate('phoneField', phoneField);
                    }}
                    autoFocus={true}
                    value={this.state.phoneField}
                    error={this.state.phoneFieldError}
                    autoCorrect={false}
                    keyboardType={'numeric'}
                    maxLength={10}
                  />
                </View>
              ) : null}
              <View
                style={[
                  styles.emailTextInputView,
                  {
                    borderColor: colors.borderColor,
                    marginTop: 15,
                  },
                ]}>
                <Icon
                  name="user"
                  type="Feather"
                  style={[styles.emailIcon, {fontSize: 20}]}
                />
                <TextInputComponent
                  placeholder="Referral Code (optional)"
                  placeholderTextColor={SecondaryColor}
                  onChangeText={ref => {
                    this.setState({referralText: ref});
                  }}
                  value={this.state.referralText}
                  // error={this.state.phoneFieldError}
                  autoCorrect={false}
                />
              </View>
              {!this.state.isEmailVerified && !this.state.isPhoneVerified ? (
                <TouchableOpacity
                  style={{
                    alignItems: 'flex-start',
                    marginTop: 15,
                    height: 30,
                    justifyContent: 'center',
                  }}
                  onPress={() =>
                    this.setState({shouldShow: !this.state.shouldShow})
                  }>
                  <Text allowFontScaling={false} style={{fontSize: 14}}>
                    <Text allowFontScaling={false} style={{color: colors.text}}>
                      Or Signup with{' '}
                    </Text>
                    <Text
                      allowFontScaling={false}
                      style={{color: colors.normalText}}>
                      {buttonText}
                    </Text>
                  </Text>
                </TouchableOpacity>
              ) : null}

              {this.state.isEmailVerified || this.state.isPhoneVerified ? (
                <View>
                  <View
                    style={[
                      styles.emailTextInputView,
                      {borderColor: colors.borderColor, marginTop: 15},
                    ]}>
                    <Icon
                      name="user"
                      type="AntDesign"
                      style={styles.emailIcon}
                    />
                    <TextInputComponent
                      placeholder="First Name"
                      placeholderTextColor={SecondaryColor}
                      onChangeText={firstname =>
                        this.validate('firstname', firstname)
                      }
                      value={this.state.firstname}
                      autoCorrect={false}
                    />
                  </View>

                  {this.state.firstnameError !== '' ? (
                    <View>
                      <Text style={{color: 'red'}}>
                        {this.state.firstnameError}
                      </Text>
                    </View>
                  ) : null}

                  <View
                    style={[
                      styles.emailTextInputView,
                      {borderColor: colors.borderColor, marginTop: 15},
                    ]}>
                    <Icon
                      name="user"
                      type="AntDesign"
                      style={styles.emailIcon}
                    />
                    <TextInputComponent
                      placeholder="Last Name"
                      placeholderTextColor={SecondaryColor}
                      value={this.state.lastname}
                      onChangeText={lastname =>
                        this.validate('lastname', lastname)
                      }
                      autoCorrect={false}
                    />
                  </View>
                  {this.state.lastnameError !== '' ? (
                    <View>
                      <Text style={{color: 'red'}}>
                        {this.state.lastnameError}
                      </Text>
                    </View>
                  ) : null}
                  <View>
                    <View
                      style={[
                        styles.emailTextInputView,
                        {borderColor: colors.borderColor, marginTop: 12},
                      ]}>
                      <Icon
                        name="lock"
                        type="SimpleLineIcons"
                        style={styles.emailIcon}
                      />
                      <TextInputComponent
                        placeholder="Password"
                        placeholderTextColor={SecondaryColor}
                        value={this.state.password}
                        onChangeText={password => {
                          password = password.replace(/\s/g, '');
                          this.validate('password', password);
                        }}
                        secureTextEntry={this.state.hidePassword}
                      />

                      <TouchableOpacity
                        onPress={() =>
                          this.setState({
                            hidePassword: !this.state.hidePassword,
                          })
                        }
                        style={styles.eyeIconWrapper}>
                        <Icon
                          name={this.state.hidePassword ? 'eye-off' : 'eye'}
                          color={this.state.password ? SecondaryColor : '#ddd'}
                          style={{fontSize: 22, color: colors.blueColor}}
                          size={20}
                        />
                      </TouchableOpacity>
                    </View>
                    {this.state.passwordError !== '' ? (
                      <View>
                        <Text style={{color: 'red'}}>
                          {this.state.passwordError}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              ) : null}
            </View>

            <View style={styles.footerView}>
              {this.state.isEmailVerified || this.state.isPhoneVerified ? (
                <TouchableCustom
                  onPress={() => {
                    (this.state.isVerifiedData || this.state.isPhoneVerified) &&
                    this.state.firstname &&
                    this.state.firstnameError === '' &&
                    this.state.lastname &&
                    this.state.lastnameError === '' &&
                    this.state.password &&
                    this.state.passwordError === '' &&
                    !this.state.passwordError
                      ? this.state.isPhoneVerified
                        ? this.newAccountCreatePhone()
                        : this.newUserData()
                      : null;
                  }}>
                  <View
                    style={
                      (this.state.isVerifiedData ||
                        this.state.isPhoneVerified) &&
                      this.state.firstname &&
                      this.state.firstnameError === '' &&
                      this.state.lastname &&
                      this.state.lastnameError === '' &&
                      this.state.password &&
                      this.state.passwordError === '' &&
                      !this.state.passwordError
                        ? styles.loginBtn
                        : styles.loginBtnDisabled
                    }>
                    <Text
                      allowFontScaling={false}
                      style={[styles.signUpButtonText, styles.textBtnCenter]}>
                      Create Account
                    </Text>
                  </View>
                </TouchableCustom>
              ) : this.state.shouldShow ? (
                <TouchableCustom onPress={() => this.resendSignUpOtp()}>
                  <View
                    style={[
                      this.state.isVerifiedData
                        ? styles.loginBtn
                        : styles.loginBtnDisabled,
                    ]}>
                    <Text
                      allowFontScaling={false}
                      style={[styles.signUpButtonText, styles.textBtnCenter]}>
                      Verify Email
                    </Text>
                  </View>
                </TouchableCustom>
              ) : (
                <TouchableCustom
                  onPress={
                    this.state.phoneField.length == 10 &&
                    !this.state.phoneFieldError
                      ? this.createMobileRegisterOTP
                      : null
                  }>
                  <View
                    style={[
                      this.state.phoneField.length == 10 &&
                      !this.state.phoneFieldError
                        ? styles.loginBtn
                        : styles.loginBtnDisabled,
                    ]}>
                    <Text allowFontScaling={false} style={styles.textBtnCenter}>
                      {' '}
                      Verify Mobile
                    </Text>
                  </View>
                </TouchableCustom>
              )}
            </View>
          </View>
        ) : this.state.shouldShow ? (
          <Otp
            _this={this}
            resendOtp={this.resendSignUpOtp}
            confirmOtp={this.confirmOtp}
            completeOTPTimer={this.completeOTPTimer}
            shouldShow={this.state.showOTPTimer}
          />
        ) : (
          <Otp
            _this={this}
            completeOTPTimer={this.completeOTPTimer}
            shouldShow={this.state.showOTPTimer}
            resendOtp={this.resendSignUpOtpPhone}
            confirmOtp={this.confirmOtpPhone}
            pageName={'registration'}
          />
        )}
        {/* </KeyboardAvoidingScrollView> */}
      </View>
    );
  }
}
