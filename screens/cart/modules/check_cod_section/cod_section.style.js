import { StyleSheet, Platform } from 'react-native';
import { DeviceWidth, SecondaryColor, PrimaryColor } from '@config/environment';
import colors from '@config/colors';
export default sttyles = StyleSheet.create({
    outerCard: {
        backgroundColor: '#fff',
        padding: 1,
        // borderRadius: 3,
        marginTop: 5,
        marginBottom: 5,
        // marginRight: 8,
        // marginLeft: 8,
        // elevation: 1,
        // paddingVertical: 10,
        // paddingHorizontal: 15,
        // shadowColor: '#bfbfbf',
        // shadowOffset: {
        //     height: 0,
        //     width: 0
        // },
        // shadowOpacity: .5,
        // shadowRadius: 2,
    },
    textFieldWrapper: {
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: 2,
       width:'100%'
    },
    inputField: {
        borderWidth: 0.5,
        borderColor: colors.borderColor,
        paddingLeft: 10,
        height: 40,
        width: DeviceWidth - 165,
        padding: 4,
        marginHorizontal: 2,
        fontSize: 14,
        marginRight: 10,
        borderRadius: 3
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 2,
        paddingHorizontal: 3
    },
    applyCouponButton: {
        width: 100,
        height: 38,
        elevation: 4,
        backgroundColor: SecondaryColor,
        borderRadius: 3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    applyCouponButtonText: {
        color: '#fff'
    },
    dropdownIcon: {
        color: '#000',
        marginLeft: 7,
    },
    checkServicesTxt:{fontSize:13.5, fontWeight:'bold', marginLeft:2, marginBottom:5},
    showmoreView:{borderRadius: 5,elevation:3.3, width:100, height: 25,  justifyContent: 'center', alignItems: 'center', marginVertical: 8,backgroundColor: colors.HexColor,},
    showmoreTxt:{fontSize:13,top:-1},
})
