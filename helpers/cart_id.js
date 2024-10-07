import SyncStorage from '@helpers/async_storage';

export const getCartId = async () => {
  const cartId = await SyncStorage.get('cart_id');
  return cartId;
};

export const setCartId = async cartId => {
  await SyncStorage.set('cart_id', cartId);
};

export const removeCartId = async () => {
  await SyncStorage.remove('cart_id');
};
