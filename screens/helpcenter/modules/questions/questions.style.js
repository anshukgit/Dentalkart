import {StyleSheet} from 'react-native';
import {DeviceWidth, SecondaryColor, PrimaryColor} from '@config/environment';

export default styles = StyleSheet.create({
    qustionsHeader: {
		backgroundColor: '#fff',
		padding: 10,
		flexDirection: 'row',
		alignItems: 'center'
	},
	qustionsHeaderImage: {
		width: 40,
		height: 40,
		resizeMode: 'contain',
		marginRight: 10
	},
	qustionsHeaderTitle: {
		fontSize: 15,
		color: SecondaryColor,
	},
    listWrapper: {
		paddingHorizontal: 10
	},
	questionCardWrapper: {
		backgroundColor: '#efefef80',
		paddingHorizontal: 10,
		flexDirection: 'row',
		alignItems: 'center',
	},
	categoryQuestion: {
		color: '#282828',
		fontSize: 14,
		paddingVertical: 12,
		lineHeight: 17,
		width: DeviceWidth-50,
		borderBottomWidth: 0.5,
		borderBottomColor: '#ddd'
	},
	dot: {
		height: 5,
		width: 5,
		borderRadius: 10,
		backgroundColor: PrimaryColor,
		marginRight: 10
	}
})
