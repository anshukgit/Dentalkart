import {StyleSheet} from 'react-native';
import {DeviceWidth} from '@config/environment';

export default styles = StyleSheet.create({
	imagesWrapper: {
		marginBottom: 20
	},
	instructionImage: {
		width: DeviceWidth,
		height: DeviceWidth,
		resizeMode: 'contain'
	}
})
