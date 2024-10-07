import {StyleSheet, Platform} from 'react-native';
import {SecondaryColor, DeviceWidth} from '@config/environment';
import colors from '@config/colors';

export default styles = StyleSheet.create({
  MainModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
  },
  ModalContainer: {
    width: '95%',
    backgroundColor: 'white',
    alignSelf: 'center',
    borderRadius: 8,
  },
  underContainer: {
    width: '90%',
    alignSelf: 'center',
  },
  Header: {
    marginTop: '1.5%',
    width: '100%',
    borderBottomWidth: 5,
    // paddingLeft: 15,
    flexDirection: 'row',
    borderBottomColor: colors.HexColor,
    justifyContent: 'space-between',
  },
  HeaderText: {
    fontSize: 18,
    fontWeight: '700',
  },
  closeIconView: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    position: 'absolute',
    marginLeft: '94%',
  },
  closeIcon: {fontSize: 18, color: '#2b79ac'},
  checkServiceAvailiblity: {
    marginTop: '2%',
  },
  serviceText: {
    fontSize: 13.5,
    fontWeight: 'bold',
    marginLeft: 2,
    marginBottom: 5,
  },
  checkServiceInput: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
    width: '100%',
    justifyContent: 'center',
  },
  CheckServiceInputField: {
    borderWidth: 0.5,
    borderColor: colors.borderColor,
    paddingLeft: 10,
    height: 40,
    width: DeviceWidth - 165,
    padding: 4,
    marginHorizontal: 2,
    fontSize: 14,
    marginRight: 10,
    borderRadius: 3,
  },
  CheckServiceButton: {
    width: 100,
    height: 38,
    elevation: 4,
    backgroundColor: SecondaryColor,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  CheckServiceButtonText: {
    color: '#fff',
  },
  pincodeView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
  },
  MUIcon: {
    paddingRight: 8,
  },
  pincodeCheckTexts: {
    color: '#1c60dc',
  },
  orView: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: '1.5%',
  },
  orTxt: {fontSize: 15, color: '#aaa', fontWeight: '700'},
  addressBoxx: {
    width: 180,
    margin: 10,
    borderRadius: 6,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    borderWidth: 0.3,
    borderColor: 'grey',
  },
  shadoww: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: Platform.OS == 'android' ? 3 : 1.5,
    },
    shadowOpacity: 0.35,
    shadowRadius: 2,
    elevation: Platform.OS == 'android' ? 3 : 1,
  },
  addressSubView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  addressIconMainView: {width: '15%', height: 50, top: 5},
  linkTextt: {
    textDecorationLine: 'underline',
    // color: '#2a5db0',
    color: colors.blueColor,
    fontWeight: 'bold',
  },
  loginView: {
    marginTop: '2%',
  },
  countryPicker: {
    width: '100%',
    alignSelf: 'center',
    borderWidth: 0.5,
    borderColor: 'grey',
    marginBottom: '3%',
  },
  pinError: {
    color: 'red',
  },

  //extraaaaaaa modelll

  modalWrapper: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#fff',
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 20,
    paddingRight: 20,
    borderTopColor: '#ddd',
    borderWidth: 0.5,
    shadowColor: '#bfbfbf',
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    elevation: 1,
    zIndex: 2,
  },
  modalCloseButton: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 10,
    paddingRight: 8,
    borderRadius: 12,
    backgroundColor: SecondaryColor,
    color: '#fff',
    textAlign: 'center',
    width: 130,
    marginTop: 10,
  },
  expiryInfohead: {
    borderWidth: 1,
    borderColor: '#ddd',
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  info_text: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    textDecorationLine: 'underline',
    color: '#2a5db0',
  },
  iButton: {
    paddingLeft: 5,
    paddingTop: 3,
  },
  GroupHeadText: {
    marginRight: 5,
  },
  MainViewRetun: {
    flexDirection: 'row',
  },
  dotView: {
    paddingRight: '2%',
  },
});
