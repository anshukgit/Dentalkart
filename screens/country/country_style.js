import {StyleSheet} from 'react-native';
import {DeviceWidth as Width} from '@config/environment';

export const CountryStyle = StyleSheet.create({
	countryListWrapper:{
		marginBottom: 50
	},
	cardWrapper: {
		flexDirection: 'row',
		borderBottomWidth: 1,
		borderBottomColor: '#dddddd',
		alignItems: 'center',
		paddingHorizontal: 10,
		justifyContent: 'space-between',
	},
	countryNameWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	countryName: {
		color: '#282828',
		fontSize: 14,
		paddingHorizontal: 15,
		paddingVertical: 10
	},
	countryImage: {
		width: 20,
		height: 20,
		resizeMode: 'contain'
	},
	selectedcountryIcon: {
		fontSize: 20,
		color: 'green',
	},
	searchFieldWrapper: {
		elevation: 1,
		shadowColor: '#bfbfbf',
        shadowOffset: {
          height: 0,
          width: 0
        },
        shadowOpacity: .5,
        shadowRadius: 2,
		flexDirection: 'row',
		alignItems: 'center',
		borderBottomWidth: 1,
		borderBottomColor: '#efefef',
	},
	searchIcon: {
		color: '#21212180',
		fontSize: 15,
		marginHorizontal: 10,
	},
	searchField: {
		height: 40,
        width: Width-40
	}
})
