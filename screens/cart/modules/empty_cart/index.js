import React, {Component} from 'react';
import {Text, View, Image} from 'react-native';
import TouchableCustom from '@helpers/touchable_custom';
import styles from './empty_cart.style';
import {DentalkartContext} from '@dentalkartContext';
import {fireAnalyticsEvent} from '@helpers/firebase_analytics';

export default class EmptyCart extends Component {
  static contextType = DentalkartContext;
  triggerScreenEvent = _ => {
    const {navigation, userInfo} = this.props;
    let {params} = navigation.state;
    const entry = params ? params.entry : false;
    fireAnalyticsEvent({
      eventname: 'screenname',
      screenName: 'Empty Cart',
      entry,
      userId: userInfo && userInfo.getCustomer ? userInfo.getCustomer.id : '',
    });
  };
  componentDidMount() {
    const {getUserInfo} = this.context;
    getUserInfo();
    this.triggerScreenEvent();
  }
  render() {
    return (
      <View style={styles.wrapper}>
        <Text allowFontScaling={false} style={styles.textHeading}>
          {"It's Empty Here !"}
        </Text>
        <Image
          source={{
            uri: 'https://s3.ap-south-1.amazonaws.com/dentalkart-media/App/emptyCartTP.png',
          }}
          style={styles.emptyImage}
        />
        <TouchableCustom
          underlayColor={'#ffffff10'}
          onPress={() => this.props.navigation.navigate('Home')}>
          <Text allowFontScaling={false} style={styles.shoppingButton}>
            Continue Shopping
          </Text>
        </TouchableCustom>
      </View>
    );
  }
}
