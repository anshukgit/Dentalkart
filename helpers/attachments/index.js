import React from 'react';
import {View, Text, FlatList, TouchableOpacity, Image, Platform} from 'react-native';
import {AttachmentStyle} from './style';
import ImagePicker from 'react-native-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';

const options = {
    title: 'Select Image',
    storageOptions: {
        skipBackup: true,
        path: 'images',
    },
};

function fetchResponse(response){
    if (response.didCancel) {
        console.log('User cancelled image picker');
    } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
    }else {
        //return response;
        // You can also display the image using data:
        const source = { uri: 'data:image/jpeg;base64,' + response.data };
        return source;
    }
}

async function capturePic(instance){
    let result;
	await ImagePicker.launchCamera(options, (response) => {
        result = fetchResponse(response);
        saveAttachment(result, instance);
    });
}

async function imagePicker(instance) {
    let result;
	await ImagePicker.launchImageLibrary(options, (response) => {
        result = fetchResponse(response);
        saveAttachment(result, instance);
    });
}

async function saveAttachment(result, instance){
	let attachments = instance.state.attachments;
	if (!result.cancelled) {
    	attachments.push(result);
    	instance.setState({ attachments }, () => instance.sendSelectionToParent());
    }
}

function removeAttachment(instance, index){
	let attachments = instance.state.attachments;
	attachments.splice(index, 1);
	instance.setState({attachments},() => instance.sendSelectionToParent());
}

export const AttachmentBlock = ({instance}) => {
	return(
		<View>
			<View style={AttachmentStyle.attachButtons}>
				<Text allowFontScaling={false} style={AttachmentStyle.attachText}>Add attachments - </Text>
				<TouchableOpacity onPress={() => capturePic(instance)}>
					<View style={AttachmentStyle.attachIconWrapper}>
						<Icon name='ios-camera' style={AttachmentStyle.attachButtonCameraIcon}/>
					</View>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => imagePicker(instance)}>
					<View style={AttachmentStyle.attachIconWrapper}>
						<Icon name='ios-folder-open' style={AttachmentStyle.attachButtonFolderIcon}/>
					</View>
				</TouchableOpacity>
			</View>
			<Text allowFontScaling={false} style={AttachmentStyle.imageInfo}>Only .jpeg, .jpg and .png formats are supported. The size must be less than 10MB</Text>
			<View>
				<FlatList
					data={instance.state.attachments}
					keyExtractor={(item, index) => item.uri}
					renderItem={({item, index}) => <AttachedImage item={item} instance={instance} index={index}/>}
					numColumns={Platform.OS=== 'ios'? 2 : 3}
					extraData={instance.state}
				/>
			</View>
		</View>
	);
}

const AttachedImage = ({instance, item, index}) => {
	return (
		<View style={AttachmentStyle.attachedImageWrapper}>
			<TouchableOpacity onPress={()=> removeAttachment(instance, index)} style={AttachmentStyle.attachedRemoveIconWrapper}>
				<Icon name="ios-close-circle-outline" style={AttachmentStyle.attachedRemoveIcon}/>
			</TouchableOpacity>
			<Image source={{uri: item.uri}} style={AttachmentStyle.attachedImage} />
		</View>
	);
}
