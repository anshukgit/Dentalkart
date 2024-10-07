import {StyleSheet} from 'react-native';
import {DeviceWidth, DeviceHeight, SecondaryColor} from '@config/environment';

export default styles = StyleSheet.create({
    box_wrapper: {
        backgroundColor: "#fff",
        borderRadius: 5,
        marginBottom: 10,
        padding: 5,
        width: '80%'
    },
    active_box_wrapper: {
		backgroundColor: SecondaryColor,
        borderRadius: 5,
        marginBottom: 10,
        padding: 5,
        width: '80%'
	},
    text: {
        color: "#000",
        fontSize: 10
    },
    active_text: {
        color: "#fff",
        fontSize: 10
    }
})
