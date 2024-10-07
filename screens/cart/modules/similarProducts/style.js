import {StyleSheet, Platform} from 'react-native';
import colors from '@config/colors';

const styles = StyleSheet.create({
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: Platform.OS == 'android' ? 3 : 1.5,
    },
    shadowOpacity: 0.35,
    shadowRadius: 2,
    elevation: Platform.OS == 'android' ? 3 : 1,
  },
  productMappingView: {
    width: 120,
    height: '95%',
    marginTop: 5,
    marginHorizontal: 8,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  productMappingImg: {
    height: '40%',
    width: '90%',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.HexColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dissVIew: {height: '40%', width: '100%', marginTop: 5, paddingHorizontal: 5},
  productDiss: {fontSize: 12, color: '#001733', paddingVertical: 3},
  productMappingPriceMainView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginVertical: 5,
    paddingLeft: 10,
  },
  dispriceView: {
    width: '40%',
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dispriceTxt: {
    fontSize: 12,
    color: colors.Sundown,
    textDecorationLine: 'line-through',
  },
  rupeeIcon: {
    fontSize: 9,
    color: colors.Sundown,
    textDecorationLine: 'line-through',
  },
});
export default styles;
