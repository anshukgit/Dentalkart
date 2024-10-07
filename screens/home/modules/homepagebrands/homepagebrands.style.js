import {StyleSheet} from 'react-native';
import {DeviceWidth, SecondaryColor} from '@config/environment';

export default styles = StyleSheet.create({
  touchable: {
    backgroundColor: SecondaryColor,
  },
  banner: {
    width: DeviceWidth,
    height: (DeviceWidth * 500) / 1090,
    resizeMode: 'cover',
    marginTop: 2,
  },
  sliderImage: {
    height: ((DeviceWidth - 50) * 312) / 581,
    width: DeviceWidth - 50,
  },
});
