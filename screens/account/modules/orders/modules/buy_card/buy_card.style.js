import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default (Styles = StyleSheet.create({
    mainContainer: {
        width: wp("50%"),
        alignItems: "center",
        backgroundColor: "#FFF",
    },
    cardContainer: {
        width: wp("47%"),
        paddingHorizontal: wp("2%"),
        backgroundColor: "#FFF",
        borderWidth: 1,
        borderRadius: hp("0.8%"),
        borderColor: "#D3D3D3",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    imageContainer: {
        width: "100%",
        height: hp("18%"),
        marginVertical: hp("1%"),
        alignItems: "center",
    },
    headerText: {
        fontWeight: "500",
        fontSize: wp("3.5%")
    },
    descreptionText: {
        lineHeight: 24,
        fontSize: wp("3.3%"),
        color: "#7C8697"
    },
    ratingContainer: {
        flexDirection: "row",
        alignItems: "center",
        height: hp("3%")
    },
    ratingText: {
        lineHeight: 24,
        fontWeight: "500",
        fontSize: wp("3.5%"),
        color: "#FFC107",
        marginRight: 10
    },
    pricePercentageContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        alignItems: "center"
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center"
    },
    mainPriceText: {
        lineHeight: 24,
        fontWeight: "500",
        color: "#25303C",
        marginRight: 5
    },
    cutPrice: {
        lineHeight: 24,
        fontSize: wp("3%"),
        color: "#666666",
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid',
    },
    precentageText: {
        lineHeight: 24,
        fontSize: wp("3%"),
        color: "#25303C"
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: hp("1%"),
    },
    addToCartButton: {
        borderWidth: 1,
        width: wp("32%"),
        paddingVertical: hp("1%"),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: hp("0.5%"),
        borderColor: colors.orangeBtn
    },
    addToCartText: {
        fontWeight: "bold",
        color: colors.orangeBtn
    },
    wishlistButton: {
        borderWidth: 1,
        paddingVertical: hp("1%"),
        paddingHorizontal: wp("2%"),
        justifyContent: "center",
        alignItems: "center",
        borderRadius: hp("0.5%"),
        borderColor: "#7C8697"
    },
}));
