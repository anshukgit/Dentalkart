import {StyleSheet} from 'react-native';
import {DeviceWidth} from '@config/environment';

export default styles = StyleSheet.create({
    banner: {
		width: DeviceWidth,
		height: (DeviceWidth*500)/1090,
		resizeMode: 'cover',
        marginBottom: 15
	},
    sliderImage: {
        height: (((DeviceWidth-50)*312)/581),
        width: DeviceWidth-50,
        borderRadius: 10
    },
});
