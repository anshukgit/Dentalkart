import {
  ADD_TO_CART_QUERY,
  ADD_SIMPLE_PRODUCT_TO_CART_MUTATION,
  ADD_GROUP_PRODUCTS_TO_CART_MUTATION,
  ADD_BUNDLE_PRODUCT_TO_CART_MUTATION,
  ADD_CONFIGURABLE_PRODUCT_TO_CART_MUTATION,
  ADD_MULTIPLE_PRODUCTS_TO_CART,
  GET_NEW_CART,
  GUEST_NEW_CART,
  ADD_VIRTUAL_PRODUCT_TO_CART,
} from './graphql';
import {ToastAndroid} from 'react-native';
import {cartClient} from '@apolloClient';
import {getCartId} from '@helpers/cart_id';
import SyncStorage from '@helpers/async_storage';
import tokenClass from '@helpers/token';
import isInvalidCart from '@helpers/inActiveCartError.js';
import {
  showErrorMessage,
  showSuccessMessage,
} from '../../helpers/show_messages';
import AnalyticsEvents from '../../components/Analytics/AnalyticsEvents';

const addToCart = async (product, context) => {
  const childOptions = product.options ? product.options : '';
  const guest_cart_id = await SyncStorage.get('guest_cart_id');
  console.log('guest_cart_id', guest_cart_id);
  const customer_cart_id = await SyncStorage.get('customer_cart_id');
  console.log('customer_cart_id', customer_cart_id);
  const loginStatus = await tokenClass.loginStatus();
  console.log('loginstatus', loginStatus);
  const cart_id = loginStatus ? customer_cart_id : guest_cart_id;
  const query = (await tokenClass.loginStatus())
    ? GET_NEW_CART
    : GUEST_NEW_CART;
  const performAddTOCart = {
    simple: {
      query: ADD_SIMPLE_PRODUCT_TO_CART_MUTATION,
      variables: {
        cart_id: cart_id,
        qty: product.qty || 1,
        sku: product.sku,
        referral_code: product?.referral_code || '',
      },
    },
    membershipPlan: {
      query: ADD_SIMPLE_PRODUCT_TO_CART_MUTATION,
      variables: {
        cart_id: cart_id,
        qty: product.qty || 1,
        sku: product.sku,
        referral_code: product?.referral_code || '',
      },
    },
    grouped: {
      query: ADD_GROUP_PRODUCTS_TO_CART_MUTATION(childOptions),
      variables: {cart_id: cart_id},
    },
    configurable: {
      query: ADD_CONFIGURABLE_PRODUCT_TO_CART_MUTATION,
      variables: {
        cart_id: cart_id,
        parent_sku: product.sku,
        qty: product.qty || 1,
        sku: product.childSku,
      },
    },
    bundle: {
      query: ADD_BUNDLE_PRODUCT_TO_CART_MUTATION(childOptions),
      variables: {
        cart_id: cart_id,
        parent_sku: product.sku,
        qty: product.qty || 1,
      },
    },
    multipleItems: {
      query: ADD_MULTIPLE_PRODUCTS_TO_CART,
      variables: {cart_id: cart_id, cart_items: product.items},
    },
    virtual: {},
    downloadable: {},
  };

  try {
    if (product.type_id === 'grouped' && product.options.length === 0) {
      showErrorMessage('Please specify the quantity of products');
    } else {
      const {data} = await cartClient.mutate({
        mutation: performAddTOCart[product.type_id].query,
        variables: {
          ...performAddTOCart[product.type_id].variables,
        },
        refetchQueries: () =>
          product.type_id === 'simple' && [
            {query: query, variables: {cart_id: cart_id}},
          ],
        fetchPolicy: 'no-cache',
      });
      console.log('data performAddTOCart', data);
      if (
        data &&
        ((data.addSimpleProductsToCartV2 &&
          data.addSimpleProductsToCartV2.cart) ||
          (data.addBundleProductsToCart && data.addBundleProductsToCart.cart) ||
          (data.addConfigurableProductsToCart &&
            data.addConfigurableProductsToCart.cart) ||
          (data.addVirtualProductsToCartV2 &&
            data.addVirtualProductsToCartV2.cart))
      ) {
        const cartCount = data.addSimpleProductsToCartV2
          ? data.addSimpleProductsToCartV2.cart.items.length
          : data.addBundleProductsToCart
          ? data.addBundleProductsToCart.cart.items.length
          : data.addConfigurableProductsToCart
          ? data.addConfigurableProductsToCart.cart.items.length
          : data.addVirtualProductsToCartV2.cart.items.length;
        context.getCartItemCount(cartCount);
        // await context.setShippingAddress();
        AnalyticsEvents('ADDED_TO_CART', 'addToCart', product);
        showSuccessMessage('Item Added to Cart', 'top');
      } else {
        showErrorMessage('Error');
      }
      return true;
    }
  } catch (error) {
    const shouldRetry = !error.networkError && isInvalidCart(error);
    // await context.setLogout();
    console.log(
      'Invalid token================================================================',
      error,
    );
    console.log(
      'shouldRetry============================================================',
      shouldRetry,
    );
    if (String(error).includes('Invalid token')) {
      console.log(
        'Invalid token============================================================',
      );
      await context.setLogout(true);
      return;
    }
    if (shouldRetry) {
      SyncStorage.remove('customer_cart_id');
      SyncStorage.remove('guest_cart_id');
      await context.getGuestAndCustomerCartId();
      await addToCart(product, context);
    } else {
      if (product.type_id === 'membershipPlan')
        showErrorMessage(
          'A membership-product is already present in the cart.',
        );
      else showErrorMessage(`${error}. Please try again.`, 'top');
    }
    return false;
  }
};

export default addToCart;
