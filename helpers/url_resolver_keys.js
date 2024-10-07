import SyncStorage from '@helpers/async_storage';

export const getUrlData = async url => {
  const data = await SyncStorage.get(url);
  return data;
};

export const setUrlData = async (url, data) => {
  await SyncStorage.set(url, data);
};

export const removeUrlData = async url => {
  await SyncStorage.remove(url);
};

export const extractQueryParams = url => {
  var regex = /[?&]([^=#]+)=([^&#]*)/g,
    params = {},
    match;
  while ((match = regex.exec(url))) {
    params[match[1]] = match[2];
  }
  return params;
};
