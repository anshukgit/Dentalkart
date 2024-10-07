import {StyleSheet} from 'react-native';
import {DeviceHeight, DeviceWidth, SecondaryColor} from '@config/environment';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default styles = StyleSheet.create({
  imageContainer: {
    backgroundColor: '#fff',
  },
  bigimageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  iconContainer: {
    position: 'absolute',
    zIndex: 10,
  },
  left: {
    left: wp('5%'),
  },
  right: {
    right: wp('5%'),
  },
  bottom: {
    left: wp('5%'),
    bottom: 0,
  },
  iconImage: {
    width: wp('32%'),
    height: wp('14%'),
  },
  bigimage: {
    height: DeviceHeight / 3,
    width: DeviceWidth,
    resizeMode: 'contain',
  },
  thumbnailsWrapper: {
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  thumbnailContainer: {
    marginRight: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#d6d7da',
    paddingTop: 2,
    paddingBottom: 2,
  },
  thumbnail: {
    height: 50,
    width: 50,
    resizeMode: 'contain',
  },
  activeImage: {
    borderWidth: 2,
    borderColor: SecondaryColor,
  },
});
