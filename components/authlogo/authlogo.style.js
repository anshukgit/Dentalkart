import { StyleSheet } from 'react-native';
import { DeviceWidth} from '@config/environment';

export default styles = StyleSheet.create({
    logoWrapper: {
        marginBottom: 36,
        width: DeviceWidth,
        justifyContent: 'center',
        alignItems: 'center'
    },
    logo: {
        width: 114,
        height: 81
    }
})
