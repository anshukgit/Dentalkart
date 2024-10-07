import { StyleSheet } from 'react-native';
import { DeviceWidth, SecondaryColor } from '@config/environment';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

export default styles = StyleSheet.create({
    headerContainer: {
        flex: 1,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: hp("2%")
    },
    headerTitleText: {
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: "space-between",
    },
    categoryContainer: {
        width: wp("22%"),
        alignItems: "center",
        marginBottom: hp("2%"),
        marginRight: wp("2%"),
    },
    categoryImageContainer: {
        width: wp("22%"),
        height: wp("22%"),
        borderWidth: 1,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: wp("2%"),
        borderColor: "#ddd",
    },
    categoryImage: {
        width: wp("15%"),
        height: wp("15%")
    },
    categoryText: {
        fontWeight:'bold',
        marginTop: hp("1%"),
        textAlign: "center"
    },
    headerButton: {
        borderRadius: 4,
        height: 30,
        paddingHorizontal: wp("5%"),
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: SecondaryColor,
    },
    headerViewAllText: {
        color: '#fff'
    }
});
