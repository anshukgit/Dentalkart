import {StyleSheet, Platform} from 'react-native';
import {DeviceWidth, SecondaryColor, PrimaryColor} from '@config/environment';

export default styles = StyleSheet.create({
  AllBrandsContainer: {
    backgroundColor: '#fff',
    padding: 1,
    borderRadius: 3,
    elevation: 1,
    shadowColor: '#bfbfbf',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    marginTop: 25,
    marginBottom: 15,
    padding: 7,
  },
  brandImageWrapper: {
    width: '33.33%',
    margin: 'auto',
    marginBottom: 7,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 7,
    resizeMode: 'contain',
  },
  brandContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: '#fff',
  },
  brandText: {
    fontWeight: 'bold',
    marginTop: 4,
    textAlign: 'center',
    backgroundColor: '#fff',
  },
  brandImage: {
    width: 60,
    height: 40,
    resizeMode: 'contain',
  },
  inputStyle: {
    borderColor: '#f3943d',
    borderRadius: 4,
    borderWidth: 1.5,
    paddingLeft: 5,
    height: 45,
    backgroundColor: '#fff',
  },
  allListWarpper: {
    backgroundColor: '#fff',
    padding: 10,
  },
  brandTopText: {
    marginTop: 10,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  loading: {
    marginTop: 30,
  },
});
