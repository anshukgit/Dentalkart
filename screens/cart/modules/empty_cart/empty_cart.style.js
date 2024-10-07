import {StyleSheet} from 'react-native';
import {DeviceHeight, SecondaryColor} from '@config/environment';

export default (styles = StyleSheet.create({
  wrapper: {
    height: DeviceHeight - 25,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  emptyImage: {
    height: 300,
    width: 300,
    resizeMode: 'contain',
  },
  textHeading: {
    fontSize: 16,
  },
  textAfterImage: {
    fontSize: 14,
  },
  shoppingButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: SecondaryColor,
    color: '#212121',
    borderRadius: 5,
    fontSize: 14,
  },
}));
