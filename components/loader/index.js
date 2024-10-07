import React from 'react';
import {
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
  Platform,
  Text,
} from 'react-native';
import {
  SecondaryColor,
  DeviceWidth,
  DeviceHeight,
  HeaderHeight,
} from '@config/environment';

class Loader extends React.Component {
  render() {
    return (
      <Modal
        transparent={this.props.transparent}
        animationType={'none'}
        visible={this.props.loading}>
        <View
          style={[
            styles.modalBackground,
            {backgroundColor: this.props.transparent ? '#ffffff10' : '#ffffff'},
          ]}>
          <ActivityIndicator
            animating={this.props.loading}
            size="large"
            color={SecondaryColor}
            hidesWhenStopped={true}
          />
        </View>
      </Modal>
    );
  }
}

export default Loader;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    position: 'absolute',
    width: DeviceWidth,
    height: DeviceHeight,
    //top: 70,
  },
});
