import SyncStorage from '@helpers/async_storage';

export const postRequest = async (url, params) => {
  const token = await SyncStorage.get('token');
  return fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    }),
    body: JSON.stringify(params),
  });
};
