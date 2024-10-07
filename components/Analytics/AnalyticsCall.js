import WebEngage from 'react-native-webengage';
import firebase from 'react-native-firebase';
var webengage = new WebEngage();

export const setLoginId = (loginId = '') => {
  console.log('loginId', loginId);
  webengage.user.setOptIn('push', true);
  webengage.user.setOptIn('in_app', true);
  webengage.user.setOptIn('email', true);
  webengage.user.setOptIn('sms', true);
  webengage.user.setOptIn('whatsapp', true);
  webengage.user.login(loginId);
};

export const logout = () => {
  setEvent('User Logout', {});
  webengage.user.logout();
};

export const setEmail = (email = '') => {
  console.log('email', email);
  webengage.user.setEmail(email);
};

export const setPhone = (phone = '') => {
  console.log('phone', phone);
  webengage.user.setPhone(phone);
};

export const setDOB = (dob = '') => {
  console.log('dob', dob);
  webengage.user.setBirthDateString(dob);
};

export const setFirstName = (firstName = '') => {
  console.log('firstName', firstName);
  webengage.user.setFirstName(firstName);
};

export const setLastName = (lastName = '') => {
  console.log('lastName', lastName);
  webengage.user.setLastName(lastName);
};

export const enabledPushNotification = () => {
  console.log('enabledPushNotification');
  webengage.user.setDevicePushOptIn(true);
};

export const setEvent = async (eventName = '', data = {}) => {
  try {
    console.log('eventName=============', eventName);
    console.log('data==============', data);
    webengage.track(eventName, data);
    let firebaseEventName = eventName.replace(/ /g, '_');
    firebaseEventName = firebaseEventName.replace(/ /g, '_');
    console.log('firebaseEventName', firebaseEventName, data);
    await firebase.analytics().logEvent(firebaseEventName, data);
  } catch (e) {
    console.log('setEvent error', e);
  }
};
