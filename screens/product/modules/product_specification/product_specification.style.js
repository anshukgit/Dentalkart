import {StyleSheet} from 'react-native';
import {DeviceWidth, PrimaryColor} from '@config/environment';

export default styles = StyleSheet.create({
  productDetailsContainer: {
    borderTopWidth: 1,
    borderColor: '#d6d7da',
    backgroundColor: '#fff',
    elevation: 1.5,
    shadowColor: '#bfbfbf',
    shadowOffset: {
      height: 1,
      width: 1,
    },
    shadowOpacity: 1,
    shadowRadius: 1,
    marginBottom: 10,
  },
  productDetailsWrapper: {
    padding: 10,
    paddingTop: 5,
  },
  productNameWrapper: {
    width: DeviceWidth - 70,
    marginBottom: 5,
  },
  productName: {
    fontSize: 15,
  },
  shortDescriptionWrapper: {
    marginBottom: 5,
  },
  shortDescription: {
    fontSize: 12,
    color: '#21212180',
  },
  productNewpriceWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currency: {
    fontSize: 12,
  },
  productStartingAtprice: {
    fontSize: 13,
    color: '#21212180',
  },
  productNewprice: {
    fontSize: 25,
    color: '#212121',
    marginRight: 5,
  },
  productPriceInfoWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  productOldprice: {
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
    fontSize: 12,
    color: '#21212180',
    marginRight: 5,
    color: '#bbbbbb',
  },

  productDiscount: {
    color: 'green',
    fontSize: 13,
  },
  reviewsWrapper: {
    flexDirection: 'row',
    marginLeft: 7,
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
  availablityWrapper: {
    backgroundColor: 'red',
    position: 'absolute',
    top: 5,
    right: 5,
    paddingVertical: 1,
    paddingHorizontal: 5,
    borderRadius: 20,
  },
  soldOutText: {
    fontSize: 10,
    color: '#fff',
  },
  tierPrice: {
    fontSize: 12.5,
    color: '#00a324',
    marginLeft: 5,
  },
  tierPriceWrapper: {
    marginBottom: 5,
  },
  leftInStockWrapper: {
    marginBottom: 5,
  },
  leftInStock: {
    fontSize: 13,
    color: PrimaryColor,
  },
  buttonsWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: DeviceWidth,
  },
  shareButton: {
    padding: 5,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#efefef',
    flexDirection: 'row',
    // marginTop: 5,
    width: DeviceWidth / 2,
  },
  shareButtonText: {
    color: '#212121',
    marginLeft: 5,
  },
  rewardWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  rewardIcon: {
    width: 18,
    height: 18,
    marginRight: 3,
  },
  rewardPoints: {
    color: '#282828',
  },
  deliveryFee: {
    fontSize: 12,
    color: 'blue',
  },
  diractionView: {flexDirection: 'row', alignItems: 'center', marginTop: 5},
  imageOffer: {width: 16, height: 15},
  availableText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '400',
    marginLeft: 3,
  },
  boxOffer: {
    backgroundColor: '#d8ffdccc',
    borderWidth: 0.5,
    borderColor: '#2A7A21',
    borderRadius: 8,
    padding: 4,
    paddingHorizontal: 4,
    marginTop: 4,
    flex: 1,
    // width: 'auto',
    // width: 365,
    // maxWidth: '70%',
    // alignItems: 'center',
    // width: '36%',
  },
  dot: {fontSize: 18, color: '#007626'},
  discrapton: {
    fontSize: 12,
    color: '#007626',
    textAlign: 'left',
    marginLeft: 4,
  },
});
