import React, {useContext} from 'react';
import {DentalkartContext} from '@dentalkartContext';
import LinearGradient from 'react-native-linear-gradient';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Linking, TouchableOpacity, Image, StyleSheet} from 'react-native';
const WhatsApp = ({type}) => {
  const context = useContext(DentalkartContext);
  const {whatsAppInfo} = context;

  const open = () => {
    try {
      Linking.canOpenURL(whatsAppInfo?.app_link)
        .then(supported => {
          if (!supported) {
            console.log("Can't handle url: " + whatsAppInfo?.app_link);
          } else {
            return Linking.openURL(whatsAppInfo?.app_link);
          }
        })
        .catch(err => console.log('An error occurred', err));
    } catch (error) {
      console.log('An error occurred', error);
    }
  };
  return (
    <LinearGradient
      colors={['#12c665', '#009446']}
      start={{x: 0, y: 0}}
      style={styles.whatsAppLogoContainer}>
      {console.log('hatsAppInfo?.app_link', whatsAppInfo?.app_link)}
      <TouchableOpacity onPress={open}>
        {type === 'orderDetailsPage' ? (
          <Image
            style={{width: 30, height: 30}}
            source={require('../../assets/whatsapp1.png')}
          />
        ) : (
          <Image
            source={require('../../assets/whatsapp.png')}
            resizeMode="contain"
            style={{
              width: wp('5%'),
              height: wp('5%'),
              margin: 5,
            }}
          />
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  whatsAppLogoContainer: {
    borderRadius: 50,
  },
});

export default WhatsApp;
