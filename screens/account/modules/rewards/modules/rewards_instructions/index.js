import React, {Component} from 'react';
import { Image, View, FlatList} from 'react-native';
import styles from './rewards_instructions.style';
import {DeviceWidth} from '@config/environment';

export default class RewardsInstructions extends Component{
    constructor(props){
        super(props);
        this.state ={}
        this.images=[
            {
                main: "https://s3.ap-south-1.amazonaws.com/dentalkart-media/React/Reward+page/Reward-Page_01.jpg",
                style: {
                    width: DeviceWidth,
                    height: (360*DeviceWidth) / 1299
                }
            },
            {
                main: "https://s3.ap-south-1.amazonaws.com/dentalkart-media/React/Reward+page/Reward-Page_02.jpg",
                style: {
                    width: DeviceWidth,
                    height: (351*DeviceWidth) / 1298
                }
            },
            {
                main: "https://s3.ap-south-1.amazonaws.com/dentalkart-media/React/Reward+page/Reward-Page_03.jpg",
                style: {
                    width: DeviceWidth,
                    height: (369*DeviceWidth) / 1301
                }
            },
            {
                main: "https://s3.ap-south-1.amazonaws.com/dentalkart-media/React/Reward+page/Reward-Page_04.jpg",
                style: {
                    width: DeviceWidth,
                    height: (359*DeviceWidth) / 1300
                }
            },
            {
                main: "https://s3.ap-south-1.amazonaws.com/dentalkart-media/React/Reward+page/Reward-Page_05.jpg",
                style: {
                    width: DeviceWidth,
                    height: (362*DeviceWidth) / 1298
                }
            },
            {
                main: "https://s3.ap-south-1.amazonaws.com/dentalkart-media/React/Reward+page/Reward-Page_06.jpg",
                style: {
                    width: DeviceWidth,
                    height: (246*DeviceWidth) / 1298
                }
            },
            {
                main: "https://s3.ap-south-1.amazonaws.com/dentalkart-media/React/Reward+page/Reward-Page_07.jpg",
                style: {
                    width: DeviceWidth,
                    height: (190*DeviceWidth) / 1300
                }
            },
        ]
    }
    render(){
        return(
    		<View>
    			<FlatList
    				data={this.images}
    				keyExtractor={(item, index) => index.toString()}
    				renderItem={({item, index}) =>
    					<View style={styles.instructionImageWrapper}>
    						<Image
                                source={{uri: item.main}}
                                style={{...styles.instructionImage, ...item.style}}
                            />
    					</View>
    				}
    				style={styles.imagesWrapper}
    			/>
    		</View>
    	);
    }
}
