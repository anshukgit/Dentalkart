import {StyleSheet} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from '@config/colors';
// import { screenPadding, moderateScale, writeLog, verticalScale, responsiveHeight, responsiveFontSize, responsiveWidth } from '@config/functions';
export default styles = StyleSheet.create({
  cartItemMappingMainView: {
    height: 120,
    backgroundColor: colors.white,
    paddingHorizontal: 20,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  mappingDetailView: {
    height: '100%',
    width: '80%',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  prodctName: {fontSize: 13, fontWeight: '400', color: colors.black},
  qtyText: {color: colors.LightSlateGrey, fontSize: 13},
  qtyTextCount: {color: colors.black, fontWeight: '400', fontSize: 13},
  itemsinOrderView: {
    height: 35,
    backgroundColor: colors.white,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 3,
  },
  itemsinOrderTxt: {fontSize: 16, color: colors.black, fontWeight: '600'},
  cartItemImg: {
    width: '20%',
    height: 90,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.otpBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    paddingVertical: hp('1%'),
    flexDirection: 'row',
    justifyContent: 'flex-end',
    backgroundColor: '#ffffff',
  },
  trackOrderText: {
    color: '#155294',
    fontSize: 14,
    fontWeight: '500',
  },
  trakBtn: {
    width: '40%',
    height: 35,
    borderRadius: 3,
    backgroundColor: colors.SummerSky,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp('4%'),
  },
  returnBtn: {
    backgroundColor: colors.orangeBtn,
  },
  prevHis: {fontSize: 12, fontWeight: '500', color: '#00407B'},
  prevHisSub: {fontSize: 12},
  downloadFileView: {
    backgroundColor: 'white',
    justifyContent: 'flex-end',
    paddingRight: 20,
    flexDirection: 'row',
  },
  downloadView: {
    fontSize: 12,
    color: 'black',
    fontWeight: '500',
    backgroundColor: '#F1F3F6',
    padding: 4,
  },
  antDesignView: {
    fontSize: 20,
    backgroundColor: '#F1F3F6',
    padding: 4,
  },
});
