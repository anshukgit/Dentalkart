import {StyleSheet} from 'react-native';
import {DeviceWidth} from '@config/environment';

export default styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 2,
    elevation: 2,
    shadowColor: '#bfbfbf',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    height: 540,
    backgroundColor: '#56ccf2',
    marginBottom: 15,
  },
  categoryTitleWrapper: {
    position: 'absolute',
    top: 15,
    flex: 3,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTitle: {
    flex: 2,
    paddingLeft: 10,
  },
  categoryName: {
    fontSize: 18,
    color: '#fff',
  },
  categoryButtonWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingRight: 10,
  },
  categoryButton: {
    backgroundColor: '#fff',

    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#bfbfbf',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    borderRadius: 3,
    width: 70,
  },
  categoryButtonText: {
    padding: 5,
    color: '#AAAAAA',
  },
  productsCard: {
    backgroundColor: '#fff',
    position: 'absolute',
    top: 53,
    height: 'auto',
    flex: 1,
    zIndex: 2,
    width: DeviceWidth - 20,
    marginLeft: 10,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#bfbfbf',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,

    borderColor: '#a9cbde',
  },
  productBox: {
    width: (DeviceWidth - 20) / 2,
    height: 'auto',
    alignItems: 'center',

    // backgroundColor: 'red',
  },
  productBoxBorderRight: {
    borderRightWidth: 0.5,
    borderColor: '#a9cbde',
  },
  productBoxBorderBottom: {
    borderBottomWidth: 0.5,
    borderColor: '#a9cbde',
  },
  priceWrapper: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  productImageWrapper: {
    padding: 5,
  },
  productImage: {
    width: (DeviceWidth - 35) / 2,
    height: 120,
    resizeMode: 'contain',
  },
  newPrice: {
    marginRight: 5,
    textDecorationLine: 'line-through',
    color: 'rgb(170,170,170)',
  },
  specialPrice: {
    color: 'rgb(44, 188, 97)',
    fontSize: 15,
  },
  discount: {
    borderRadius: 50,
    borderColor: 'rgb(170,170,170)',
    borderWidth: 0.5,
    marginLeft: 2,
    color: 'rgb(170,170,170)',
    fontSize: 12,
    padding: 1,
    position: 'absolute',
    top: 5,
    right: 5,
  },
  productNameWrapper: {
    flexDirection: 'row',
    paddingBottom: 2,
    marginHorizontal: 12,
  },
  productName: {
    flex: 1,
    textAlign: 'center',
    color: 'rgb(0,0,0)',
  },
  productDescriptionWrapper: {
    flexDirection: 'row',
    paddingBottom: 2,
    paddingLeft: 5,
    paddingRight: 5,
  },
  productDescription: {
    flex: 1,
    textAlign: 'center',
    color: '#aaaaaa',
  },
  rewardWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,

    // marginBottom: 25,
  },
  rewardIcon: {
    width: 18,
    height: 18,
    marginRight: 3,
  },
  rewardPoints: {
    color: '#282828',
  },
  reviewWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  pricingWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
  },
  ratingWrapper: {
    backgroundColor: '#37be5f',
    width: 35,
    marginRight: 4,
    padding: 1,
    borderRadius: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    fontSize: 12,
  },
  rating: {
    color: '#fff',
  },
  star: {
    width: 15,
    marginLeft: 4,
    paddingRight: 2,
    color: '#fff',
    fontSize: 12,
  },
  numbers: {
    fontSize: 12,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    color: '#878787',
  },
  enjoyFreeProduct: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '86%',
    alignItems: 'center',
  },
  container: {
    height: 270,
    // borderBottomWidth: 0.3,
    // borderColor: '#a9cbde',
    // borderLeftWidth: 0.3,
    shadowColor: '#bfbfbf',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    // r, {borderColor: 'transparent'}
  },
});
