import AsyncStorage from '@react-native-community/async-storage';

class _storage {
  init = async () => {
    try {
      let keys = await AsyncStorage.getAllKeys();
      let data = await AsyncStorage.multiGet(keys);
      let arr = [];
      data.forEach(element => {
        let resp = this.saveItem(element);
        let respArr = resp.split('@');
        let obj = {
          [respArr[0]]: respArr[1],
        };
        arr.push(obj);
      });
      return arr;
    } catch (error) {}
    return [];
  };

  saveItem(item) {
    let value;

    try {
      value = JSON.parse(item[1]);
    } catch (e) {
      [, value] = item;
    }

    let key = item[0];
    return key + '@' + value;
  }

  checkJson = str => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  };

  set = async (key, value) => {
    try {
      return await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  get = async key => {
    try {
      let resp = await AsyncStorage.getItem(key);
      if (resp !== null) {
        if (this.checkJson(resp)) {
          return JSON.parse(resp);
        }
        return resp;
      } else {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  remove = async key => {
    return await AsyncStorage.removeItem(key);
  };
}

const syncStorage = new _storage();
export default syncStorage;
