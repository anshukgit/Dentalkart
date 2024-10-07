import { StyleSheet } from 'react-native';
import { DeviceWidth } from '@config/environment';

export default styles = StyleSheet.create({
	container : {
	    flexDirection: 'row',
		backgroundColor: '#f5f5f5'
	},
	section_1: {
	    width: DeviceWidth * .5,
	    elevation: 2,
		backgroundColor: '#f5f5f5',
	},
	section_2: {
		width: DeviceWidth * .5,
	},
	section_3: {
		marginTop: 10
	},
	showBorder: {
		borderColor: '#2378aa',
		borderWidth: 1,
		borderRadius: 3
	},
	subChildWrapper: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: 5,
		paddingBottom: 0
	},
	itemWrapper: {
		margin: 8,
		paddingLeft: 5,
		height: 30,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: DeviceWidth * .5 - 16,
	},
	item: {
	    borderBottomColor: '#efefef',
	    borderBottomWidth: 1,
	    height: 35,
	    alignItems: 'center',
	},
	categoryNameWrapper: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	categoryIcon: {
		width: 25,
		height: 25,
		marginRight: 5
	},
	subItem: {
		padding: 8,
		paddingTop: 5,
	    borderBottomColor: '#efefef',
	    borderBottomWidth: 1,
	},
	icon: {
		position: 'absolute',
		right: 0
	},
	subItemName: {
		fontSize: 13
	},
	itemWithIcon: {
	    flexDirection: 'row',
	    justifyContent: 'space-between'
	}
});
