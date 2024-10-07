import React, {Component} from 'react';
import {Text, View} from 'react-native';
import styles from './secure_payments.style';
import MIcon from 'react-native-vector-icons/MaterialIcons';

export default class SecurePayments extends Component {
  render() {
    return (
      <View style={[styles.securePaymentsContainer]}>
        <MIcon
          name="verified-user"
          size={30}
          style={styles.icon}
          color="#999999"
        />
        <View style={styles.secureTextWrapper}>
          <Text allowFontScaling={false} style={styles.secureText}>
            Safe and Secure Payments. Easy returns.
          </Text>
          <Text allowFontScaling={false} style={styles.secureText}>
            100% Authentic products.
          </Text>
        </View>
      </View>
    );
  }
}
