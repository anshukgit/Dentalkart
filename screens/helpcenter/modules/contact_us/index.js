import React, {Component} from 'react';
import {View, Text} from 'react-native';
import styles from './contact_us.style';
import Header from '@components/header';
import HeaderComponent from "@components/HeaderComponent";

export default class ContactUs extends Component{
    render(){
        return(
            <View>
                <HeaderComponent navigation={this.props.navigation} label={'Contact Us'} style={{ height: 40 }} />
                <View style={styles.wrapper}>
                    <View style={styles.cardWrapper}>
                        <View style={styles.cardHeadingWrapper}>
                            <Text allowFontScaling={false} style={styles.cardHeading}>Headquarters</Text>
                        </View>
                        <View style={styles.addressWrapper}>
                            <Text allowFontScaling={false} style={styles.addressHeading}>Delhi NCR</Text>
                            <Text allowFontScaling={false} style={styles.cardBody}>VASA Denticity Pvt. Ltd.</Text>
                            <Text allowFontScaling={false} style={styles.cardBody}>Farm No. 12, Club Drive</Text>
                            <Text allowFontScaling={false} style={styles.cardBody}>Gadaipur, DLF Farms</Text>
                            <Text allowFontScaling={false} style={styles.cardBody}>Near Ghitorni Metro Station</Text>
                            <Text allowFontScaling={false} style={styles.cardBody}>Delhi - 110030</Text>
                        </View>
                    </View>
                    <View style={styles.cardWrapper}>
                        <View style={styles.cardHeadingWrapper}>
                            <Text allowFontScaling={false} style={styles.cardHeading}>Overseas Office</Text>
                        </View>
                        <View style={styles.addressWrapper}>
                            <Text allowFontScaling={false} style={styles.addressHeading}>Dubai</Text>
                            <Text allowFontScaling={false} style={styles.cardBody}>VASA Denticity Pvt. Ltd.</Text>
                            <Text allowFontScaling={false} style={styles.cardBody}>1807-6, 18th Floor, BB1 Tower</Text>
                            <Text allowFontScaling={false} style={styles.cardBody}>Mazaya Business Avenue, JLT</Text>
                            <Text allowFontScaling={false} style={styles.cardBody}>Dubai UAE</Text>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}
