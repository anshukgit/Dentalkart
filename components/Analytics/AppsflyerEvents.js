import appsFlyer from 'react-native-appsflyer';

export const appsFlyerEvent = async (eventName = '', data = {}) => {
  console.log('eventName=====eventName==eventName=eventName', eventName);
  console.log('data=====of==event=id===!=Addtowishlist', data);
  let appsflyerEvent;
  let appsflyerData = {};
  switch (eventName) {
    case 'productviewed': {
      appsflyerEvent = 'af_content_view';
      appsflyerData = {
        af_price: data?.price,
        af_content: data?.name,
        af_content_id: data?.p_id,
        af_content_type: data?.brands,
        af_currency: data?.currency,
      };
      appsFlyerCall(appsflyerEvent, appsflyerData);
      break;
    }

    case 'addToCart': {
      appsflyerEvent = 'af_add_to_cart';
      appsflyerData = {
        af_price: data?.price,
        af_content: data?.name,
        af_content_id: data?.p_id,
        af_content_type: data?.name,
        af_currency: data?.currency,
        af_quantity: data?.quantity,
      };
      appsFlyerCall(appsflyerEvent, appsflyerData);
      break;
    }

    case 'Addtowishlist': {
      appsflyerEvent = 'af_add_to_wishlist';
      appsflyerData = {
        af_price: data?.price,
        af_content_type: data?.name,
        af_currency: 'INR',
      };
      appsFlyerCall(appsflyerEvent, appsflyerData);
      break;
    }

    case 'Checkout Completed': {
      appsflyerEvent = 'af_purchase';
      appsflyerData = {
        af_revenue: data?.['Total Amount'],
        af_price: data?.['Product price'],
        af_content: data?.['Product Name'],
        af_content_id: data?.['Product Id'],
        af_content_type: data?.['Product Name'],
        af_currency: 'INR',
        af_quantity: data?.['Total Quantity'],
        // af_order_id: ,
        // af_receipt_id: ,
      };
      appsFlyerCall(appsflyerEvent, appsflyerData);
      break;
    }

    case 'Checkout Started': {
      appsflyerEvent = 'af_initiated_checkout';
      appsflyerData = {
        af_price: data?.['Product price'],
        af_content_id: data?.['Product Id'],
        af_content_type: data?.['Product Name'],
        af_currency: 'INR',
        af_quantity: data?.['Total Quantity'],
      };
      appsFlyerCall(appsflyerEvent, appsflyerData);
      break;
    }

    case 'Product searched': {
      appsflyerEvent = 'af_search';
      appsflyerData = {
        af_search_string: data?.['Item Keyword'],
        af_content_list: data?.['Search Count'],
      };
      appsFlyerCall(appsflyerEvent, appsflyerData);
      break;
    }

    case 'Category viewed': {
      appsflyerEvent = 'af_list_view';
      appsflyerData = {
        af_content_type: data?.id,
        af_content_list: data?.name,
      };
      appsFlyerCall(appsflyerEvent, appsflyerData);
      break;
    }

    case 'User Login': {
      appsflyerEvent = 'af_login';
      appsFlyerCall(appsflyerEvent);
      break;
    }

    case 'signup': {
      appsflyerEvent = 'af_complete_registration';
      appsflyerData = {
        af_registration_method: data?.email ? data?.email : data?.mobileNumber,
      };
      appsFlyerCall(appsflyerEvent, appsflyerData);
      break;
    }
  }
};

const appsFlyerCall = (eventName, data = {}) => {
  //   console.log('eventName,eventName', eventName, data);
  appsFlyer.logEvent(
    eventName,
    data,

    res => {
      console.log('res====of===appsflyer==!!!', res);
    },
    err => {
      console.log('error====of===appsflyer', err);
    },
  );
};
