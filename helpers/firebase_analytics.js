import firebase from 'react-native-firebase';
import {Version} from '@config/environment';

export const fireAnalyticsEvent = async ({
  eventname,
  userId,
  screenName,
  entry,
  baseScreen,
}) => {
  try {
    const baseScreenMap = {
      UrlResolver: 'Product',
      Transactions: 'Rewards',
    };
    const eventObj = {
      screenName: entry ? `Entry Screen -> ${screenName}` : screenName,
      appName: 'Dentalkart',
      appVersion: Version,
      userId: userId,
    };
    if (screenName === 'Left Navigation Pane') {
      eventObj.baseScreen = baseScreenMap[baseScreen]
        ? baseScreenMap[baseScreen]
        : baseScreen;
    }
    console.log(eventObj);
    await firebase.analytics().logEvent(eventname, {
      ...eventObj,
    });
  } catch (e) {
    console.log(e);
  }
};
