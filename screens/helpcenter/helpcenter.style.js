import {StyleSheet, Platform} from 'react-native';
import {SecondaryColor, PrimaryColor, DeviceWidth} from '@config/environment';

export default styles = StyleSheet.create({
    listWrapper: {
		paddingHorizontal: 10
	},
	cardWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
		justifyContent: 'space-between',
		elevation: 1,
		shadowColor: '#bfbfbf',
        shadowOffset: {
          height: 0,
          width: 0
        },
        shadowOpacity: .5,
        shadowRadius: 2,
		backgroundColor: '#fff',
		marginBottom: 3,
		borderRadius: 3
	},
	categoryNameWrapper: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	categoryImage: {
		width: 30,
		height: 30,
		resizeMode: 'contain',
		marginRight: 20,
		marginLeft: 5,
	},
	categoryName: {
		color: '#28282880',
		fontSize: 15
	},
	formContainer: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		flex: 1,
	},
	fillDetailsText: {
		color: '#28282880',
		fontSize: 15,
	},
	mobileFieldWrapper: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	mobilePrefix: {
		backgroundColor: SecondaryColor,
		color: '#fff',
		padding: 5,
		paddingVertical: 10,
	},
	inputField: {
		borderWidth: 1,
		borderColor: '#efefef',
		paddingHorizontal: 10,
		paddingVertical: Platform.OS == 'ios'? 10 : 5,
		marginVertical: 10,
		color: SecondaryColor,
		fontSize: 16
	},
	mobileInputField: {
		width: DeviceWidth - 75
	},
	dropdownWrapper: {
		borderWidth: 1,
		borderColor: '#efefef',
		marginBottom: Platform.OS == 'ios'? 40: 10
	},
	dropdown: {
		height: Platform.OS == 'ios'? 150 : 40,
	},
	inputTextArea: {
		borderWidth: 1,
		borderColor: '#efefef',
		padding: 10,
		color: '#282828',
		marginBottom: 10,
		textAlignVertical: 'top',
		fontSize: 16,
		height: 150
	},
	sendButton: {
		backgroundColor: PrimaryColor,
		paddingVertical: 10,
		borderRadius: 3,
		alignSelf: 'flex-end',
		paddingHorizontal: 40,
		marginBottom: 20,
		marginTop: 10,
		flexDirection: 'row',
		alignItems: 'center',
	},
	sendButtonText: {
		color: '#fff',
		textAlign: 'center'
	},
	contactUsContainer: {
		padding: 10,
		margin: 10,
		justifyContent: 'center',
		alignItems: 'center',
	},
	contactUsText: {
		color: '#28282880',
	},
	contactUsButtonText: {
		color: PrimaryColor
	}
});
