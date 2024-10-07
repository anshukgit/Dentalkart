import {StyleSheet, Platform} from 'react-native';
import {DeviceWidth, SecondaryColor, PrimaryColor} from '@config/environment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default styles = StyleSheet.create({
  featuredBrandWrapper: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  topText: {
    fontWeight: 'bold',
    marginBottom: 5,
    paddingTop: 10,
  },
  imageWrapper: {
    width: '25%',
    margin: 'auto',
    marginBottom: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageBox: {
    borderRadius: 50,
    borderColor: '#ddd',
    borderWidth: 0.5,
    shadowColor: '#fff',
    shadowRadius: 0,
    backgroundColor: '#fff',
    width: 80,
    height: 80,
    flex: 1,
    shadowOpacity: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  HomeExtraMargin: {
    marginRight: 10,
  },
  image: {
    width: 60,
    height: 37.5,
    resizeMode: 'contain',
  },
  bottomText: {
    fontWeight: 'bold',
    marginTop: 4,
    textAlign: 'center',
  },
  assetsWrapper: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  assetsImageBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetsImage: {
    width: 25,
    height: 25,
    marginRight: 5,
  },
  brandButton: {
    borderRadius: 4,
    height: 30,
    width: 120,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: SecondaryColor,
  },
  BrandText: {
    textAlign: 'center',
    color: '#fff',
  },
  TopBrandImageContainer: {
    width: wp('22%'),
    height: wp('22%'),
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: wp('2%'),
    borderColor: '#ddd',
  },
  TopBrandImage: {
    width: wp('15%'),
    height: wp('15%'),
  },
});
