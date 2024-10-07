import {StyleSheet} from 'react-native';
import {DeviceWidth} from '@config/environment';

export default styles = StyleSheet.create({
  sliderWrapper: {
    marginBottom: 5,
    backgroundColor: '#fff',
  },
  sliderImage: {
    height: ((DeviceWidth - 50) * 312) / 581,
    width: DeviceWidth - 50,
    borderRadius: 10,
  },
  slider: {
    // overflow: 'visible' // for custom animations
  },
  sliderContentContainer: {
    paddingVertical: 10,
    // for custom animation
  },
});
