import React, {Component} from 'react';
import {Text, View, Linking, TouchableOpacity} from 'react-native';

export default class InfoHeader extends Component {
  render() {
    return (
      <View
        style={{
          backgroundColor: '#073858',
        }}>
        <TouchableOpacity onPress={() => Linking.openURL('tel:+91 7289999456')}>
          <Text allowFontScaling={false}
            style={{
              color: '#fff',
              textAlign: 'right',
              padding: 5,
            }}>
            Customer Care: +91 728-9999-456
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
