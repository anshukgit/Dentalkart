const getShippingAmount = address => {
  if (address?.length) {
    return address[0].available_shipping_methods[0]?.amount?.value;
  }
  return null;
};

const getCartTotalWithKeys = cartData => {
  const shippingamount = getShippingAmount(cartData?.shipping_addresses);
  const cartPrices = cartData.prices;
  const currency =
    cartPrices?.subtotal_including_tax?.currency_symbol ||
    cartPrices?.subtotal_including_tax?.currency;
  return {
    subtotal_including_tax: {
      key: 'Sub Total',
      value: cartPrices?.subtotal_including_tax.value.toFixed(2),
      currency: currency,
      visiblity: true,
      modal: false,
    },
    shipping: {
      key: 'Delivery Charges',
      value: shippingamount && shippingamount.toFixed(2),
      currency: currency,
      modal: true,
      modal_title: ``,
      visiblity: shippingamount ? true : false,
    },
    overweight_delivery_charges: {
      key: 'Overweight delivery charges',
      value: cartPrices?.overweight_delivery_charges?.value.toFixed(2),
      currency: currency,
      visiblity:
        cartPrices?.overweight_delivery_charges?.value > 0 ? true : false,
      modal: false,
    },
    discount: {
      key: 'Coupon Applied',
      value:
        cartPrices?.discount != null
          ? cartPrices?.discount.amount.value.toFixed(2)
          : 0,
      currency: currency,
      visiblity: cartPrices?.discount?.amount?.value ? true : false,
      modal: false,
    },
    total_savings: {
      key: 'Total Savings',
      value: cartPrices?.total_savings.value.toFixed(2),
      currency: currency,
      modal: false,
      visiblity: true,
      style: {
        color: 'green',
      },
    },
    rewardsdiscount: {
      key: `Reward Discount`,
      value: cartPrices?.rewardsdiscount?.amount?.value.toFixed(2) ?? 0,
      currency: cartPrices?.rewardsdiscount?.amount && currency,
      visiblity: cartPrices?.rewardsdiscount?.amount?.value ? true : false,
      modal: false,
    },
    grand_total: {
      key: 'Grand Total',
      value: cartPrices?.grand_total.value.toFixed(2),
      currency: currency,
      visiblity: false,
      modal: false,
    },
  };
};
export default getCartTotalWithKeys;
