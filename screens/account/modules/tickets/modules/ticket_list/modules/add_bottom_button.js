import React, { Component } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import TouchableCustom from '@helpers/touchable_custom';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {PrimaryColor, SecondaryColor} from '@config/environment';

class AddBottomButton extends Component {
  	render() {
  		const {onPress} = this.props;
	    return (
	    	<View style={styles.addIconContainer}>
		    	<TouchableCustom onPress={onPress} underlayColor={'#ffffff10'}>
			    	<View style={styles.addIconWrapper}>
			    		<Icon name='plus' size={40} color={'#ffffff'}/>
			    	</View>
			    </TouchableCustom>
			</View>
	    );
  	}
}

const styles = StyleSheet.create({
	addIconContainer: {
		position: 'absolute',
		bottom: 35,
		right: 35,
		borderRadius: 25,
		overflow: 'hidden',
		elevation: 5,
		shadowColor: '#bfbfbf',
        shadowOffset: {
          height: 0,
          width: 0
        },
        shadowOpacity: .5,
        shadowRadius: 2,
        backgroundColor: 'transparent'
	},
	addIconWrapper: {
		borderRadius: 10,
		backgroundColor: PrimaryColor,
		paddingVertical: 5,
		paddingHorizontal: 6
	}
});
export default AddBottomButton;
