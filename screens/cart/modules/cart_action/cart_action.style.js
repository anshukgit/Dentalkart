import {StyleSheet} from 'react-native';
import {DeviceWidth, SecondaryColor, PrimaryColor} from '@config/environment';
import colors from '@config/colors';
const styles = StyleSheet.create({
  cartActionContainer: {
    backgroundColor: '#fff',
    elevation: 10,
    shadowColor: '#bfbfbf',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    justifyContent: 'center',
  },
  modalContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  globalErrorText: {
    textAlign: 'center',
    fontSize: 12,
    paddingBottom: 5,
    color: '#ed4949',
  },
  cartActionWrapper: {
    flexDirection: 'row',
  },
  shortSummaryWrapper: {
    width: DeviceWidth / 2,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shortSummaryPrice: {
    fontSize: 15,
    color: '#212121',
  },
  shortSummaryViewdetail: {
    color: SecondaryColor,
    fontSize: 12,
    fontWeight: 'bold',
  },
  continueButtonWrapper: {
    width: DeviceWidth / 2,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueButton: {
    backgroundColor: PrimaryColor,
    // width: DeviceWidth/2,
    // height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    // borderRadius: 2,
    // borderColor: '#b9b9b9',
    // elevation: 1,
    shadowColor: '#bfbfbf',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  disabled: {
    opacity: 0.5,
  },
  checkBoxView: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  footerView: {
    paddingBottom: 5,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  CheckoutView: {
    width: '100%',
    height: 43,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.orangeBtn,
  },
  CheckoutText: {fontSize: 18, color: colors.white, fontWeight: 'bold'},
  conditionText: {fontSize: 13, fontWeight: '500', flex: 1},
  modalHeader: {
    alignItems: 'flex-end',
    paddingRight: 5,
  },
  heading: {
    fontSize: 24,
    fontWeight: '800',
    paddingVertical: 5,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: '700',
    paddingVertical: 4,
  },
  body: {
    fontSize: 14,
  },
  withPadding: {
    paddingVertical: 5,
  },
  checkBoxContainer: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  row: {flexDirection: 'row'},
  spaceBetween: {justifyContent: 'space-between'},
});
export default styles;
