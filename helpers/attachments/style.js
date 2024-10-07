import { StyleSheet } from 'react-native';
import {PrimaryColor, SecondaryColor} from '@config/environment';

export const AttachmentStyle = StyleSheet.create({
	attachButtons: {
		padding: 5,
		flexDirection: 'row',
		alignItems: 'center',
	},
	attachText: {
		color: SecondaryColor,
		marginRight: 20
	},
	attachIconWrapper: {
		backgroundColor: '#fff',
		marginRight: 10
	},
	attachButtonCameraIcon: {
		fontSize: 28,
		color: SecondaryColor,
	},
	attachButtonFolderIcon: {
		fontSize: 25,
		color: SecondaryColor
	},
	imageInfo: {
		color: '#28282880',
		fontSize: 10,
		lineHeight: 12
	},
	attachedImagesContainer: {
		marginVertical: 5
	},
	attachedImageWrapper: {
		paddingRight: 5,
		paddingTop: 5
	},
	attachedRemoveIconWrapper: {
		position: 'absolute',
		top: 5,
		right: 7,
		zIndex: 100,
	},
	attachedRemoveIcon: {
		fontSize: 25,
		color: '#fff',
		fontWeight: 'bold'
	},
	attachedImage: {
		width: 100,
		height: 100
	},
});
