import SyncStorage from '@helpers/async_storage';

export const getCountry = async () => {
  const country = await SyncStorage.get('country');
  return country;
};

export const setCountry = async country => {
  await SyncStorage.set('country', country);
};

export const removeCountry = async () => {
  await SyncStorage.remove('country');
};
