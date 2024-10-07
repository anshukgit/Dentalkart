import {Platform} from 'react-native';
import tokenClass from '@helpers/token';
import {Version} from '@config/environment';
import {getCountry} from '@helpers/country';

export const getRequest = async url => {
  const country = await getCountry();
  let token = await tokenClass.getToken();
  return fetch(url, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      platform: Platform.OS,
      version: Version,
      currency: country.currency_code,
    }),
    credentials: 'include',
  });
};

export const postRequest = async (url, params, headers = {}) => {
  const country = await getCountry();
  let token = await tokenClass.getToken();
  return fetch(url, {
    method: 'POST',
    headers: new Headers({
      ...headers,
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      platform: Platform.OS,
      version: Version,
      currency: country.currency_code,
    }),
    credentials: 'include',
    body: JSON.stringify(params),
  });
};

export const putRequest = async (url, params) => {
  const country = await getCountry();
  let token = await tokenClass.getToken();
  return fetch(url, {
    method: 'PUT',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      platform: Platform.OS,
      version: Version,
      currency: country.currency_code,
    }),
    credentials: 'include',
    body: JSON.stringify(params),
  });
};

export const postRequestFormData = async (url, params) => {
  const country = await getCountry();
  let token = await tokenClass.getToken();
  let data = Object.keys(params)
    .map(key => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
    })
    .join('&');
  return fetch(url, {
    method: 'POST',
    headers: new Headers({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
      platform: Platform.OS,
      version: Version,
      currency: country.currency_code,
    }),
    credentials: 'include',
    body: data,
  });
};
