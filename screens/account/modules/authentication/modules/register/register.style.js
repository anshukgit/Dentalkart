import { StyleSheet, Platform } from 'react-native';
import { DeviceWidth, DeviceHeight, PrimaryColor } from '@config/environment';
import colors from '@config/colors';
export default styles = StyleSheet.create({
  signUpOtpWrapper: {
    backgroundColor: '#ffffff',
    flex: 1,

  },
  signUpFormWrapper: {
    flex: 1,

    // paddingLeft: 15,
    // paddingRight: 15,
    // height : Platform.OS === 'ios' ? (DeviceHeight - 32) : (DeviceHeight - 56)
  },
  textFieldContainer: {
    width: '80%',
    alignSelf: 'center'
  },
  signUpButtonDisabled: {
    borderRadius: 5,
    backgroundColor: '#d4d4d4',
    marginTop: 25,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    width: DeviceWidth - 30,
    alignSelf: 'center'
  },
  signUpButton: {
    borderRadius: 5,
    backgroundColor: PrimaryColor,
    marginTop: 25,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    width: DeviceWidth - 30,
    alignSelf: 'center'
  },
  signUpButtonText: {
    color: '#ffffff',
    fontSize: 12
  },
  signUpErrorWrapper: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  signUpError: {
    color: 'red',
    textAlign: 'center'
  },
  eyeIconWrapper: {
    position: 'absolute',
    right: 5,
    top: 10,
    alignSelf: 'center',
  },
  logoMinView: { width: '100%', flex: 0.25, justifyContent: 'center', alignItems: 'center' },
  midView: { width: '100%',  paddingHorizontal: 20, },
  emailTextInputView: { width: '100%', height: 45, borderWidth: 1, alignItems: 'center', flexDirection: 'row', paddingHorizontal: 15, borderRadius: 3, },
  emailIcon: { fontSize: 16, marginRight: 15, color: '#c4cddd', },
  footerView: { width: '100%', alignItems: 'center', paddingHorizontal: 15,marginTop:40 },
  phoneNumberView: { width: '100%', height: 18, alignItems: 'center', flexDirection: 'row', marginTop: 12, },
  loginBtn: { width: '80%', height: 50, borderRadius: 3, alignItems: 'center', flexDirection: 'row', marginTop: 18, backgroundColor: colors.blueColor, justifyContent: 'center' },
  loginBtnDisabled: { width: '80%', height: 50, borderRadius: 3, alignItems: 'center', flexDirection: 'row', marginTop: 18, backgroundColor: colors.blueColor, justifyContent: 'center',opacity:0.5 },
  textBtnCenter: {color: colors.white, fontSize: 14, width: '100%', textAlign: 'center'},
});
