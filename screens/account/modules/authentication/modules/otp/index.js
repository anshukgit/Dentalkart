import React, {useCallback, useEffect, useState} from 'react';
import {Text, View, TouchableOpacity, Platform, Keyboard} from 'react-native';
import styles from './otp.style';
import {fireAnalyticsEvent} from '@helpers/firebase_analytics';
import CountDown from 'react-native-countdown-component';
import RNOtpVerify from 'react-native-otp-verify';
import OTPInputView from '@twotalltotems/react-native-otp-input';

export const Otp = ({
  _this,
  resendOtp,
  scr,
  generateToken,
  confirmOtp,
  shouldShow,
  completeOTPTimer,
  pageName,
}) => {
  const [otpCode, setOtpCode] = useState('');

  const triggerScreenEvent = _ => {
    fireAnalyticsEvent({
      eventname: 'screenname',
      screenName: `Otp`,
      userId: '',
    });
  };

  useEffect(() => {
    triggerScreenEvent();
    Platform.OS === 'android' &&
      RNOtpVerify.getOtp()
        .then(p => RNOtpVerify.addListener(otpHandler))
        .catch(p => console.log(p));
  }, [otpHandler]);

  const otpHandler = useCallback(
    message => {
      let code = message.split('.')[0];
      code = code.slice(-6);
      if (!isNaN(code)) {
        setOtpCode(code);
        _this.validate('otp', code);
        Keyboard.dismiss();
      }
    },
    [_this],
  );

  return (
    <View style={styles.otpWrapper}>
      <View style={styles.titleWrapper}>
        <Text allowFontScaling={false} style={styles.titleText}>
          Please enter the verification code sent to
        </Text>
        {pageName == 'registration' ? (
          <Text allowFontScaling={false} style={styles.titleText}>
            {_this.state.phoneField}
          </Text>
        ) : (
          <Text allowFontScaling={false} style={styles.titleText}>
            {_this.state.loginField}
          </Text>
        )}
      </View>
      <View style={styles.otpFormWrapper}>
        <View>
          <OTPInputView
            style={{
              width: '90%',
              height: 30,
              alignSelf: 'center',
            }}
            pinCount={6}
            code={otpCode} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
            onCodeChanged={code => {
              setOtpCode(code), _this.validate('otp', code);
            }}
            autoFocusOnLoad={false}
            codeInputFieldStyle={{
              width: 40,
              height: 40,
              borderWidth: 1,
              borderColor: '#0ea1e0',
              borderRadius: 4,
              justifyContent: 'center',
              alignItems: 'center',
              color: '#000',
            }}
            keyboardType={'phone-pad'}
          />
          <View style={styles.verifyWrapper}>
            {scr !== 'fp' ? (
              <TouchableOpacity
                style={{
                  width: '75%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: 35,
                }}
                activeOpacity={_this.state.isOtpVerified ? 0 : 1}
                onPress={() =>
                  _this.state.isOtpVerified && !_this.state.isPhoneLogin
                    ? confirmOtp()
                    : _this.state.isOtpVerified && _this.state.isPhoneLogin
                    ? confirmOtp()
                    : null
                }>
                <View
                  style={[
                    _this.state.isOtpVerified
                      ? styles.loginBtn
                      : styles.loginBtnDisabled,
                    {},
                  ]}>
                  <Text
                    allowFontScaling={false}
                    style={[styles.signInButtonText]}>
                    Verify
                  </Text>
                </View>
              </TouchableOpacity>
            ) : null}
            <View style={{alignItems: 'center'}}>
              {shouldShow ? (
                <View style={styles.resendOtpTimer}>
                  <Text
                    allowFontScaling={false}
                    style={styles.resendOtpTextRem}>
                    Time Remaining :{' '}
                  </Text>
                  <CountDown
                    until={60 * 1 + 59}
                    size={15}
                    onFinish={completeOTPTimer}
                    digitStyle={{width: 20}}
                    digitTxtStyle={{
                      color: '#999999',
                      fontWeight: '500',
                      fontSize: 15,
                    }}
                    timeToShow={['M', 'S']}
                    timeLabels={{m: null, s: null}}
                    showSeparator={true}
                    separatorStyle={{
                      fontSize: 15,
                      color: '#999999',
                      width: 5,
                    }}
                  />
                </View>
              ) : (
                <View style={styles.resendOtpWrapper}>
                  <TouchableOpacity
                    style={{alignItems: 'center'}}
                    onPress={() => resendOtp()}>
                    <Text allowFontScaling={false} style={styles.resendOtpText}>
                      Resend Otp
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};
