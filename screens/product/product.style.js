import {StyleSheet} from 'react-native';
import {PrimaryColor} from '@config/environment';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import colors from '../../config/colors';

export default styles = StyleSheet.create({
  productGroupedPriceInfoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  rewardWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  rewardIcon: {
    width: 20,
    height: 20,
    marginRight: 3,
  },
  rewardPoints: {
    color: '#282828',
    fontSize: 15,
  },
  closeIconContainer: {
    position: 'absolute',
    width: wp('10%'),
    height: wp('10%'),
    right: wp('5%'),
    top: hp('5%'),
    borderRadius: wp('5%'),
    zIndex: 20,
    backgroundColor: colors.grey,
    justifyContent: 'center',
    alignItems: 'center',
  },
  attachmentsContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  attachmentsBoxContainer: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#f3943d',
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignItems: 'center',
    borderRadius: 20,
    marginLeft: 8,
  },
  attachmentsTitleText: {
    marginLeft: 10,
    color: '#f2631d',
  },
  reviewsWrapper: {
    flexDirection: 'row',
    marginVertical: 4,
  },
  ratingBoxWrapper: {
    flexDirection: 'row',
    backgroundColor: '#1abf46',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
    paddingLeft: 3,
    paddingRight: 3,
  },
  ratingBox: {
    color: '#fff',
    marginRight: 2,
    fontSize: 12,
  },
  ratingBoxIcon: {
    color: '#fff',
    fontSize: 12,
  },
  reviewsQty: {
    marginLeft: 5,
    fontSize: 12,
    color: '#21212180',
  },
  headerText: {
    lineHeight: 20,
    fontWeight: '600',
    fontSize: wp('4%'),
  },
  descreptionText: {
    lineHeight: 20,
    fontSize: wp('3.8%'),
    color: '#7C8697',
  },
  mainPriceText: {
    lineHeight: 20,
    fontWeight: '400',
    marginRight: 10,
  },
  cutPrice: {
    lineHeight: 20,
    color: '#7C8697',
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    marginRight: 10,
  },
  precentageText: {
    lineHeight: 20,
    fontWeight: '600',
  },
  allItemsContainer: {
    width: '95%',
    alignSelf: 'center',
    backgroundColor: '#DCDCDC',
    paddingTop: 1,
    marginBottom: 10,
  },
  itemContainer: {
    marginBottom: 1,
    width: '99.5%',
    backgroundColor: 'white',
    alignSelf: 'center',
    flex: 1,
    flexDirection: 'row',
    paddingVertical: hp('1%'),
    paddingHorizontal: wp('2%'),
  },
  itemImage: {
    width: wp('20%'),
    minHeight: hp('8%'),
    height: '100%',
  },
  itemDescriptionContainer: {
    flex: 1,
    paddingLeft: wp('2%'),
  },
  checkboxContainer: {
    paddingLeft: 12,
    justifyContent: 'center',
  },
  separator: {
    backgroundColor: '#f3f3f3',
    height: 10,
  },
  frequentPriceContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  frequentTotalText: {
    fontWeight: '500',
    fontSize: wp('4.5%'),
  },
  frequentButtonContainer: {
    backgroundColor: PrimaryColor,
    paddingHorizontal: wp('5%'),
    height: hp('5%'),
    borderRadius: hp('1%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  frequentButtonText: {
    fontWeight: '500',
    fontSize: wp('4%'),
    color: '#FFF',
  },
  frequentAllImageContainer: {
    flexDirection: 'row',
    // justifyContent: "space-between",
    alignItems: 'center',
    flex: 0.9,
    marginRight: 10,
  },
  frequentAllImageDropDownContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 0.1,
  },
  frequentHeadingContainer: {
    width: '95%',
    alignSelf: 'center',
    marginVertical: hp('1%'),
  },
  frequentHeadingText: {
    fontSize: wp('4%'),
    fontWeight: '400',
  },

  //Share Refer Modal===========
  shareReferModalView: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareReferModalContainer: {
    backgroundColor: 'white',
    width: '90%',
    borderRadius: 8,
    padding: 10,
  },
  shareTitle: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
  },
  shareTitleText: {
    width: '90%',
    fontSize: 15,
    fontWeight: '600',
    color: 'black',
  },
  shareModalCloseIcon: {
    width: 20,
    height: 20,
    marginBottom: 32,
  },
  referLinkView: {
    width: '100%',
    height: 40,
    borderWidth: 0.5,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // borderColor: '#F8931D',
    paddingHorizontal: 8,
    marginVertical: 15,
    // backgroundColor: 'red',
  },
  copyImg: {
    width: 20,
    height: 20,
  },
  referLink: {
    color: 'black',
    fontSize: 15,
  },
  socialIconsView: {
    marginTop: 10,
    flexDirection: 'row',
    // backgroundColor: 'red',
    width: '90%',
    justifyContent: 'space-around',
    alignSelf: 'center',
  },
  socialIcons: {
    // color: '#F8931D',
    color: '#ef5a24',
    // width: 20,
    // height: 20,
  },
  customImportedIcon: {
    width: 27,
    height: 27,
    tintColor: '#F8931D',
  },
});
