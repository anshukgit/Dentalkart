import AsyncStorage from '@react-native-community/async-storage';

class _tokenClass {
  loginStatus = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token !== null) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  getToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token !== null) {
        return token;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  setToken = async token => {
    try {
      await AsyncStorage.setItem('token', token);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  removeToken = async () => {
    try {
      await AsyncStorage.removeItem('token');
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };
}

const tokenClass = new _tokenClass();

export default tokenClass;
