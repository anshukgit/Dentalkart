import {StyleSheet} from 'react-native';
import {DeviceWidth} from '@config/environment';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  bannerContainer: {
    top: 0,
  },
  membershipBanner: {
    width: DeviceWidth,
    height: (DeviceWidth * 145) / 300,
    resizeMode: 'stretch',
  },
  membershipBenefitBanner: {
    width: DeviceWidth,
    height: (DeviceWidth * 145) / 240,
    resizeMode: 'stretch',
  },
  planTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  planName: {
    fontSize: 14,
    fontWeight: 'bold',
    alignSelf: 'center',
  },
  becomeAMember: {
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'center',
    color: '#FFFFFF',
  },
  planHeading: {
    padding: 5,
  },
  planDetails: {
    backgroundColor: '#f3f8f4',
  },
  planCardContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 5,
  },
  cardTitle: {
    flexDirection: 'row',
  },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    margin: 5,
    elevation: 5,
    shadowColor: '#e4dede',
  },
  radioButton: {
    borderColor: '#ffa500',
    marginRight: 5,
    height: 18,
    width: 18,
  },
  dotStyle: {
    backgroundColor: '#ffa500',
    height: 10,
    width: 10,
  },
  ButtonMember: {
    // width: DeviceWidth,
    // height: (DeviceWidth * 145) / 200,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    width: 370,
  },
  amountBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 370,
    height: 40,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  centeraign: {alignSelf: "center", },
  imgbanner1: {
    width: DeviceWidth,
    height: (DeviceWidth * 145) / 190,
    resizeMode: 'stretch',
  },
  imgbanner2: {
    width: DeviceWidth,
    height: (DeviceWidth * 145) / 280,
    resizeMode: 'stretch',
  },
  CartButton: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  BorderBox: {
    width: 370,
    borderWidth: 1,
    borderColor: '#000000',
    alignSelf: 'center',
    marginTop: 10,
    padding: 10,
  },
  rangeSliderStyle: {
    padding: 5,
  },
  sliderContainer: {
    paddingVertical: 20,
  },
});
