import WebEngage from 'react-native-webengage';
var webengage = new WebEngage();

export const webEngageInAppEvents = async (screenName = '', data = {}) => {
  console.log('webEngageInAppEvents', screenName, data);
  switch (screenName) {
    case 'HOME_PAGE_VIEWED': {
      webengage.screen('home');
      break;
    }
    case 'ACCOUNT_PAGE_VIEWED': {
      webengage.screen('profile');
      break;
    }
    case 'CART_VIEWED': {
      webengage.screen('cart');
      break;
    }
    case 'CHECKOUT_STARTED': {
      webengage.screen('checkout-details');
      break;
    }
  }
};
