import React, {useContext, useCallback, useState} from 'react';

// We need to import the connectHighlight to our import
import {
  Text,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
} from 'react-native';
import {DentalkartContext} from '@dentalkartContext';
import {addToCart} from '@screens/cart';
import {addToCartClick} from '../../helpers/sendData';
import colors from '../../config/colors';
import {SearchPageStyle} from './searchPageStyle';
import {SecondaryColor} from '@config/environment';

export const AddToCartButton = ({product}) => {
  const [loading, setLoading] = useState(false);
  const context = useContext(DentalkartContext);
  const {userInfo} = context;
  const addToCartPress = useCallback(async () => {
    try {
      let data = {
        origin_page: 'Search',
        landing_page: 'cart',
        section: '',
        position: '',
        customer_id:
          userInfo && userInfo.getCustomer ? userInfo.getCustomer.email : null,
        created_at: new Date(),
        product_id: product?.objectID,
      };
      setLoading(true);
      addToCartClick(data);
      await addToCart(product, context);
      setLoading(false);
    } catch (error) {
      console.log('error on addToCart : ', error);
    }
  }, []);
  return (
    <TouchableOpacity
      disabled={loading}
      onPress={() => {
        !product?.in_stock ? null : addToCartPress(product);
        Keyboard.dismiss();
      }}
      style={[
        SearchPageStyle.addToCartButton,

        !product?.in_stock && {
          backgroundColor: colors.LightGray,
          borderColor: colors.LightGray,
        },
      ]}
      activeOpacity={!product?.in_stock ? 1 : 0.5}>
      <Text
        style={[
          SearchPageStyle.addToCartText,
          !product?.in_stock && {color: '#FFF'},
        ]}>
        {loading ? (
          <ActivityIndicator size="small" color={SecondaryColor} />
        ) : (
          'Add to cart'
        )}
      </Text>
    </TouchableOpacity>
  );
};
