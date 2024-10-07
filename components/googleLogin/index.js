import React, { Component } from 'react';
import { StyleSheet, TouchableOpacity, Image, View, Text, Platform } from 'react-native';
// import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from '@react-native-community/google-signin';
import { GoogleLoginConfigs } from '@config/environment';
import colors from '@config/colors';

class GoogleLogin extends Component {
  async googleSignIn() {
    GoogleSignin.configure({
      scopes: [], // what API you want to access on behalf of the user, default is email and profile
      webClientId: GoogleLoginConfigs.webClientId, // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: false, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      forceConsentPrompt: true, // [Android] if you want to show the authorization prompt at each login.
      // iosClientId: GoogleLoginConfigs.iosClientId, // [iOS] optional, if you want to specify the client ID of type iOS (otherwise, it is taken from GoogleService-Info.plist)
    });
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('userInfo', userInfo);
      this.props.getUserData(userInfo);
    } catch (error) {
      console.log(error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (f.e. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  }
  render() {
    return (
      <GoogleSigninButton
        style={{ width: Platform.OS == 'ios' ? '90%' : '92%', height: 50, marginTop: 10, borderWidth: 1, borderColor: colors.borderColor }}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Light}
        onPress={() => this.googleSignIn()}
      />
    );
  }
}

const styles = StyleSheet.create({
  buttonWrapper: {
    height: 35,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#efefef',
  },
  socialButtonTitle: {
    color: '#000',
    fontSize: 15,
  },
  mainContainer: {
    width: '30%',
  },
});

export default GoogleLogin;
