import {StyleSheet, Platform} from 'react-native';
import {DeviceWidth, SecondaryColor, PrimaryColor} from '@config/environment';
import colors from '@config/colors';
export default sttyles = StyleSheet.create({
  productDetailActionWrapper: {
    backgroundColor: '#fff',
    padding: 1,
    // borderRadius: 3,
    marginTop: 5,
    marginBottom: 5,
    elevation: 1,
    shadowColor: '#bfbfbf',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  productWrapper: {
    backgroundColor: '#fff',
    flexDirection: 'row',
  },
  productDetailWrapper: {
    paddingLeft: 10,
    paddingTop: 10,
    paddingRight: 10,
    justifyContent: 'space-between',
  },

  priceWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    marginRight: 5,
  },
  newprice: {
    marginRight: 5,
    color: '#343434',
    fontSize: 15,
  },
  deliveryFee: {
    fontSize: 12,
    color: 'blue',
    marginTop: 2.5,
  },
  priceEach: {
    color: '#21212150',
    fontSize: 12,
  },
  productErrorText: {
    color: '#ed4949',
    fontSize: 12,
    width: DeviceWidth - 140,
  },
  discount: {
    color: '#00a324',
    fontSize: 12,
  },
  productImageWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  cartProductImage: {
    width: '100%',
    height: '100%',
  },
  productNameWrapper: {
    flexDirection: 'row',
    width: DeviceWidth - 140,
  },
  productName: {
    flex: Platform.OS === 'ios' ? null : 1,
    fontSize: 14,
    color: '#212121',
    marginRight: 5,
  },
  PriceDetailWrapper: {
    backgroundColor: '#fff',
    padding: 1,
    borderRadius: 3,
    paddingBottom: 5,
    marginTop: 5,
    marginBottom: 5,
    marginRight: 5,
    marginLeft: 5,
    elevation: 1,
    shadowColor: '#bfbfbf',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  PriceDetailHeadingWrapper: {
    height: 30,
    justifyContent: 'center',
    borderBottomWidth: 0.5,
    borderColor: '#c9c9c9',
    paddingLeft: 5,
  },
  tierTextWrapper: {
    width: DeviceWidth / 1.5 - 30,
  },
  tierText: {
    color: '#00a324',
    fontSize: 12,
  },
  quantityWrapper: {
    // marginTop: 7
  },
  productActions: {
    // paddingLeft: 5,
    // paddingRight: 5,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  productActionWrapper: {
    // borderTopWidth: Platform.OS === 'ios' ? 1 :0,
    borderColor: '#c9c9c9',
    flexDirection: 'row',
    justifyContent: 'center',

    // width:'30%'
  },
  productRemoveAction: {
    height: Platform.OS === 'ios' ? 30 : null,
    // flexDirection: 'row',
    // width: DeviceWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#212121',
  },
  productWishlistAction: {
    height: Platform.OS === 'ios' ? 30 : null,
    flexDirection: 'row',
    width: DeviceWidth / 2,
    borderRightWidth: Platform.OS === 'ios' ? 1 : 0.2,
    borderColor: '#c9c9c9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  PriceDetailHeading: {
    fontSize: 14,
    color: '#21212180',
  },
  detailWrapper: {
    marginTop: 10,
  },
  couponWrapper: {
    alignItems: 'center',
    paddingVertical: 3,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderColor: '#ddd',
  },
  couponTextWrapper: {
    paddingLeft: 10,
  },
  couponButtonText: {
    color: SecondaryColor,
  },
  couponText: {
    color: '#1fa62d',
    fontSize: 13,
  },
  totalAmountWrapper: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 2,
    paddingBottom: 5,
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderColor: '#c9c9c9',
  },
  totalAmountTitle: {
    fontSize: 14,
    color: '#212121',
    fontWeight: 'bold',
  },
  totalAmountSubTitle: {
    fontSize: 12,
    color: '#21212180',
  },
  totalAmountValue: {
    fontSize: 14,
    color: '#212121',
    fontWeight: 'bold',
  },
  detail: {
    flexDirection: 'row',
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    justifyContent: 'space-between',
  },
  detailTitle: {
    fontSize: 13,
    color: '#212121',
  },
  detailValue: {
    fontSize: 13,
    color: '#212121',
  },
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
  continueButtonText: {
    color: '#fff',
    fontSize: 18,
  },
  rewardPointWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  rewardImage: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
  rewardPoint: {
    color: '#282828',
    fontSize: 16,
  },
  rewardsContainer: {
    backgroundColor: '#fff',
    elevation: 1,
    padding: 10,
    margin: 5,
    marginBottom: 0,
    borderRadius: 3,
    shadowColor: '#bfbfbf',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  rewardsTitleWrapper: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#c9c9c9',
    paddingBottom: 4,
  },
  rewardsTitle: {
    color: '#282828',
    fontSize: 14,
    paddingBottom: 7,
    marginTop: 4,
  },
  sliderWrapper: {
    flexDirection: 'row',
    paddingVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  slider: {
    width: DeviceWidth * 0.7,
  },
  rewardsRate: {
    color: '#28282880',
    alignSelf: 'center',
    paddingBottom: 5,
    fontSize: 12,
  },
  rewardsTotalBenefits: {
    color: PrimaryColor,
    fontSize: 15,
    paddingBottom: 8,
    textAlign: 'center',
  },
  applyRewardsButton: {
    margin: 5,
    marginHorizontal: 50,
    borderColor: SecondaryColor,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 3,
  },
  applyRewardsButtonText: {
    color: SecondaryColor,
    textAlign: 'center',
  },
  rewardsToEarnWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardIcon: {
    width: 23,
    height: 23,
    marginRight: 5,
  },
  rewardsToEarnText: {
    color: '#282828',
    fontSize: 15,
  },
  rewardsGainedText: {
    color: SecondaryColor,
    fontSize: 15,
    paddingVertical: 5,
  },
  rewardsGainedPrice: {
    color: 'green',
    fontSize: 15,
  },
  rewardsGainedInfo: {
    color: '#28282880',
    fontSize: 10,
  },
  useRewardsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rewardsInUseWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#ddd',
    height: 25,
    width: 50,
    padding: 4,
    marginHorizontal: 2,
    fontSize: 13,
  },
  disabled: {
    opacity: 0.5,
  },
  optionsWrapper: {
    flexDirection: 'row',
  },
  option: {
    color: '#28282880',
    fontSize: 12,
    marginRight: 3,
  },
  rewardWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  rewardIcon: {
    width: 18,
    height: 18,
    marginRight: 3,
  },
  rewardPoints: {
    color: '#282828',
    fontSize: 13,
    left: 3,
  },
  freeProductQty: {
    color: '#282828',
    fontSize: 13,
    fontWeight: '500',
    paddingVertical: 5,
  },
  cartItemMainView: {
    width: '100%',
    backgroundColor: colors.HexColor,
    paddingBottom: 6,
  },
  freeContinuer: {
    backgroundColor: '#E8F4EC',
    width: 27,
    height: 131,
    justifyContent: 'center',
  },
  freeText: {
    transform: [{rotate: '270deg'}],
    width: 39,
    height: 16,
    color: '#388E3C',
    fontWeight: '500',
    fontSize: 14,
    right: 10,

    // backgroundColor: 'red',
  },
  cartItemSubView: {
    width: '100%',
    minHeight: 115,
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 0,
  },
  cartItemErrorView: {
    width: '100%',
    minHeight: 20,
    backgroundColor: colors.white,
    paddingHorizontal: 15,
    alignItems: 'flex-start',
    flexDirection: 'column',
    paddingVertical: 5,
  },
  cartItemImg: {
    width: '25%',
    height: 110,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.otpBorder,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 5,
  },
  priceText: {fontSize: 18, color: colors.blueColor, fontWeight: 'bold'},
  stockOutBtn: {
    width: 90,
    height: 30,
    backgroundColor: colors.orangeBtn,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plusBtnView: {
    width: 25,
    height: 25,
    borderRadius: 3,
    backgroundColor: colors.PattensBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countNumberView: {
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartItemOfferView: {width: '100%', justifyContent: 'center'},
  modalMainView: {
    width: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stockOutModalEmptyView: {
    flex: 0.25,
    width: '100%',
    backgroundColor: '#253541',
    opacity: 0.5,
  },
  StockOutProView: {
    height: 160,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  StockOutProimgView: {
    width: '23%',
    height: 120,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.otpBorder,
  },
  StockOutDisView: {
    width: '65%',
    height: 120,
    justifyContent: 'center',
    paddingLeft: 20,
  },
  StockOutDisText: {fontSize: 15, color: colors.black, height: 25},
  StockOutText: {
    height: 25,
    color: colors.black,
    alignContent: 'center',
    fontSize: 17,
  },
  ItemErrorText: {
    height: 'auto',
    color: colors.red,
    alignContent: 'center',
    paddingLeft: 8,
    fontSize: 14,
  },
  StockOutmodalSubView: {
    height: 100,
    backgroundColor: colors.HexColor,
    paddingHorizontal: 20,
    paddingVertical: 8,
    justifyContent: 'space-around',
  },
  similarProductMainView: {
    height: 180,
    paddingVertical: 4,
    backgroundColor: colors.HexColor,
  },
  similarProductSubView: {
    height: '100%',
    backgroundColor: colors.white,
    paddingLeft: 20,
    paddingVertical: 5,
    justifyContent: 'center',
  },
  youalsoLikeText: {
    paddingVertical: 7,
    paddingHorizontal: 20,
    backgroundColor: colors.HexColor,
    alignContent: 'center',
    top: -3,
  },
  notifyText: {color: colors.blueColor, fontSize: 18},
  notifyView: {
    flex: 0.4,
    height: '100%',
    backgroundColor: colors.AliceBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },
  norecomendationsView: {
    flex: 0.6,
    height: '100%',
    backgroundColor: colors.orangeBtn,
    justifyContent: 'center',
    alignItems: 'center',
  },
  StockOutFooterBtnView: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  unavilableText: {fontSize: 13, color: colors.white},
  unavilableView: {
    width: 130,
    height: 35,
    borderRadius: 20,
    backgroundColor: '#FF4F4F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerBtnView: {
    height: 55,
    marginVertical: 9,
    backgroundColor: colors.SummerSky,
    justifyContent: 'center',
    alignItems: 'center',
  },
  priceIcon: {fontSize: 16, color: colors.blueColor},
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: Platform.OS == 'android' ? 3 : 1.5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: Platform.OS == 'android' ? 3 : 1,
  },
  similarProductMappingMainView: {
    width: 110,
    height: '95%',
    marginTop: 5,
    marginRight: 8,
  },
  similarProductImg: {
    height: '40%',
    width: '90%',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.HexColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dessView: {height: '40%', width: '100%', marginTop: 5},
  proSmallDescription: {fontSize: 12, color: '#001733', paddingVertical: 3},
  similarProductPriceView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: 5,
    paddingLeft: 10,
  },
  rupeeIconView: {
    width: '40%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rupeeIcon: {
    fontSize: 9,
    color: colors.Sundown,
    textDecorationLine: 'line-through',
  },
  closeIcon: {
    fontSize: 16,
    color: colors.red,
    borderRadius: 30,
  },
  disPrice: {
    fontSize: 12,
    color: colors.Sundown,
    textDecorationLine: 'line-through',
  },
  poductDessView: {width: '75%', minHeight: 110, paddingHorizontal: 5},
  poductname: {
    fontSize: 14.5,
    color: colors.black,
    fontWeight: '600',
    width: '90%',
  },
  qtyBtnView: {
    width: '90%',
    height: 40,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingBottom: 5,
  },
  stockOutBtnView: {width: '65%', height: '100%', justifyContent: 'flex-end'},
  heartBtnView: {
    width: 30,
    height: 30,
    borderRadius: 4,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 3,
    marginRight: 5,
  },
  pice: {fontSize: 15, color: colors.blueColor},
  picerupeeIcon: {fontSize: 10, color: colors.blueColor},
  proName: {fontSize: 15},
  offerView: {fontSize: 12, color: colors.DarkPastelGreen},
  stockOutTxt: {fontSize: 13, color: colors.white},
  heartIcon: {fontSize: 20, color: '#21212180'},
  deleteImg: {fontSize: 19, color: '#7C8697'},
  modalSubView: {flex: 0.75, width: '100%', backgroundColor: colors.white},
  eitherTxt: {
    color: colors.LightSlateGrey,
    alignContent: 'center',
    fontSize: 14,
  },
  dispersible: {fontSize: 13, color: colors.LightSlateGrey},
  norecomendationTxt: {color: colors.white, fontSize: 15},
  removeBtnTxt: {color: colors.white, fontSize: 17},
  outOfStockImgView: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockTextView: {
    position: 'absolute',
    paddingHorizontal: 8,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  outOfStockTxt: {
    fontSize: 12,
    color: 'red',
    textAlign: 'center',
    fontWeight: 'bold',
    flexShrink: 1,
  },
  freeContinuer: {
    backgroundColor: '#E8F4EC',
    width: 27,
    minHeight: 120,
    justifyContent: 'center',
  },
  freeText: {
    transform: [{rotate: '270deg'}],
    width: 39,
    height: 16,
    color: '#388E3C',
    fontWeight: '500',
    fontSize: 14,
    right: 10,

    // backgroundColor: 'red',
  },

  reviewsWrapper: {
    flexDirection: 'row',
    marginTop: 5,
    marginBottom: 5,
  },
  ratingBoxWrapper: {
    flexDirection: 'row',
    // backgroundColor: '#1abf46',
    backgroundColor: '#637898',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    paddingLeft: 3,
    paddingRight: 3,
  },
  ratingBox: {
    // backgroundColor: '#37BE3C',
    color: '#fff',
    marginRight: 2,
    fontSize: 12,
    marginLeft: 2,
  },
  ratingBoxIcon: {
    color: '#fff',
    fontSize: 12,
  },
  star: {
    color: '#fff',
    fontSize: 12,
  },
});
