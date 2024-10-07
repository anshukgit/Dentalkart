import React, {Component} from 'react';
import { View, Text, Image, ActivityIndicator, Modal, FlatList, TouchableOpacity } from 'react-native';
import TouchableCustom from '@helpers/touchable_custom';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './picker.style';

export default class Picker extends Component {
    constructor(props){
        super(props);
        this.state = {
            title: props.title,
            modalVisible: false,
            selectedValue: [],
            selectedValueId: []
        }
        this.priceTypeSymbol = {
            'FIXED' : props.currency,
            'PERCENT' : '%'
        }
    }
    openModal() {
        this.setState({modalVisible:true});
    }
    closeModal() {
        this.setState({modalVisible:false});
    }
    setSelectedValue = (fullValueObject) => {
        (this.state.modalVisible) ? this.closeModal() : null;
        const {getSelectedOptions} = this.props;
        const {selectedValueId, selectedValue} = this.state;
        let newValue = fullValueObject.id ? [fullValueObject.id] : [fullValueObject.value_index]
        this.setState({
            selectedValue : fullValueObject,
            selectedValueId: newValue
        });
        getSelectedOptions(newValue);
    }
    changeTitleState(item, title) {
        (this.state.modalVisible) ? this.closeModal() : null;
        this.setState({title: title})
        this.setSelectedValue(item)
    }
    resetConfigurableOptions = () => {
        const {resetConfigurableOptions, title} = this.props;
        this.setState({
            selectedValue: [],
            selectedValueId: [],
            title: title
        });
        this.closeModal()
        resetConfigurableOptions();
    }
    setDefaultSelectedValue = () => {
        const {inputData} = this.props;
        try {
            inputData.map((value) => {
                if (value.is_default) this.changeTitleState(value, value.label);
                return null;
            })
        } catch (e) {
            console.log(e);
        }
    }
    componentDidMount(){
        this.setDefaultSelectedValue();
    }
    render(){
        const {inputData, inputLabel, type} = this.props;
        return(
            <View>
                <PickerModal _this={this} pickerModalArray={inputData} selectedTitleId={this.state.titleId} type={type} resetShow={this.props.resetShow}/>
                <RenderPicker _this={this} pickerModalArray={inputData} type={type}/>
            </View>
        )
    }
}

const PickerModal = ({_this, pickerModalArray, selectedTitleId, type, resetShow}) => {
    return (
        <Modal visible={_this.state.modalVisible} onRequestClose={() => _this.closeModal()} transparent animationType={'fade'}>
            <View style={styles.modalWrapper}>
                <TouchableOpacity onPress={()=>_this.closeModal()} style={styles.modalOverlay}></TouchableOpacity>
                <View style={styles.modalContainer}>
                    { resetShow ? <TouchableOpacity onPress={() => type == 'configurable' ? _this.resetConfigurableOptions() : _this.setSelectedValue({})}>
                        <View style={styles.listWrapper}>
                            <Text allowFontScaling={false}>Reset options</Text>
                        </View>
                    </TouchableOpacity> : null}
                    <FlatList
                        data={pickerModalArray}
                        keyExtractor={(item, index) => index.toString()}
                        extraData={_this.state}
                        renderItem={({item, index}) => type== 'bundle' ?
                        (
                            <TouchableCustom onPress={()=>_this.changeTitleState(item, item.label)}>
                                <View style={[styles.listWrapper, (index === pickerModalArray.length-1) ? styles.lastTitle : null]}>
                                    <Text allowFontScaling={false}>{item.label}</Text>
                                    {item.price > 0 ? <Text allowFontScaling={false} style={styles.extraPrice}>{ ` + ${item.price_type === 'FIXED' ? _this.priceTypeSymbol['FIXED'] : ''}${item.price}${item.price_type === 'PERCENT' ? _this.priceTypeSymbol['PERCENT'] : ''}` }</Text> : null}
                                </View>
                            </TouchableCustom>
                        ) : (
                            item.selected ?
                            (
                                <TouchableCustom underlayColor={'#ffffff10'} onPress={()=>_this.changeTitleState(item, item.label)}>
                                    <View style={[styles.listWrapper, (index === pickerModalArray.length-1) ? styles.lastTitle : null]}>
                                        <Text allowFontScaling={false}>{item.label}</Text>
                                    </View>
                                </TouchableCustom>
                            ) :
                            <TouchableCustom underlayColor={'#ffffff10'} onPress={()=>_this.changeTitleState(item, item.label)}>
                                <View style={[styles.disabledListWrapper,(index === pickerModalArray.length-1) ? styles.lastTitle : null]}>
                                    <Text allowFontScaling={false} style={styles.disabledListText}>{item.label}</Text>
                                </View>
                            </TouchableCustom>
                        )}
                    />
                </View>
            </View>
        </Modal>
    )
}

const RenderPicker = ({_this, pickerModalArray, type}) => {
    return (
        <View>
            <TouchableCustom underlayColor={'#ffffff10'} onPress={() => _this.openModal()}>
                <View style={styles.pickerWrapper} numberOfLines={1}>
                    <Text allowFontScaling={false} style={styles.selectedText}>{_this.state.title}</Text>
                    <Icon name='chevron-down' size={25} style={styles.dropdownIcon} />
                </View>
            </TouchableCustom>
        </View>
)};
