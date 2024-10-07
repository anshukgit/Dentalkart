import React from 'react';
import { View, Image } from 'react-native';
import styles from './authlogo.style';

export default Logo = () => (
    <View style={styles.logoWrapper}>
        <Image style={styles.logo}
               source={{uri: 'https://s3.ap-south-1.amazonaws.com/dentalkart-media/authLogo.png'}} />
    </View>
)
