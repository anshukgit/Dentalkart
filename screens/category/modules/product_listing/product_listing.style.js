import {StyleSheet} from 'react-native';
import {DeviceWidth, PrimaryColor} from '@config/environment'

export default styles = StyleSheet.create({
    categoryProductWrapper: {
	    backgroundColor: '#fff',
        marginTop: 2
	},
    categoryProduct: {
		flex: 5,
		flexDirection: 'row',
		borderBottomWidth: 0.5,
		borderBottomColor: '#21212150',
		padding: 4
	},
	productImageWrapper: {
		flex: 1.8,
		alignItems: 'center',
		padding: 5,
		paddingLeft: 0
	},
	productDetailsWrapper: {
		flex: 3.2,
		marginTop: 5,
		paddingRight: 30,
	},
	categoryProductImage: {
        width: 100,
        height: 100,
		resizeMode: 'contain',
	},
	productItemName: {
		color: '#212121',
		marginBottom: 4,
		fontSize: 13
	},
	description: {
		color: '#21212180',
		marginBottom: 4,
		fontSize: 12
	},
	productItemPriceWrapper: {
		flexDirection: 'row',
		marginTop: 2,
		alignItems: 'center'
	},
	productItemOldPrice: {
		textDecorationLine: 'line-through',
		textDecorationStyle: 'solid',
		color: '#21212180',
		marginRight: 3,
		fontSize: 12,
	},
	productItemNewPrice: {
		fontSize: 14,
		marginRight: 3,
	},
	productDiscount: {
		color: 'green',
		fontSize: 13,
	},
	soldOut: {
		fontSize: 13,
		color: 'red',
		position: 'absolute',
		left: 0,
		top: 50,
		backgroundColor: '#ffffff',
		width: DeviceWidth/3 - 15,
		textAlign: 'center'
	},
	categoryProductList: {
		marginBottom: 10
	},
	categoryProductCart: {
		position: 'absolute',
		padding: 5,
		right: 10,
		bottom: 10
	},
	categoryProductWishlist: {
		position: 'absolute',
		padding: 5,
		top: 5,
		right: 10
	},
	categoryProductIcon: {
		fontSize: 15,
		color: '#c5c5c9'
	},
	reviewsWrapper: {
		flexDirection: 'row',
		marginTop: 5,
		marginBottom: 5
	},
	ratingBoxWrapper: {
		flexDirection: 'row',
		backgroundColor: '#1abf46',
		justifyContent: 'center',
		alignItems: 'center',
		borderRadius: 3,
		paddingLeft: 3,
		paddingRight: 3
	},
	ratingBox: {
        backgroundColor: "#37BE3C",
		color: '#fff',
		marginRight: 2,
		fontSize: 12
	},
	ratingBoxIcon: {
		color: '#fff',
		fontSize: 12
	},
	reviewsQty: {
		marginLeft: 5,
		fontSize: 12,
		color: '#21212180',
	},
	qtyLeft: {
		fontSize: 12,
		color: PrimaryColor,
	},
	rewardWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: 5
	},
	rewardIcon: {
		width: 18,
		height: 18,
		marginRight: 3
	},
	rewardPoints: {
		color: '#282828'
	},
    star: {
        color: '#fff',
		fontSize: 12
    },
    priceDiscountWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center'
    }
})
