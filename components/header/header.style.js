import {Platform, StyleSheet} from 'react-native';
import {
  SecondaryColor,
  HeaderHeight,
  PrimaryTextColor,
  DeviceWidth,
} from '@config/environment';

let platformContainerStyles;

if (Platform.OS === 'ios') {
  platformContainerStyles = {};
} else {
  platformContainerStyles = {
    elevation: 4,
  };
}

export default (styles = StyleSheet.create({
  headerWrapper: {
    height: HeaderHeight,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: SecondaryColor,
    ...platformContainerStyles,
  },
  backIconWrapper: {
    marginRight: 20,
    paddingTop: 2,
    paddingHorizontal: 5,
  },
  drawerWrapper: {},
  logo: {
    color: '#fff',
    fontSize: 20,
  },
  searchIconWrapper: {
    height: HeaderHeight,
    marginRight: 15,
    justifyContent: 'center',
  },
  cartWrapper: {
    height: HeaderHeight,
    paddingTop: 7,
    justifyContent: 'center',
  },
  cartCountWrapper: {
    position: 'absolute',
    paddingLeft: 3,
    paddingRight: 3,
    right: 2,
    top: 8,
    zIndex: 1,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 5,
  },
  cartCount: {
    color: PrimaryTextColor,
    fontSize: 10,
  },
  rightIcon: {
    color: PrimaryTextColor,
  },
  rightIconsWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  leftIconsWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  heading: {
    color: '#fff',
    fontSize: 20,
  },
  headerWrapperSearch: {
    flex: 0,
    alignItems: 'center',
    backgroundColor: SecondaryColor,
    flexDirection: 'row',
    padding: 5,
    paddingTop: 0,
    ...platformContainerStyles,
  },
  shopByCategory: {
    width: 90,
    height: 38,
    marginRight: 10,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    paddingLeft: 15,
    borderRadius: 5,
  },
  shopByCategoryText: {
    color: '#a9a9a9',
    textAlign: 'left',
    fontSize: 13,
  },
  categoryText: {
    color: '#969595',
    fontSize: 15,
    fontWeight: 'bold',
    lineHeight: 17,
  },
  inputField: {
    height: 38,
    width: DeviceWidth - 90 - 20,
    flexDirection: 'row',
    borderWidth: 0,
    backgroundColor: '#fff',
    justifyContent: 'flex-start',
    alignItems: 'center',
    borderRadius: 5,
    paddingLeft: 5,
  },
  inputFieldPlaceholder: {
    color: '#a9a9a9',
    fontSize: 15,
    fontWeight: '400',
  },
  searchIcon: {
    marginRight: 2,
  },
}));
