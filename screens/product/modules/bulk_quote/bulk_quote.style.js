import {StyleSheet} from 'react-native';
import {DeviceWidth, SecondaryColor, PrimaryColor} from '@config/environment';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

export default styles = StyleSheet.create({
  textfieldWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 4,
    borderColor: '#cccc',
  },
  textfieldIconContainer: {
    height: 40,
    paddingHorizontal: wp('1.5%'),
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#cccc',
  },
  textfield: {
    height: 40,
    borderRadius: 4,
    marginLeft: 5,
    marginRight: 5,
    padding: 4,
    // borderWidth: 0.5,
    // borderColor: '#cccc',
  },
  placeholderColor: {
    borderColor: '#787878',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'orange',
    paddingHorizontal: wp('6%'),
    margin: 5,
    alignItems: 'center',
    height: 40,
    borderRadius: hp('1%'),
  },
  text: {
    color: 'white',
    padding: 5,
    fontWeight: 'bold',
  },
  errortext: {
    fontSize: 12,
    color: 'red',
    marginLeft: 5,
    padding: 5,
  },
  footerContainerWrapper: {
    backgroundColor: '#f3f3f3',
    paddingBottom: 10,
  },
  footerContainer: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  footerHeading: {
    marginBottom: 8,
  },
  quoteButton: {
    height: 40,
    backgroundColor: '#0061d5',
    padding: 4,
    borderRadius: 4,
  },
  quoteText: {
    color: 'white',
    fontWeight: 'bold',
    padding: 7,
    textAlign: 'center',
  },
  labelText: {
    fontSize: 15,
    color: colors.StormGrey,
    marginHorizontal: 5,
    marginBottom: 5,
  },
  AsteriskIcon: {color: 'red', fontSize: 15},
});
