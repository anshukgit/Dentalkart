import {Platform, StyleSheet} from 'react-native';
import {DeviceWidth} from '@config/environment';
import colors from '../../config/colors';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  FindText: {
    fontSize: wp('5%'),
    fontWeight: '600',
    color: '#9f9f9f',
  },
  FindTextSubHeading: {
    color: '#9f9f9f',
    fontSize: wp('4%'),
    fontWeight: '500',
  },
  modalMainView: {
    flex: 1,
    width: '100%',
  },
  addressModalView: {
    width: '100%',
    borderRadius: 15,
    height: Platform.OS === 'ios' ? hp('48%') : hp('55%'),
  },
  modalHeaderView: {
    width: '100%',
    height: '15%',
    padding: 10,
    justifyContent: 'center',
    paddingHorizontal: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 30,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '600',
    width: '100%',
    color: colors.white,
  },
  closeIconView: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'flex-end',
    position: 'absolute',
    right: 8,
    top: 0,
  },
  closeIcon: {fontSize: 18, color: 'white'},
  midView: {
    width: '100%',
    flex: 0.9,
    justifyContent: 'center',
    flexDirection: 'row',
    paddingBottom: 3,
  },
  body: {
    width: '100%',
    justifyContent: 'center',
    paddingBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: '#FFFFFF',
  },
  submitBtn: {
    width: '40%',
    height: hp('4.5%'),
    borderRadius: 30,
    backgroundColor: '#fd9c44',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  scrollViewContainer: {
    marginBottom: 120,
  },
  noSliderImage: {
    width: DeviceWidth,
    height: (DeviceWidth * 145) / 384,
    borderRadius: 5,
    resizeMode: 'stretch',
  },
  noCarouselImage: {
    width: DeviceWidth,
    height: (DeviceWidth * 368) / 384,
    borderRadius: 5,
    resizeMode: 'stretch',
  },
  tags: {
    span: {color: '#000000'},
    p: {color: '#000000'},
    h3: {color: '#000000'},
    strong: {color: '#000000'},
    ul: {color: '#000000'},
    li: {color: '#000000'},
  },
});
