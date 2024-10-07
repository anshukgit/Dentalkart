import {StyleSheet} from 'react-native';
import {SecondaryColor, DeviceHeight} from '@config/environment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import colors from '../../../../../../config/colors';

export default Styles = StyleSheet.create({
  wrapper: {
    height: DeviceHeight - 100,
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
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderColor: '#E8F2FF',
  },
  selectedTab: {
    borderBottomWidth: 2,
    borderColor: colors.blueColor,
  },
  tabText: {
    fontWeight: '500',
    fontSize: wp('4%'),
  },
  selectedTabText: {
    color: colors.blueColor,
  },

  //=========================//
  cardContainer: {
    backgroundColor: colors.white,
    // width: '95%',
    // alignSelf: 'center',
    // borderRadius: hp('1%'),
    // paddingHorizontal: '5%',
    marginTop: hp('1.5%'),
    // paddingVertical: hp('1.5%'),
    // borderWidth: 1,
    // borderColor: '#ccc',
    padding: '4%',
  },
  cardHeaderWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardOrderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardOrderIdLabel: {
    color: colors.productHeaderText,
    // fontSize: wp('3.5%'),
    fontSize: wp('3.3%'),
    fontWeight: '600',
  },
  cardOrderIdText: {
    // fontSize: wp('4%'),
    fontSize: wp('3.3%'),
    fontWeight: '500',
  },
  cardCreatedText: {
    fontSize: wp('3.2%'),
    // marginTop: hp('.5%'),
    fontWeight: '500',
    color: colors.LightSlateGrey,
    marginLeft: 10,
  },
  cardHeaderViewButtonContainer: {
    paddingHorizontal: wp('4%'),
    paddingVertical: hp('1%'),
    borderRadius: hp('2%'),
    backgroundColor: colors.HexColor,
    flexDirection: 'row',
  },
  cardHeaderViewButtonText: {
    fontSize: wp('3.5%'),
    fontWeight: '400',
  },
  cardStatusText: {
    color: '#2B5F2B',
    fontWeight: '600',
    fontSize: wp('3.5%'),
    // marginVertical: hp('.8'),
    marginLeft: wp('2%'),
  },
  cardPriceContaiber: {
    flexDirection: 'row',
  },
  cardTotalPriceText: {
    color: colors.blueColor,
    fontWeight: '400',
    fontSize: wp('4%'),
  },
  cardItemsText: {
    color: colors.LightGray,
    fontSize: wp('3.2%'),
    fontWeight: '600',
    color: 'black',
    // alignSelf: 'center',
    // textAlign: 'center',
  },
  cardButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp('1.5%'),
  },
  cardLeftButtonContainer: {
    width: '38%',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('1.1%'),
    borderRadius: hp('.5%'),
    borderColor: colors.borderColor,
    marginRight: wp('4%'),
  },
  cardLeftButtonText: {
    color: '#54595C',
    fontSize: wp('4%'),
    fontWeight: '500',
  },
  cardRightButtonContainer: {
    width: '55%',
    // width: "38%",
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: hp('1.1%'),
    borderRadius: hp('.5%'),
    backgroundColor: colors.SummerSky,
  },
  cardRightButtonText: {
    color: colors.white,
    fontSize: wp('4%'),
    fontWeight: '500',
  },
  dropdown: {
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 6,
  },
  placeholderStyle: {},
});
