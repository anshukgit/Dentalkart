import SyncStorage from '@helpers/async_storage';

const getRequest = async url => {
  const token = await SyncStorage.get('token');
  return fetch(url, {
    method: 'GET',
    credentials: 'include',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }),
  });
};

export const getDeepLinkData = async (onelinkId, deeplinkId) => {
  return fetch(
    `https://onelink.appsflyer.com/shortlink/v1/${onelinkId}?id=${deeplinkId}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: new Headers({
        'Content-Type': 'application/json',
        Authorization: '1b3u1l4h00169000034RFlrAAG1s6h3a2t',
      }),
    },
  );
};

export const _getRequest = url => {
  return fetch(url);
};

export default getRequest;
