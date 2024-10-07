import { StyleSheet } from 'react-native';
import {SecondaryColor, DeviceWidth } from '@config/environment';

export const UserDetail = StyleSheet.create({
	detailWrapper: {
		backgroundColor: SecondaryColor,
		alignItems: 'center',
	},
	orderPlaced: {
		color: '#fff',
		fontSize: 16,
		marginVertical: 20
	},
	successTransaction: {
		fontSize: 14,
		color: '#fff'
	},
	continueShoppingWrapper: {
		backgroundColor: '#fff',
		marginVertical: 20,
		borderWidth: 1,
		borderColor: SecondaryColor,
		borderRadius: 5
	},
	continueShopping: {
		padding: 12,
		paddingLeft: 25,
		paddingRight: 25,
		color: '#212121',
		fontSize: 14
	}
});
