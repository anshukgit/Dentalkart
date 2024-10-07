import {StyleSheet, Platform} from 'react-native';
import {DeviceWidth, DeviceHeight} from '../../config/environment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../config/colors';

export const styles = StyleSheet.create({
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.black,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: hp('7%'),
    alignItems: 'center',
    backgroundColor: colors.width,
  },
  parentHr: {
    height: 1,
    color: colors.white,
    width: '100%',
  },
  child: {
    backgroundColor: colors.width,
  },
});
