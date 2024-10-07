import {StyleSheet} from 'react-native';
import {SecondaryColor} from '@config/environment';
import colors from '@config/colors';

export default styles = StyleSheet.create({
    PriceDetailWrapper: {
        backgroundColor: '#fff',
        padding: 1,
        borderRadius: 3,
        paddingBottom: 5,
        marginTop: 5,
        marginBottom: 5,
        elevation: 1,
        shadowColor: '#bfbfbf',
        shadowOffset: {
          height: 0,
          width: 0
        },
        shadowOpacity: .5,
        shadowRadius: 2,
    },
    PriceDetailHeadingWrapper: {
        height: 30,
        justifyContent: 'center',
        borderBottomWidth: 0.5,
        borderColor: '#c9c9c9',
        paddingLeft: 5
    },
    PriceDetailHeading: {
        fontSize: 14,
        color: '#21212180'
    },
    detailWrapper: {
        marginTop: 10,
        
    },
    couponWrapper: {
        alignItems: 'center',
        paddingVertical: 3,
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 0.5,
        borderColor: '#ddd',
    },
    couponTextWrapper:{
        paddingLeft: 10
    },
    couponButtonText: {
        color: SecondaryColor,
    },
    couponText: {
        color: '#1fa62d',
        fontSize: 13,
    },
    detail: {
        flexDirection: 'row',
        marginBottom: 10,
        paddingHorizontal:20,
        justifyContent: 'space-between',
    
    },
    detailTitle: {
        fontSize: 13,
        color: '#212121'
    },
    detailValue: {
        fontSize: 13,
        color: colors.blueColor
    },
    totalAmountWrapper: {
        flexDirection: 'row',
       paddingHorizontal:20,
        paddingTop: 2,
        paddingBottom: 5,
        justifyContent: 'space-between',
        borderTopWidth: 0.5,
        borderColor: '#c9c9c9',
    },
    totalAmountTitle: {
        fontSize: 14,
        color: '#212121',
        fontWeight: 'bold'
    },
    totalAmountSubTitle: {
        fontSize: 12,
        color: '#21212180'
    },
    totalAmountValue: {
        fontSize: 17,
        color: colors.blueColor,
        fontWeight: 'bold'
    },
    similarProductMainView: { height: 190, paddingVertical: 4, backgroundColor: colors.HexColor },
    similarProductSubView: { height: '100%', backgroundColor: colors.white, paddingLeft: 20, paddingVertical: 5, justifyContent: 'center' },
    youalsoLikeText: { paddingVertical: 7, paddingHorizontal: 20, backgroundColor: colors.HexColor, alignContent: 'center', top: -3 },
    couponeCodeView: { height: 50, paddingVertical: 5, backgroundColor: colors.HexColor },
    couponeSubView: { height: 40, backgroundColor: colors.white, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', paddingHorizontal:20, },
  
  priceDetailText: { color: colors.productHeaderText, fontSize: 15 ,},
  priceDetailView: { height: 50, borderBottomWidth: 2, borderBottomColor: colors.HexColor, justifyContent: 'center', paddingHorizontal: 20 },
})
