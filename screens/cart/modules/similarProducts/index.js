import React from 'react';
import {View, Text, Image} from 'react-native';
import imageConstant from '@helpers/images';
import styles from './style';
import colors from '@config/colors';
import {Icon} from 'native-base';

const similarProduct = [
  {
    img: imageConstant.androidIcon,
    proname: 'Waldent Max Piezo 3+ Ultrosonic Scaler',
    proSmallDescription: 'Waldent Max Piezo 3+ Ultrosonic Scaler',
    disprice: 320,
    price: 1300,
  },
  {
    img: imageConstant.androidIcon,
    proname: 'Waldent Max Piezo 3+ Ultrosonic Scaler',
    proSmallDescription: 'Waldent Max Piezo 3+ Ultrosonic Scaler',
    disprice: 320,
    price: 1300,
  },
  {
    img: imageConstant.androidIcon,
    proname: 'Waldent Max Piezo 3+ Ultrosonic Scaler',
    proSmallDescription: 'Waldent Max Piezo 3+ Ultrosonic Scaler',
    disprice: 320,
    price: 1300,
  },
  {
    img: imageConstant.androidIcon,
    proname: 'Waldent Max Piezo 3+ Ultrosonic Scaler',
    proSmallDescription: 'Waldent Max Piezo 3+ Ultrosonic Scaler',
    disprice: 320,
    price: 1300,
  },
];
const SimilarProducts = ({isStockOutmodal}) => {
  return similarProduct.map((data, index) => {
    return (
      <View style={[styles.shadow, styles.productMappingView]}>
        <View
          style={[
            styles.productMappingImg,
            {
              backgroundColor: isStockOutmodal ? colors.white : colors.HexColor,
            },
          ]}>
          <Image
            source={data.img}
            style={{width: '90%', height: '90%'}}
            resizeMode={'contain'}
          />
        </View>
        <View style={styles.dissVIew}>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={{fontSize: 15}}>
            {data.proname}
          </Text>
          <Text
            allowFontScaling={false}
            numberOfLines={1}
            ellipsizeMode="tail"
            style={styles.productDiss}>
            {data.proSmallDescription}
          </Text>
          <View style={styles.productMappingPriceMainView}>
            <View style={styles.dispriceView}>
              <Icon name="rupee" type="FontAwesome" style={styles.rupeeIcon} />
              <Text allowFontScaling={false} style={styles.dispriceTxt}>
                {data.disprice}
              </Text>
            </View>
            <View style={[styles.dispriceView, {justifyContent: 'flex-start'}]}>
              <Icon
                name="rupee"
                type="FontAwesome"
                style={{fontSize: 10, color: colors.blueColor}}
              />
              <Text
                allowFontScaling={false}
                style={{fontSize: 15, color: colors.blueColor}}>
                {data.price}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  });
};
export default SimilarProducts;
