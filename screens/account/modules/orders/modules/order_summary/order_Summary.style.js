import { StyleSheet } from 'react-native';
import { DeviceWidth, PrimaryColor, SecondaryColor } from '@config/environment';
import colors from '@config/colors';
// import { screenPadding, moderateScale, writeLog, verticalScale, responsiveHeight, responsiveFontSize, responsiveWidth } from '@config/functions';
export default styles = StyleSheet.create({

    shippingAddressView: { width: '100%', minHeight: 65, paddingHorizontal: 20, justifyContent: 'space-evenly', backgroundColor: colors.white, marginBottom: 6, paddingTop: 3 },
    shippingAddressText: { fontSize: 14, color: colors.black, fontWeight: '600' },
    address: { fontSize: 11.5, color: '#9d9d9d', fontWeight: '400' },
    priceDetailView: { height: 45, backgroundColor: colors.white, justifyContent: 'center', paddingHorizontal: 20, marginBottom: 2 },
    priceDetailText: { color: colors.black, fontWeight: '600', fontSize: 13 },
    billMainView: { minHeight: 40, backgroundColor: colors.white, justifyContent: 'center', paddingHorizontal: 20, marginBottom: 2, paddingTop: 2 },
    itemView: { width: '100%', minHeight: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    itemText: { fontSize: 15, color: colors.black, paddingBottom: 5 },
    itemTextCount: { fontSize: 16, color: colors.blueColor, textAlign: 'right', right: 0 },
    rewardsPointsView: { height: 70, backgroundColor: colors.white, paddingHorizontal: 20, justifyContent: 'space-evenly', marginBottom: 8 },
    rewardsPointsText: { fontSize: 14, fontWeight: '600', color: colors.black, top: 7 },
    earnedView: { flexDirection: 'row', minWidth: 40, alignItems: 'center', height: "50%" },
    itemsinOrderView: { height: 35, backgroundColor: colors.white, justifyContent: 'center', paddingHorizontal: 20, marginBottom: 3 },
    itemsinOrderTxt: { fontSize: 14, color: colors.black, fontWeight: '600' },
    cartItemImg: { width: '20%', height: 90, borderRadius: 8, borderWidth: 1, borderColor: colors.otpBorder, justifyContent: 'center', alignItems: 'center' },
    prodctName: { fontSize: 13, fontWeight: '400', color: colors.black, height: 22 },
    qtyText: { color: colors.LightSlateGrey, fontSize: 13 },
    qtyTextCount: { color: colors.black, fontWeight: '400', fontSize: 12.5 },
    cartItemMappingMainView: { height: 110, backgroundColor: colors.white, paddingHorizontal: 20, paddingVertical: 10, flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
    mappingDetailView: { height: '100%', width: '80%', justifyContent: 'center', paddingHorizontal: 10 },
    invoiceView: { paddingVertical: 10, backgroundColor: colors.white, paddingHorizontal: 20, justifyContent: 'space-between', alignItems: "center", flexDirection: "row" },
    invoiceText: { fontSize: 14, fontWeight: '600', color: colors.black },
});




