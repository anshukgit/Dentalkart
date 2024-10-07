import { StyleSheet } from 'react-native';
import { DeviceWidth } from '@config/environment';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

export default (styles = StyleSheet.create({
    container: { paddingVertical: hp("1.5%"), flexDirection: 'row', justifyContent: 'flex-end', backgroundColor: '#ffffff' },
    header: { paddingHorizontal: wp("3%"), justifyContent: 'center', alignItems: 'center' },

    sectionHeaderContainer: {
        width: wp("95%"),
        alignSelf: "center",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: hp("2%"),
    },
    sectionHeaderTitleText: {
        fontWeight: "bold",
        fontSize: wp("5"),
        color: "#344161"
    },
    sectionHeaderSubTitleText: {
        fontWeight: "600",
        fontSize: wp("3.3%"),
        color: "#AAB0BD"
    },
    directionRow: {
        flexDirection: "row",
    },
    cardContainer: {
        backgroundColor: "#FBFCFF",
        width: wp("95%"),
        borderRadius: hp("1%"),
        borderWidth: 1,
        borderColor: "#CED6E2",
        marginTop: hp("2%"),
        marginHorizontal: wp("2.5%"),
        paddingHorizontal: wp("3%"),
        paddingVertical: hp("1.5%")
    },
    smallCardContainer: {
        width: wp("50%")
    },
    cardShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.27,
        shadowRadius: 4.65,

        elevation: 6,
    },
    cardTitle: {
        fontWeight: "700",
        fontSize: wp("4%"),
        color: "#344161"
    },
    cardContent: {
        fontSize: wp("3.7%"),
        marginTop: hp("1%"),
        color: "#808080"
    },
    cardLabelLink: {
        fontSize: wp("3.4%"),
        marginTop: hp("1%"),
        color: "#344161"
    },
    cardLink: {
        fontSize: wp("3.4%"),
        marginTop: hp("1%"),
        color: "#3C81F3"
    },
    cardAbsoluteHeartContainer: {
        position: "absolute",
        backgroundColor: "rgba(234, 234, 234, 0.4)",
        height: wp("9%"),
        width: wp("9%"),
        borderRadius: wp("5%"),
        top: 10,
        right: 10,
        justifyContent: "center",
        alignItems: "center"
    },
    cardTopSmallImageContainer: {
        width: wp("43%"),
    },
    cardTopImageContainer: {
        justifyContent: "center",
        alignItems: "center",
        width: wp("89%"),
        marginBottom: hp("1%")
    },
    cardTopImageStyle: {
        width: wp("89%"),
        height: hp("20%"),
        borderRadius: hp("1%")
    },
    cardRightImageContainer: {
        justifyContent: "center",
        alignItems: "center"
    },
    cardRightImageStyle: {
        width: wp("25%"),
        height: hp("18%"),
        borderRadius: hp("1%")
    },
    cardBottomIconContainer: {
        flex: 1,
        alignItems: "center",
        flexDirection: "row",
        paddingTop: hp("1.5%")
    },
    cardBottomIconText: {
        marginLeft: wp("1.5%")
    },
    cardTitleContentContainer: {
        flex: 1,
        marginRight: hp("1%"),
        justifyContent: "space-between"
    },
    newsScrollImage: {
        width: wp("100%"),
        height: hp("30%")
    },
    newsScrollTitleContainer: {
        top: -hp("2%"),
        borderTopLeftRadius: hp("2%"),
        borderTopRightRadius: hp("2%"),
        backgroundColor: "#FFF",
        paddingHorizontal: wp("2.5%")
    },
    newsUnderline: {
        borderBottomWidth: 1,
        borderColor: "#CED6E2"
    },
    newsScrollNewsContainer: {
        backgroundColor: "#FFF",
        paddingHorizontal: wp("2.5%")
    },
    newsTitle: {
        fontWeight: "700",
        fontSize: wp("5%"),
        color: "#344161",
        marginTop: hp("2%"),
        marginBottom: hp("1%")
    },
    fullNews: {
        fontWeight: "700",
        fontSize: wp("4%"),
        color: "#344161",
        marginVertical: hp("2%")
    },
    fullNewsContent: {
        fontSize: wp("3.7%"),
        color: "#929292",
        textAlign: "justify",
        lineHeight: 22
    },
    newsDate: {
        fontWeight: "600",
        fontSize: wp("3.3%"),
        color: "#AAB0BD"
    },
    loaderContainer: {
        height: hp("80%"),
        justifyContent: "center",
        alignItems: "center"
    }
}));

