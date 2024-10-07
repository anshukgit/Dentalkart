import {StyleSheet} from 'react-native';
import {DeviceWidth, DeviceHeight} from '@config/environment';

export default (styles = StyleSheet.create({
  pickerWrapper: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: 'auto',
    height: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 2,
    borderColor: '#b9b9b9',
    shadowColor: 'black',
    paddingLeft: 10,
    paddingRight: 10,
    shadowOffset: {width: 0, height: 0},
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 1,
    shadowColor: '#bfbfbf',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  dropdownIcon: {
    color: '#acacac',
  },
  modalWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    height: DeviceHeight,
    width: DeviceWidth,
  },
  modalOverlay: {
    backgroundColor: '#000',
    height: DeviceHeight,
    width: DeviceWidth,
    opacity: 0.2,
    position: 'absolute',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 5,
    height: DeviceHeight / 2.1,
    width: DeviceWidth / 1.4,
  },
  listWrapper: {
    borderBottomWidth: 1,
    borderColor: '#dfdfdf',
    paddingLeft: 10,
    justifyContent: 'center',
    height: DeviceHeight / 2.1 / 10,
  },
  disabledListWrapper: {
    backgroundColor: '#f4f4f4',
    borderBottomWidth: 1,
    borderColor: '#dfdfdf',
    paddingLeft: 10,
    justifyContent: 'center',
    height: DeviceHeight / 2.1 / 10,
  },
  lastTitle: {
    borderBottomWidth: 0,
  },
  disabledListText: {
    color: '#dfdbdb',
  },
  selectedText: {
    fontSize: 12,
  },
  extraPrice: {
    backgroundColor: '#1db31d',
    marginLeft: 5,
    borderRadius: 5,
    paddingTop: 0,
    paddingLeft: 5,
    paddingBottom: 0,
    paddingRight: 5,
    color: '#fff',
  },
}));
