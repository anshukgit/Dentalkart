import {setCustomTag, setCustomUserId} from 'react-native-clarity';
import Base64 from '../Base64';
import {
  setLoginId,
  setEmail,
  setFirstName,
  setLastName,
  setDOB,
  setEvent,
  setPhone,
} from './AnalyticsCall';
import {appsFlyerEvent} from './AppsflyerEvents';
import {webEngageInAppEvents} from './WebEngageInAppEvents';

const AnalyticsEvents = (actionName, eventName, data) => {
  console.log(
    'eventName========data======orderId',
    eventName + ' 1',
    JSON.stringify(data),
  );
  let eventData = {};
  const itrateProductData = data => {
    if (data.getCategoryProducts) {
      return {
        name: data.getCategoryProducts.name,
        id: data.getCategoryProducts.category_id,
        sku: data.getCategoryProducts.sku,
        p_id: data.getCategoryProducts.id,
        price:
          data?.getCategoryProducts?.price?.minimalPrice?.amount?.value ||
          data?.getCategoryProducts?.price?.regularPrice?.amount?.value,
        quantity: data.getCategoryProducts.quantity
          ? data.getCategoryProducts.quantity
          : 1,
        brands: data.getCategoryProducts.manufacturer
          ? data.getCategoryProducts.manufacturer
          : 'Brand not assigned',
        imageUrl:
          data.getCategoryProducts.image ??
          'https://s3.ap-south-1.amazonaws.com/dentalkart-media/React/Web+Icon+%26+Skeleton+Gif/Default-Product-Image-Place-Holder.png',
        productUrl: `https://www.dentalkart.com/${data.getCategoryProducts.url_key}.html`,
        totalPrice: data?.getCategoryProducts?.quantity
          ? data.getCategoryProducts.quantity *
            data?.getCategoryProducts?.price?.minimalPrice?.amount?.value
          : data?.getCategoryProducts?.price
          ? 1 * data?.getCategoryProducts?.price?.minimalPrice?.amount?.value
          : null,
      };
    } else {
      return {
        name: data.name,
        id: data.sku,
        sku: data.sku,
        p_id: data.id,
        currency: data?.price?.regularPrice?.amount?.currency,
        price:
          data?.price?.minimalPrice?.amount?.value ||
          data?.price?.regularPrice?.amount?.value,
        quantity: data.quantity ? data.quantity : 1,
        brands: data.manufacturer ? data.manufacturer : 'Brand not assigned',
        imageUrl: data.image
          ? data.image.url
          : 'https://s3.ap-south-1.amazonaws.com/dentalkart-media/React/Web+Icon+%26+Skeleton+Gif/Default-Product-Image-Place-Holder.png',
        productUrl: `https://www.dentalkart.com/${data.url_key}.html`,
        totalPrice: data?.quantity
          ? data.quantity * data?.price?.minimalPrice?.amount?.value
          : data?.price
          ? 1 * data?.price?.minimalPrice?.amount?.value
          : null,
      };
    }
  };

  switch (actionName) {
    case 'USER_INFO': {
      if (data.getCustomer) {
        setLoginId(Base64.btoa(data.getCustomer?.email));
        setCustomUserId(data.getCustomer?.email);
        data.getCustomer?.email && setEmail(data.getCustomer.email);
        data.getCustomer?.mobile && setPhone(data.getCustomer.mobile);
        data.getCustomer?.dob && setDOB(data.getCustomer.dob);
        data.getCustomer?.firstname && setFirstName(data.getCustomer.firstname);
        data.getCustomer?.lastname && setLastName(data.getCustomer.lastname);
      }
      return;
    }
    // case "LOGIN": {
    //     eventData = { ...data }
    //     break;
    // }
    case 'SOCIAL_LOGIN': {
      eventData = {...data};
      break;
    }
    case 'PRODUCT_SEARCHED': {
      eventData = {...data};
      break;
    }
    case 'BANNER_CLICKED': {
      eventData = {
        bannerName: data.brand_name ? data.brand_name : data.title,
        bannerId: data.id,
        bannerLink: data.link,
      };
      break;
    }

    case 'PRODUCT_SCREEN': {
      eventData = itrateProductData(data);
      break;
    }
    case 'SIGNUP': {
      eventData = {
        first_name: data.firstname,
        last_name: data.lastname,
      };
      if (data?.email) {
        eventData.email = data?.email;
      }
      if (data?.mobileNumber) {
        eventData.mobileNumber = data?.mobileNumber;
        eventData.phone = data?.mobileNumber;
      }
      break;
    }
    case 'ADDED_TO_CART': {
      eventData = {
        name: data.name,
        id: data.sku,
        sku: data.sku,
        p_id: data.id,
        currency: data?.price?.regularPrice?.amount?.currency,
        price:
          data?.price?.minimalPrice?.amount?.value ||
          data?.price?.regularPrice?.amount?.value,
        quantity: data.quantity ? data.quantity : 1,
        brands: data.manufacturer ? data.manufacturer : 'Brand not assigned',
        imageUrl: data.image
          ? data.image.url
          : 'https://s3.ap-south-1.amazonaws.com/dentalkart-media/React/Web+Icon+%26+Skeleton+Gif/Default-Product-Image-Place-Holder.png',
        productUrl: `https://www.dentalkart.com/${data.url_key}.html`,
        totalPrice: data?.quantity
          ? data.quantity * data?.prices?.minimalPrice?.amount?.value
          : data?.prices
          ? 1 * data?.prices?.minimalPrice?.amount?.value
          : null,
      };
      break;
    }
    case 'REMOVED_FROM_CART': {
      eventData = {
        name: data?.product?.name,
        id: data?.product?.sku,
        sku: data?.product?.sku,
        p_id: data?.product?.id,
        price:
          data?.product?.price?.minimalPrice?.amount?.value ||
          data?.product?.price?.regularPrice?.amount?.value,
        quantity: data.quantity ? data.quantity : 1,
        brands: data?.product?.manufacturer
          ? data?.product?.manufacturer
          : 'Brand not assigned',
        imageUrl: data?.product?.image
          ? data?.product?.image.url
          : 'https://s3.ap-south-1.amazonaws.com/dentalkart-media/React/Web+Icon+%26+Skeleton+Gif/Default-Product-Image-Place-Holder.png',
        productUrl: `https://www.dentalkart.com/${data?.product?.url_key}.html`,
        totalPrice: data.quantity
          ? data.quantity *
            (data?.product?.price?.minimalPrice?.amount?.value ||
              data?.product?.price?.regularPrice?.amount?.value)
          : 1 *
            (data?.product?.price?.minimalPrice?.amount?.value ||
              data?.product?.price?.regularPrice?.amount?.value),
      };
      break;
    }
    case 'CATEGORY_VIEWED': {
      eventData = {
        'Category Id': data.category_id,
        'Category Name': data.category_name,
      };
      break;
    }
    case 'SUB_CATEGORY_VIEWED': {
      eventData = {
        'Category Id': data.category_id,
        'Category Name': data.category_name,
        'Sub Category Id': data.sub_category_id,
        'Sub Category Name': data.sub_category_name,
      };
      break;
    }
    case 'ADDED_TO_WHISHLIST': {
      eventData = {
        name: data.name,
        id: data.sku,
        sku: data.sku,
        p_id: data.id,
        price:
          data?.price?.minimalPrice?.amount?.value ||
          data?.price?.regularPrice?.amount?.value,
        quantity: data.quantity ? data.quantity : 1,
        brands: data.manufacturer ? data.manufacturer : 'Brand not assigned',
        imageUrl: data.image
          ? data.image.url
          : 'https://s3.ap-south-1.amazonaws.com/dentalkart-media/React/Web+Icon+%26+Skeleton+Gif/Default-Product-Image-Place-Holder.png',
        productUrl: `https://www.dentalkart.com/${data.url_key}.html`,
        totalPrice: data.quantity
          ? data.quantity * data?.price?.minimalPrice?.amount?.value
          : 1 * data?.price?.minimalPrice?.amount?.value,
      };
      break;
    }
    case 'CART_UPDATED': {
      eventData = {
        'No. of Products': data?.data?.items?.length,
        total_qty: data?.data?.total_quantity,
        'Total Amount': data?.data?.prices?.grand_total.value,
        'Product Details': data?.data?.items,
      };
      break;
    }
    case 'COUPON_CODE': {
      eventData = {...data};
      break;
    }
    case 'CART_VIEWED': {
      eventData = {
        'No. of Products': data?.items.length,
        total_qty: data?.total_quantity,
        'Total Amount': data?.prices?.grand_total.value,
        'Product Details': data?.items,
      };
      break;
    }
    case 'CHECKOUT_STARTED': {
      let product_name = [];
      let product_id = [];
      let product_price = [];
      let category = [];
      data?.items.map(item => {
        product_id.push(item?.product?.id);
        product_name.push(item?.product?.name);
        product_price.push(item?.prices?.price?.value);
        category.push(item?.product?.categories?.map(e => e.name).join(','));
      });
      console.log('item============', category);
      eventData = {
        category: category,
        'Product Name': product_name.join(','),
        'Product Id': product_id.join(','),
        'Product price': product_price.join(','),
        'No. Of Products': data?.items.length,
        'Total Quantity': data?.total_quantity,
        'Total Amount': data?.prices?.grand_total?.value,
        'Product Details': data.items,
        'Discount Amount': data?.prices?.discount?.amount?.value,
        'Coupon Code': data?.applied_coupons?.[0]?.code,
        'Sub Total': data?.prices?.subtotal_including_tax?.value,
        'Shipping Charge':
          data?.shipping_addresses[0]?.available_shipping_methods[0]?.amount
            ?.value,
      };
      break;
    }
    case 'CHECKOUT_COMPLETED': {
      if (data) {
        console.log(
          'CHECKOUT_COMPLETED==============7240507021',
          JSON.stringify(data.items?.map(item => item?.product?.url_path)),
        );
        let product_name = [];
        let product_id = [];
        let product_price = [];

        data?.items?.map(item => {
          product_id.push(item?.product?.id);
          product_name.push(item?.product?.name);
          product_price.push(item?.prices?.price?.value);
        });
        eventData = {
          'Product Name': product_name.join(','),
          purchaseDate: new Date().toISOString(),
          'Product Id': product_id.join(','),
          'Product price': product_price.join(','),
          'No. Of Products': data?.items.length,
          'Total Quantity': data?.total_quantity,
          'Total Amount': data?.prices?.grand_total?.value,
          'Product Details': [
            ...data?.items?.map(item => ({
              ...item,
              product: {
                ...item?.product,
                url_path:
                  'https://dentalkart.com/' + item?.product?.url_path + '.html',
              },
            })),
            // const urlPaths = data.items.map(item => item.product.url_path);
          ],
          'Discount Amount': data?.prices?.discount?.amount?.value,
          'Coupon Code': data?.applied_coupons?.[0]?.code,
          'Sub Total': data?.prices?.subtotal_including_tax?.value,
          'Shipping Charge':
            data?.shipping_addresses[0]?.available_shipping_methods[0]?.amount
              ?.value,
        };
      }
      break;
    }
    case 'PAYMENT_FAILURE': {
      eventData = {...data};
      break;
    }
    case 'ORDER_CANCELLED': {
      eventData = {...data};
      break;
    }
    case 'SHIPPING_DETAILS_UPDATED': {
      eventData = {
        'Shipping Address': data.street,
        City: data.city,
        State: data.region.region,
        'Country code': data.country_code,
      };
      break;
    }
    case 'PRODUCT_RATED': {
      eventData = {...data};
      break;
    }
    case 'TOP_BRANDS': {
      eventData = {...data};
      break;
    }
    case 'CART_ITEM_QUANTITY_UPDATED': {
      eventData = {
        'Product name': data?.product?.name,
        'Previous Quantity': data?.quantity,
        'Current Quantity': data?.updated_quantity,
      };
      break;
    }
    case 'BUY_NOW': {
      let price =
        data?.price?.minimalPrice?.amount?.value ||
        data?.price?.regularPrice?.amount?.value;
      eventData = {
        name: data.name,
        id: data.sku,
        sku: data.sku,
        p_id: data.id,
        price: price,
        quantity: data.quantity ? data.quantity : 1,
        brands: data.manufacturer ? data.manufacturer : 'Brand not assigned',
        imageUrl: data.image
          ? data.image.url
          : 'https://s3.ap-south-1.amazonaws.com/dentalkart-media/React/Web+Icon+%26+Skeleton+Gif/Default-Product-Image-Place-Holder.png',
        productUrl: `https://www.dentalkart.com/${data.url_key}.html`,
        totalPrice: data.quantity ? data.quantity * price : 1 * price,
        total_qty: data.productQuantity,
        totalAmount: data.productQuantity * price,
      };
      break;
    }
    case 'CHECK_COD': {
      eventData = {...data};
      break;
    }
    case 'QUANTITY_UPDATE': {
      eventData = {...data};
      break;
    }
    default: {
      eventData = {...data};
      break;
    }
  }

  setEvent(eventName, eventData);
  setCustomTag(eventName, JSON.stringify(eventData));
  appsFlyerEvent(eventName, eventData);
  webEngageInAppEvents(actionName, eventData);
  return;
};

export default AnalyticsEvents;
