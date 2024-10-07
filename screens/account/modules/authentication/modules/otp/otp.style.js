import {StyleSheet, Platform} from 'react-native';
import {DeviceHeight, DeviceWidth, PrimaryColor} from '@config/environment';

export default styles = StyleSheet.create({
  otpWrapper: {
    backgroundColor: '#ffffff',
  },
  titleWrapper: {
    marginTop: 40,
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    color: '#b4b3b3',
    fontSize: 12,
  },
  otpFormWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: 15,
  },
  otpInputWrapper: {
    width: 20,
  },
  otpInput: {
    paddingLeft: 6,
  },
  resendOtpWrapper: {
    marginTop: 50,
  },
  resendOtpTimer: {
    marginTop: 50,
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendOtpText: {
    color: '#999999',
  },
  resendOtpTextRem: {
    color: '#999999',
    fontSize: 15,
  },
  verifyWrapper: {
    paddingTop: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInButtonDisabled: {
    backgroundColor: '#d4d4d4',
    borderRadius: 5,
    marginTop: 50,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    width: DeviceWidth - 30,
  },
  signInButton: {
    backgroundColor: PrimaryColor,
    borderRadius: 5,
    marginTop: 50,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    width: DeviceWidth - 30,
  },
  signInButtonText: {
    color: '#ffffff',
    fontSize: 12,
  },
  loginBtn: {
    width: '100%',
    height: 48,
    borderRadius: 3,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: colors.blueColor,
    justifyContent: 'center',
  },
  loginBtnDisabled: {
    width: '100%',
    height: 48,
    borderRadius: 3,
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: colors.blueColor,
    justifyContent: 'center',
    opacity: 0.5,
  },
});
