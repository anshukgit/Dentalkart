import {StyleSheet, StatusBar} from 'react-native';
import {
  DeviceWidth,
  DeviceHeight,
  SecondaryColor,
  StatusBarHeight,
} from '@config/environment';

export default StyleSheet.create({
  categoryWrapper: {
    flex: 1,
    backgroundColor: '#fff',
    marginBottom: 10,
    height: DeviceHeight - 55 - StatusBarHeight,
  },
  categoryImage: {
    width: DeviceWidth - 20,
    height: (DeviceWidth * 238) / 790,
    resizeMode: 'contain',
    marginBottom: 5,
    alignSelf: 'center',
    borderRadius: 10,
  },
  categoryTitle: {
    paddingTop: 14,
    paddingBottom: 14,
    paddingLeft: 8,
    fontSize: 17,
    borderBottomWidth: 0.5,
    borderBottomColor: '#21212150',
    backgroundColor: '#ffffff',
  },

  filterSortContainer: {
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
    position: 'absolute',
    bottom: 0,
  },
  filterSortWrapper: {
    flexDirection: 'row',
  },
  filterButtonWrapper: {
    width: DeviceWidth / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterText: {
    fontSize: 15,
    color: '#212121',
  },
  sortButtonWrapper: {
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterButton: {
    backgroundColor: '#fff',
    width: DeviceWidth / 2,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 0.5,
    borderRightColor: '#5e5e5e',
    backgroundColor: '#ffffff',
    elevation: 1,
    shadowColor: '#bfbfbf',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  sortButton: {
    backgroundColor: '#fff',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
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
  sortButtonText: {
    color: '#212121',
    fontSize: 15,
  },

  modalHeader: {
    backgroundColor: SecondaryColor,
    height: 55,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIconWrapper: {
    margin: 20,
    paddingTop: 2,
    paddingHorizontal: 5,
  },
  headerHeading: {
    color: '#fff',
    fontSize: 20,
  },

  productTabsWrapper: {
    backgroundColor: '#fff',
    paddingTop: 5,
  },
  tabTagWrapper: {
    borderColor: '#ddd',
    borderWidth: 0.5,
    backgroundColor: '#fff',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tabTag: {
    fontSize: 13,
    color: SecondaryColor,
  },
  webViewWrapper: {
    flex: 1,
  },
  tabText: {
    padding: 10,
    fontSize: 12,
    color: '#212121',
    backgroundColor: '#efefef',
    height: 'auto',
    width: DeviceWidth,
  },
});
