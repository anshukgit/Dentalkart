import React, {Component} from 'react';
import {
  Text,
  View,
  ToastAndroid,
  KeyboardAvoidingView,
  TouchableOpacity,
  Image,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import {DentalkartContext} from '@dentalkartContext';
import TouchableCustom from '@helpers/touchable_custom';
import {
  validateEmail,
  validatePassword,
  validateOTP,
  validatePhone,
} from '@helpers/validator';
import {TextField} from 'react-native-material-textfield';
import {SecondaryColor} from '@config/environment';
import {
  CHECK_NEW_EMAIL_QUERY,
  FORGOT_PASSWORD_QUERY,
  RESET_PASSWORD,
  LOGIN_QUERY,
} from '../../graphql';
import {Otp} from '../../modules/otp';
import {client, customerClient} from '@apolloClient';
import {Mutation, Query} from 'react-apollo';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './forgot_password.style';
import tokenClass from '@helpers/token';
import {getCartId} from '@helpers/cart_id';
import {
  usernameErrMsg,
  passwordErrMsg,
  otpSentMsg,
  emailExistenceErrMsg,
  unconfirmedEmailMsg,
  incorrectCredentialMsg,
} from '@config/messages';
import {fireAnalyticsEvent} from '@helpers/firebase_analytics';
import {
  showErrorMessage,
  showSuccessMessage,
} from '../../../../../../helpers/show_messages';
import {SafeAreaView} from 'react-native';
import RESET_PASSWORD_MOBILE from '../../graphql/mutations/reset_password_mobile.gql';
import VERIFY_FORGOT_PASSWORD_OTP from '../../graphql/mutations/forgot_password_otp_verify.gql';
import GET_FORGOT_PASSWORD_OTP from '../../graphql/mutations/forgot_password_otp.gql';
import GENERATE_MOBILE_NUMBER_TOKEN from '../../graphql/mutations/mobileToken.gql';
import {Icon} from 'native-base';
import TextInputComponent from '@components/TextInputComponent';
import Spinner from 'react-native-loading-spinner-overlay';
import CryptoJS from 'crypto-js';
export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginField: '',
      password: '',
      loginFieldError: '',
      passwordError: '',
      showPassword: false,
      otp: '',
      scr: 'email',
      isOtpVerified: false,
      verifyEmail: false,
      isVerifiedData: false,
      hidePassword: true,
      showOtp: false,
      showOTPTimer: false,
      isLoading: false,
    };
  }
  static contextType = DentalkartContext;

  login = async () => {
    const {loginField, password} = this.state;
    const {getUserInfo, handleError, getGuestAndCustomerCartId} = this.context;
    try {
      this.setState({isLoading: true});
      const {data} = await client.mutate({
        mutation: GENERATE_MOBILE_NUMBER_TOKEN,
        variables: {mobileEmail: loginField, password: password, websiteId: 1},
      });
      if (data.login.status) {
        const token = data.login.token;
        await tokenClass.setToken(token);
        await getUserInfo();
        await getGuestAndCustomerCartId();
        this.setState({isLoading: false});
        return this.navigateToLastScreen();
      } else {
        showErrorMessage(data.login.message, 'top');
        this.setState({isLoading: false});
      }
    } catch (err) {
      const msg = handleError(err);
      this.setState({isLoading: false});
      showErrorMessage(msg, 'top');
      console.warn(err);
    }
  };
  navigateToLastScreen = () => {
    return this.props.navigation.navigate('Home');
  };
  handleLoginErrors = error => {
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
    } else {
      const {handleError} = this.context;
      const msg = handleError(error);
      showErrorMessage(msg, 'top');
    }
  };
  confirmOtp = () => {
    this.setState({
      scr: 'setNewPasswordForm',
    });
  };

  encryption = () => {
    const {loginField} = this.state;

    const getTwoHalf = input => {
      const midpoint = Math.floor(input.length / 2);
      const firstHalf = input.substr(0, midpoint);
      const secondHalf = input.substr(midpoint);
      return {firstHalf, secondHalf};
    };

    const secret_key = '2b7e151628aed2a6abf7168809cf2f3c';
    let inputType = String(loginField);
    const {firstHalf, secondHalf} = getTwoHalf(inputType);
    const stringToBeEncrypted = firstHalf + secret_key + secondHalf;
    const key = CryptoJS.enc.Hex.parse(secret_key); // 128-bit key
    const encrypted = CryptoJS.AES.encrypt(stringToBeEncrypted, key, {
      mode: CryptoJS.mode.ECB,
    });
    return encrypted;
  };
  sendForgotOtp = async () => {
    const encrypted = this.encryption();
    const {loginField} = this.state;
    const {handleError} = this.context;
    try {
      this.setState({isLoading: true});
      const {data} = await customerClient.mutate({
        mutation: GET_FORGOT_PASSWORD_OTP,
        // variables: {email: loginField},
        variables: {
          email_or_mobile: loginField,
          entityType: 'email',
          actionType: 'forgot_password',
        },
        context: {
          headers: {
            ETag: encrypted,
          },
        },
      });
      // if (!data.forgotPassword.status)
      //   data.forgotPassword.message
      //     ? showSuccessMessage(data.forgotPassword.message, 'top')
      //     : showSuccessMessage(otpSentMsg, 'top');
      // this.setState({isLoading: false});
      // if (data)
      //   data.sendForgotPasswordOTP.message
      //     ? showSuccessMessage(data.sendForgotPasswordOTP.message, 'top')
      //     : showSuccessMessage(otpSentMsg, 'top');
      // this.setState({isLoading: false});
      if (data) {
        if (data.sendForgotPasswordOTP.message) {
          this.setState({
            scr: 'setNewPasswordForm',
          });
          this.setState({showOTPTimer: true});
          this.setState({isLoading: false});
        } else {
          showErrorMessage(data.sendForgotPasswordOTP.message, 'top');
        }
      }
    } catch (err) {
      console.log('EmailError___---_-_--___---__', err);
      // const msg = handleError(err);
      this.setState({isLoading: false});
      showErrorMessage(
        String(err).replace('[Error: GraphQL error: ').replace(']'),
        'top',
      );
      // showErrorMessage(msg, 'top');
    }
  };
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
  //       if (data.checkCustomerEmail.is_exist) {
  //         this.sendForgotOtp();
  //         this.setState({
  //           scr: 'setNewPasswordForm',
  //         });
  //       } else {
  //         showErrorMessage(emailExistenceErrMsg, 'top');
  //       }
  //       this.setState({isLoading: false});
  //     } catch (err) {
  //       const msg = handleError(err);
  //       this.setState({isLoading: false});
  //       showErrorMessage(msg, 'top');
  //       console.log(err);
  //     }
  //   } else {
  //     this.setState({isLoading: false});
  //     this.setState({loginFieldError: usernameErrMsg});
  //   }
  // };
  postResetPassword = async (cache, {data}) => {
    this.setState({isLoading: true});
    const {getUserInfo, getGuestAndCustomerCartId} = this.context;
    if (data) {
      if (data.verifyForgotPasswordOTP.token) {
        // this.login();
        const token = data.verifyForgotPasswordOTP.token;
        await tokenClass.setToken(token);
        await getUserInfo();
        await getGuestAndCustomerCartId();
        this.setState({isLoading: false});
        return this.navigateToLastScreen();
      } else {
        showErrorMessage(data.verifyForgotPasswordOTP.message, 'top');
      }
    }
    this.setState({isLoading: false});
  };
  async validate(type, data) {
    if (type == 'email') {
      if (data !== '') {
        let dataType = parseInt(data);
        if (dataType != data) {
          !validateEmail(data)
            ? this.setState({loginFieldError: 'Please enter correct email.'})
            : this.setState({loginFieldError: '', isPhoneLogin: false});
        } else {
          !validatePhone(data)
            ? this.setState({
                loginFieldError: 'Please enter correct mobile number.',
              })
            : this.setState({loginFieldError: '', isPhoneLogin: true});
        }
      }
      await this.setState({loginField: data});
    } else if (type == 'password') {
      await this.setState({password: data});
      !validatePassword(data)
        ? this.setState({passwordError: 'Password must be of 6 characters.'})
        : this.setState({passwordError: ''});
    } else if (type == 'otp') {
      await this.setState({otp: data});
      !validateOTP(data) ? null : this.setState({isOtpVerified: true});
    }
    !this.state.loginFieldError
      ? this.setState({verifyEmail: true})
      : this.setState({verifyEmail: false});
    !this.state.passwordError
      ? this.setState({isVerifiedData: true})
      : this.setState({isVerifiedData: false});
  }
  triggerScreenEvent = _ => {
    fireAnalyticsEvent({
      eventname: 'screenname',
      screenName: 'Forgot Password',
      userId: '',
    });
  };
  componentDidMount() {
    this.triggerScreenEvent();
  }

  requestForgotPasswordOTP = async () => {
    const encrypted = this.encryption();
    if (this.state.isPhoneLogin) {
      try {
        this.setState({isLoading: true});
        const {data} = await customerClient.mutate({
          // mutation: GET_FORGOT_PASSWORD_OTP,
          // variables: {mobileNumber: this.state.loginField, websiteId: 1},
          mutation: GET_FORGOT_PASSWORD_OTP,
          variables: {
            email_or_mobile: this.state.loginField,
            entityType: 'mobile',
            actionType: 'forgot_password',
          },
          context: {
            headers: {
              ETag: encrypted,
            },
          },
        });
        if (data) {
          if (data.sendForgotPasswordOTP.message) {
            this.setState({showOtp: true, showOTPTimer: true});
          } else {
            showErrorMessage(data.sendForgotPasswordOTP.message, 'top');
          }
        }
        this.setState({isLoading: false});
      } catch (error) {
        // showErrorMessage(error, 'top');
        showErrorMessage(
          String(error).replace('[Error: GraphQL error: ').replace(']'),
          'top',
        );
        this.setState({isLoading: false});
      }
    } else {
      showErrorMessage('Please enter mobile number', 'top');
      this.setState({isLoading: false});
    }
  };

  forgotPasswordPhoneLoginResendOTP = async () => {
    const encrypted = this.encryption();
    try {
      this.setState({isLoading: true});
      const {data} = await customerClient.mutate({
        // mutation: GET_FORGOT_PASSWORD_OTP,
        // variables: {mobileNumber: this.state.loginField, websiteId: 1},
        mutation: GET_FORGOT_PASSWORD_OTP,
        variables: {
          email_or_mobile: this.state.loginField,
          entityType: 'mobile',
          actionType: 'forgot_password',
        },
        context: {
          headers: {
            ETag: encrypted,
          },
        },
      });
      if (data) {
        if (data.sendForgotPasswordOTP.message) {
          this.setState({showOTPTimer: true});
        } else {
          showErrorMessage(data.sendForgotPasswordOTP.message, 'top');
        }
      }
      this.setState({isLoading: false});
    } catch (error) {
      // showErrorMessage(error, 'top');
      showErrorMessage(
        String(error).replace('[Error: GraphQL error: ').replace(']'),
        'top',
      );
      this.setState({isLoading: false});
    }
  };

  forgotPasswordPhoneLoginConfirmOTP = async () => {
    const {loginField, otp} = this.state;
    const {handleError} = this.context;
    try {
      this.setState({isLoading: true});
      const {data} = await client.mutate({
        mutation: VERIFY_FORGOT_PASSWORD_OTP,
        variables: {mobileNumber: loginField, otp: otp, websiteId: 1},
      });
      if (data) {
        if (data.forgotPassworOTPVerify.status) {
          this.setState({
            showOtp: false,
            showOTPTimer: false,
            scr: 'setNewPasswordForm',
          });
        } else {
          showErrorMessage(data.forgotPassworOTPVerify.message, 'top');
        }
      }
      this.setState({isLoading: false});
    } catch (error) {
      this.setState({isLoading: false});
      this.handleLoginErrors(error);
    }
  };

  forgotPasswordPhoneLoginReset = async () => {
    const {loginField, otp, password} = this.state;
    // const {handleError} = this.context;
    const {getUserInfo, handleError, getGuestAndCustomerCartId} = this.context;
    try {
      console.log('daaaaaaaaaaaaaaaa', loginField, otp, password);
      this.setState({isLoading: true});
      const {data} = await customerClient.mutate({
        // mutation: RESET_PASSWORD_MOBILE,
        // variables: {
        //   mobileNumber: loginField,
        //   otp: otp,
        //   password: password,
        //   websiteId: 1,
        // },
        mutation: RESET_PASSWORD,
        variables: {
          email_or_mobile: loginField,
          otp: otp,
          newPassword: password,
          entityType: 'mobile',
          actionType: 'forgot_pass_otp',
        },
      });
      // if (data) {
      //   if (data.resetPasswordOtp.status) {
      //     this.login();
      //   } else {
      //     showErrorMessage(data.resetPasswordOtp.message, 'top');
      //   }
      // }
      if (data) {
        if (data.verifyForgotPasswordOTP.token) {
          // this.login();
          const token = data.verifyForgotPasswordOTP.token;
          await tokenClass.setToken(token);
          await getUserInfo();
          await getGuestAndCustomerCartId();
          this.setState({isLoading: false});
          return this.navigateToLastScreen();
        } else {
          showErrorMessage(data.verifyForgotPasswordOTP.message, 'top');
        }
      }
      this.setState({isLoading: false});
    } catch (error) {
      console.log('ero999999999999999999', error);
      showErrorMessage(
        String(error).replace('[Error: GraphQL error: ').replace(']'),
        'top',
      );
      this.setState({isLoading: false});
      // this.handleLoginErrors(error);
    }
  };

  completeOTPTimer = async () => {
    this.setState({showOTPTimer: false});
  };

  render() {
    const {loginField, otp, password} = this.state;
    return (
      <SafeAreaView style={styles.forgotPasswordPageContainer}>
        <Spinner
          visible={this.state.isLoading}
          // textContent={''}
          // textStyle={{ color: colors.White }}
          indicatorStyle={{activeOpacity: 1}}
        />
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

        {this.state.scr === 'email' && !this.state.showOtp ? (
          <View style={styles.formWrapper}>
            <View style={styles.titleWrapper}>
              <Text allowFontScaling={false} style={styles.titleText}>
                Enter your email address/ mobile number
              </Text>
              <Text allowFontScaling={false} style={styles.titleText}>
                we will send you one time password
              </Text>
            </View>
            <KeyboardAvoidingView>
              <View style={styles.sectionFormWrapper}>
                <View
                  style={[
                    styles.emailTextInputView,
                    {borderColor: colors.borderColor},
                  ]}>
                  <Icon name="email" type="Fontisto" style={styles.emailIcon} />
                  <TextInputComponent
                    placeholder="Email Address / Mobile Number"
                    placeholderTextColor={SecondaryColor}
                    value={this.state.loginField}
                    onChangeText={email => {
                      email = email.replace(/\s/g, '');
                      this.validate('email', email);
                    }}
                    autoCapitalize="none"
                    style={{}}
                    keyboardType="email-address"
                  />
                </View>
                <TouchableOpacity
                  style={styles.loginBtn}
                  onPress={() =>
                    !this.state.isPhoneLogin
                      ? this.sendForgotOtp()
                      : this.requestForgotPasswordOTP()
                  }>
                  <Text
                    allowFontScaling={false}
                    style={{color: colors.white, fontSize: 14}}>
                    Send OTP
                  </Text>
                </TouchableOpacity>
              </View>
            </KeyboardAvoidingView>
          </View>
        ) : this.state.scr === 'email' &&
          this.state.isPhoneLogin &&
          this.state.showOtp ? (
          // <Otp
          //   _this={this}
          //   completeOTPTimer={this.completeOTPTimer}
          //   shouldShow={this.state.showOTPTimer}
          //   resendOtp={this.forgotPasswordPhoneLoginResendOTP}
          //   confirmOtp={this.forgotPasswordPhoneLoginConfirmOTP}
          // />
          <View style={styles.formWrapper}>
            <KeyboardAvoidingView behavior="padding">
              <View style={styles.sectionFormWrapper}>
                <Otp
                  _this={this}
                  completeOTPTimer={this.completeOTPTimer}
                  shouldShow={this.state.showOTPTimer}
                  resendOtp={this.forgotPasswordPhoneLoginResendOTP}
                  scr={'fp'}
                />
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
                      autoCapitalize="none"
                      returnKeyType="done"
                      id={input => {
                        this.emailInput = input;
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
                        type="MaterialCommunityIcons"
                      />
                    </TouchableOpacity>
                  </View>
                  {/* <TouchableOpacity
                    style={styles.loginBtn}
                    onPress={() =>
                      this.state.password
                        ? this.forgotPasswordPhoneLoginReset()
                        : null
                    }>
                    <Text
                      allowFontScaling={false}
                      style={{color: colors.white, fontSize: 14}}>
                      Login
                    </Text>
                  </TouchableOpacity> */}

                  <TouchableCustom
                    disabled={this.state.isLoading}
                    underlayColor={'#ffffff10'}
                    onPress={() => {
                      this.state.password.length > 5 && this.state.otp
                        ? this.forgotPasswordPhoneLoginReset()
                        : null;
                    }}>
                    <View
                      style={
                        this.state.password.length > 5 && this.state.otp
                          ? styles.loginBtn
                          : styles.loginBtnDisabled
                      }>
                      <Text allowFontScaling={false} style={styles.buttonText}>
                        Login
                      </Text>
                    </View>
                  </TouchableCustom>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        ) : null}
        {this.state.scr === 'setNewPasswordForm' && !this.state.isPhoneLogin ? (
          <View style={styles.formWrapper}>
            <KeyboardAvoidingView behavior="padding">
              <View style={styles.sectionFormWrapper}>
                <Otp
                  _this={this}
                  resendOtp={this.sendForgotOtp}
                  scr={'fp'}
                  completeOTPTimer={this.completeOTPTimer}
                  shouldShow={this.state.showOTPTimer}
                />
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
                      autoCapitalize="none"
                      returnKeyType="done"
                      id={input => {
                        this.emailInput = input;
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
                        type="MaterialCommunityIcons"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
                <Mutation
                  mutation={RESET_PASSWORD}
                  client={customerClient}
                  update={this.postResetPassword}
                  // variables={{
                  //   email: this.state.loginField,
                  //   otp: this.state.otp,
                  //   newPassword: this.state.password,
                  // }}
                  variables={{
                    email_or_mobile: this.state.loginField,
                    otp: this.state.otp,
                    newPassword: this.state.password,
                    entityType: 'email',
                    actionType: 'forgot_pass_otp',
                  }}
                  onError={err => this.handleLoginErrors(err)}>
                  {(resetPassword, {data, loading, error}) => {
                    return (
                      <TouchableCustom
                        disabled={loading}
                        underlayColor={'#ffffff10'}
                        onPress={() => {
                          this.state.password.length > 5 && this.state.otp
                            ? resetPassword()
                            : null;
                        }}>
                        <View
                          style={
                            this.state.password.length > 5 && this.state.otp
                              ? styles.loginBtn
                              : styles.loginBtnDisabled
                          }>
                          {loading ? (
                            <ActivityIndicator size={'small'} color={'white'} />
                          ) : (
                            <Text
                              allowFontScaling={false}
                              style={styles.buttonText}>
                              Login
                            </Text>
                          )}
                        </View>
                      </TouchableCustom>
                    );
                  }}
                </Mutation>
              </View>
            </KeyboardAvoidingView>
          </View>
        ) : null}
      </SafeAreaView>
    );
  }
}
