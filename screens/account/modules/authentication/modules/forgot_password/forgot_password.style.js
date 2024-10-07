import { StyleSheet, Platform } from 'react-native';
import { DeviceWidth, DeviceHeight, PrimaryColor } from '@config/environment';

export default styles = StyleSheet.create({
    forgotPasswordPageContainer: {
        backgroundColor: '#ffffff',
		flex: 1
    },
    formWrapper: {
        // height: Platform.OS === 'ios' ? (DeviceHeight - 32) : (DeviceHeight - 56),
        backgroundColor: '#ffffff'
    },
    titleWrapper: {
        marginVertical: 15,
        justifyContent: 'center',
		alignItems: 'center',
    },
    titleText: {
        color: '#b4b3b3',
        fontSize: 12
    },
    sectionFormWrapper: {
        paddingLeft: 15,
        paddingRight: 15
    },
    buttonDisabled: {
        borderRadius: 5,
		backgroundColor: '#d4d4d4',
		marginTop: 25,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
		width: DeviceWidth-30,
	},
	button: {
        borderRadius: 5,
		backgroundColor: PrimaryColor,
		marginTop: 25,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center',
		width: DeviceWidth-30,
	},
	buttonText: {
		color: '#ffffff',
		fontSize: 12
	},
    eyeIconWrapper: {
        position: 'absolute',
        right: 5,
        top: 10
    },
    logoMinView: { width: '100%', flex: 0.38, justifyContent: 'center', alignItems: 'center' },
    emailTextInputView: { width: '100%', height: 45, borderWidth: 1, alignItems: 'center', flexDirection: 'row', paddingHorizontal: 15, },
	emailIcon: { fontSize: 16, marginRight: 15, color: '#c4cddd' },
    loginBtn: { width: '100%', height: 48, borderRadius: 3, alignItems: 'center', flexDirection: 'row', marginTop: 18, backgroundColor: colors.blueColor, justifyContent: 'center', },
    loginBtnDisabled: { width: '100%', height: 48, borderRadius: 3, alignItems: 'center', flexDirection: 'row', marginTop: 18, backgroundColor: colors.blueColor, justifyContent: 'center', opacity:0.5},
});
