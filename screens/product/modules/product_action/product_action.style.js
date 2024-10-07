import {StyleSheet} from 'react-native';
import {DeviceWidth, SecondaryColor, PrimaryColor} from '@config/environment';

export default styles = StyleSheet.create({
  productActionWrapper: {
    height: 50,
    flexDirection: 'row',
    backgroundColor: '#fff',
    elevation: 10,
    shadowColor: '#bfbfbf',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  addToCartWrapper: {
    borderRadius: 5,
    paddingVertical: 15,
    width: DeviceWidth / 2 - 20,
    alignItems: 'center',
    backgroundColor: SecondaryColor,
  },
  buyNowContainer: {
    width: DeviceWidth / 2,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  borderLeft: {
    borderLeftWidth: 0.5,
    borderLeftColor: '#ddd',
  },
  buyNowWrapper: {
    borderRadius: 5,
    paddingVertical: 15,
    width: DeviceWidth / 2 - 20,
    alignItems: 'center',
    backgroundColor: PrimaryColor,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 11,
    lineHeight: 11,
  },
  actionButtonTextColor: {
    color: PrimaryColor,
  },
  disabled: {
    opacity: 0.5,
  },
  loader: {
    fontSize: 9,
  },
  requestPriceContainer: {
    flex: 1,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  requestPriceWrapper: {
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PrimaryColor,
  },
  buttonNotchIssue: {
    marginBottom: 10,
  },
  outlineButton: {
    backgroundColor: '#FFFF',
    borderWidth: 1,
    borderColor: PrimaryColor,
  },
});
