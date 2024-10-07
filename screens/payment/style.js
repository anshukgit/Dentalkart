import {StyleSheet} from 'react-native';
import {DeviceWidth, PrimaryColor, SecondaryColor} from '@config/environment';
import colors from '@config/colors';

export const DeliveryPageStyle = StyleSheet.create({
  flatlistWrapper: {
    backgroundColor: '#fff',
  },
  couponeCodeView: {
    height: 50,
    paddingVertical: 5,
    backgroundColor: colors.HexColor,
  },
  couponeSubView: {
    height: 40,
    backgroundColor: colors.white,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 20,
  },
  couponApplyButton: {
    fontSize: 12,
    color: colors.orangeBtn,
  },
  couponText: {
    color: '#1fa62d',
    fontSize: 13,
  },
  deliveryAddressWrapper: {
    backgroundColor: '#fff',
    padding: 2,
    borderRadius: 3,
    marginTop: 8,
    marginBottom: 5,
    marginRight: 8,
    marginLeft: 8,
    elevation: 1,
    shadowColor: '#bfbfbf',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  nameWrapper: {
    paddingLeft: 10,
  },
  name: {
    fontSize: 14,
    textTransform: 'capitalize',
    marginBottom: 2,
  },
  addressDetailWrapper: {
    paddingLeft: 10,
  },
  addressText: {
    fontSize: 14,
    color: '#21212180',
  },
  buttonWrapper: {
    backgroundColor: '#fff',
    marginVertical: 5,
    marginHorizontal: 10,
    height: 30,
    borderWidth: 0.4,
    borderColor: SecondaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    elevation: 1.5,
    shadowColor: '#bfbfbf',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  buttonText: {
    color: SecondaryColor,
    fontSize: 13,
  },
  shortSummaryPrice: {
    fontSize: 15,
    color: '#212121',
  },
  continueButtonWrapper: {
    width: DeviceWidth / 2,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  methodWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 3,
    marginTop: 10,
  },
  paymentTitleWrapper: {
    width: DeviceWidth / 1.3,
  },
  paymentTitle: {
    fontSize: 14,
    color: '#21212190',
  },
  paymentRadioIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOff: {
    color: SecondaryColor,
  },
  placeOrderButton: {
    backgroundColor: PrimaryColor,
    width: DeviceWidth / 2,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 2,
    borderColor: '#b9b9b9',
    elevation: 1,
    shadowColor: '#bfbfbf',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  deliveryActionContainer: {
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
  deliveryActionWrapper: {
    flexDirection: 'row',
  },
  errorText: {
    textAlign: 'center',
    fontSize: 12,
    paddingBottom: 5,
    color: '#ed4949',
  },
  shortSummaryWrapper: {
    width: DeviceWidth / 2,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeOrderButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  paymentWrapper: {
    marginTop: 5,
    marginHorizontal: 8,
    borderRadius: 3,
    backgroundColor: '#fff',
    marginBottom: 1,
    elevation: 2,
    shadowColor: '#bfbfbf',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  applyRewardsButtonView: {
    backgroundColor: '#fff',
    width: '100%',
    paddingHorizontal: 8,
    marginTop: 8,
    marginBottom: 3,
  },
  checkBoxMainView: {
    flexDirection: 'row',
    // marginTop: 10,
    width: '100%',
    // marginLeft: -6,
    alignItems: 'center',
    paddingVertical: 8,
  },
  checkBoxView: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  earnedTxtView: {
    backgroundColor: '#fff',
    width: '100%',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  applyRewardTxt: {
    fontSize: 13,
    color: '#292929',
    // marginLeft: 10,
    flexWrap: 'wrap',
    width: '95%',
  },
  rewardsGainedText: {
    paddingVertical: 2,
    fontSize: 12,
    color: colors.LightSlateGrey,
  },
  paymentHeading: {
    color: '#282828',
    paddingHorizontal: 8,
    paddingVertical: 5,
    fontSize: 14,
  },
  totalText: {
    color: '#28282880',
    fontSize: 14,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  disabled: {
    opacity: 0.5,
  },
  alternate_mobile_field_wrapper: {
    padding: 10,
  },
  alternate_mobile_message_wrapper: {
    marginBottom: 10,
  },
  alternate_mobile_message: {
    color: '#f4433680',
    fontSize: 10,
  },
  alternate_mobile_button: {
    color: SecondaryColor,
    fontSize: 12,
    textDecorationLine: 'underline',
  },
  buttonNotchIssue: {
    marginBottom: 20,
  },
});
