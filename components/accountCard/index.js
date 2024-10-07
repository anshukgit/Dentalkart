import React from 'react';
import {View, TouchableHighlight, Text, StyleSheet} from 'react-native';

const AccountCard = ({title, subTitle, onPress}) => (
    <TouchableHighlight style={styles.card} underlayColor="#ddd" onPress={() => onPress()}>
        <View>
            <View style={styles.titleWrapper}>
                <Text allowFontScaling={false} style={styles.title}>{title}</Text>
            </View>
            <Text allowFontScaling={false} style={styles.subTitle}>{subTitle}</Text>
        </View>
    </TouchableHighlight>
)

const styles = StyleSheet.create({
    card: {
        elevation: 3,
        backgroundColor: '#fff',
        width: '95%',
        alignSelf: 'center',
        marginBottom: 10,
        paddingHorizontal: 5
    },
    titleWrapper: {
        borderBottomColor: '#efefef',
        borderBottomWidth: 1,
        padding: 5,
        paddingVertical: 10,
    },
    title: {
        color: '#000',
        fontSize: 15
    },
    subTitle: {
        paddingHorizontal: 5,
        paddingVertical: 10,
        textAlign: 'right',
        fontSize: 13,
        color: '#000'
    }
})

export default AccountCard;