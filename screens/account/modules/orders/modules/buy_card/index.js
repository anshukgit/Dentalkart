import React, {useContext} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import getImageUrl from '@helpers/getImageUrl';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Styles from './buy_card.style';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {addToCart} from '@screens/cart';
import {ADD_TO_WISHLIST_QUERY} from '../../../../../product/graphql';
import {newclient} from '@apolloClient';
import {addToCartClick} from '../../../../../../helpers/sendData';
import {showSuccessMessage} from '../../../../../../helpers/show_messages';
import {DentalkartContext} from '@dentalkartContext';

export default BuyCard = ({item, navigation}) => {
  const context = useContext(DentalkartContext);
  const {userInfo} = context;

  const addToCartPress = async product => {
    let data = {
      origin_page: 'Buy again',
      landing_page: 'cart',
      section: '',
      position: '',
      customer_id:
        userInfo && userInfo.getCustomer ? userInfo.getCustomer.email : null,
      created_at: new Date(),
      product_id: product?.id,
    };
    addToCartClick(data);
    await addToCart(product, context);
  };

  const addToWishlist = async product => {
    try {
      const data = await newclient.mutate({
        mutation: ADD_TO_WISHLIST_QUERY,
        variables: {product_ids: [product?.id]},
        fetchPolicy: 'no-cache',
      });
      showSuccessMessage('Added to Wishlist');
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={Styles.mainContainer}
      onPress={() =>
        navigation.navigate('UrlResolver', {url_key: item?.url_key})
      }>
      <View
        activeOpacity={0.5}
        onPress={() =>
          navigation.navigate('UrlResolver', {url_key: item?.url_key})
        }
        style={Styles.cardContainer}>
        <View style={Styles.imageContainer}>
          <Image
            resizeMethod={'resize'}
            source={{uri: getImageUrl(item.image_url)}}
            resizeMode="contain"
            style={{
              width: '90%',
              height: '90%',
            }}
          />
        </View>
        <Text numberOfLines={1} style={Styles.headerText}>
          {item?.name?.trim()}
        </Text>
        <Text numberOfLines={1} style={Styles.descreptionText}>
          {item?.short_description?.trim()}
        </Text>
        <View style={Styles.ratingContainer}>
          {parseInt(item.average_rating) > 0 ? (
            <>
              <Text style={Styles.ratingText}>
                {parseInt(item.average_rating).toFixed(1)}
              </Text>
              <MCIcon
                name="star"
                style={styles.star}
                size={18}
                color={
                  parseInt(item?.rating_count) >= 1 ? '#FFC107' : '#C4C4C4'
                }
              />
              <MCIcon
                name="star"
                style={styles.star}
                size={18}
                color={
                  parseInt(item?.rating_count) >= 2 ? '#FFC107' : '#C4C4C4'
                }
              />
              <MCIcon
                name="star"
                style={styles.star}
                size={18}
                color={
                  parseInt(item?.rating_count) >= 3 ? '#FFC107' : '#C4C4C4'
                }
              />
              <MCIcon
                name="star"
                style={styles.star}
                size={18}
                color={
                  parseInt(item?.rating_count) >= 4 ? '#FFC107' : '#C4C4C4'
                }
              />
              <MCIcon
                name="star"
                style={styles.star}
                size={18}
                color={
                  parseInt(item?.rating_count) >= 5 ? '#FFC107' : '#C4C4C4'
                }
              />
            </>
          ) : null}
        </View>
        <View style={Styles.pricePercentageContainer}>
          <View style={Styles.priceContainer}>
            <Text style={Styles.mainPriceText}>
              {item.price.minimalPrice.amount.currency_symbol}
              {item.price.minimalPrice.amount.value}
            </Text>
            {item.price.regularPrice.amount.value >
            item.price.minimalPrice.amount.value ? (
              <Text allowFontScaling={false} style={Styles.cutPrice}>
                {item.price.regularPrice.amount.currency_symbol}
                {item.price.regularPrice.amount.value}
              </Text>
            ) : null}
          </View>
          <View>
            {item.price.regularPrice.amount.value >
            item.price.minimalPrice.amount.value ? (
              <Text allowFontScaling={false} style={Styles.precentageText}>
                {(
                  100 -
                  (item.price.minimalPrice.amount.value * 100) /
                    item.price.regularPrice.amount.value
                ).toFixed(2)}
                %
              </Text>
            ) : null}
          </View>
        </View>
        <View style={Styles.buttonContainer}>
          {item?.type_id === 'simple' ? (
            <>
              <TouchableOpacity
                onPress={() =>
                  item?.is_in_stock ? addToCartPress(item) : null
                }
                style={[
                  Styles.addToCartButton,
                  !item?.is_in_stock && {
                    backgroundColor: colors.LightGray,
                    borderColor: colors.LightGray,
                  },
                ]}
                activeOpacity={item?.is_in_stock ? 0.5 : 1}>
                <Text
                  style={[
                    Styles.addToCartText,
                    !item?.is_in_stock && {color: '#FFF'},
                  ]}>
                  Add to cart
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => addToWishlist(item)}
                style={Styles.wishlistButton}
                activeOpacity={0.5}>
                <MCIcon
                  name="heart-outline"
                  style={Styles.star}
                  size={18}
                  color={'#7C8697'}
                />
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('UrlResolver', {url_key: item?.url_key})
              }
              style={[Styles.addToCartButton, {width: wp('42%')}]}
              activeOpacity={0.5}>
              <Text style={Styles.addToCartText}>View product</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
