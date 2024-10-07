const BASE_URL = 'https://www.dentalkart.com/';

const API = {
  checkout: {
    estimate_shipping_methods: `${BASE_URL}rest/default/V1/carts/mine/estimate-shipping-methods`,
    set_estimate_shipping_methods: (cart_id) =>
      `${BASE_URL}rest/V1/guest-carts/${cart_id}/estimate-shipping-methods`,
    set_shipping_information: (cart_id) =>
      `${BASE_URL}rest//V1/guest-carts/${cart_id}/shipping-information`,
    set_shipping_and_billing_information: `${BASE_URL}rest/default/V1/carts/mine/dk-shipping-information`,
    send_payment_information: `${BASE_URL}rest/default/V1/carts/mine/dt-payment-information`,
    order_success: `${BASE_URL}rest/V1/checkout/order/success`,
    razorpay: `${BASE_URL}rest/V1/razorpay/payment/order`,
  },
  validateFields: `${BASE_URL}rest/V1/mobileapp/directory/checkOptionalFields`,
};

export default API;
