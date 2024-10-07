import React, {Component} from 'react';
import {View, Text, Button, TouchableOpacity} from 'react-native';
// import TouchableCustom from '@helpers/touchable_custom';
import styles from './checkbox.style';

class CheckBox extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedValue: [],
            selectedValueId: []
        }
        this.priceTypeSymbol = {
            'FIXED' : props.currency,
            'PERCENT' : '%'
        }
    }
    setSelectedValue = (fullValueObject) => {
        const {getSelectedOptions} = this.props;
        const {selectedValueId, selectedValue} = this.state;
        if(!selectedValueId.includes(fullValueObject.id)){
            let newValues = selectedValue;
            let newSelectedValuesId = selectedValueId;
            newValues.push(fullValueObject)
            newSelectedValuesId.push(fullValueObject.id);
            this.setState({
                selectedValue : newValues,
                selectedValueId: newSelectedValuesId
            });
            getSelectedOptions(newSelectedValuesId);
        }else{
            let newValues = [];
            let newSelectedValuesId = [];
            selectedValue.map((item) => {
                if (fullValueObject.id !== item.id) {
                    newValues.push(item)
                    newSelectedValuesId.push(item.id);
                }
                return null;
            })
            this.setState({
                selectedValue : newValues,
                selectedValueId: newSelectedValuesId
            });
            getSelectedOptions(newValues);
        }
    }
    resetOptions = () => {
        const {getSelectedOptions} = this.props;
        this.setState({
            selectedValue : [],
            selectedValueId: []
        });
        getSelectedOptions([]);
    }
    setDefaultSelectedValue = () => {
        const {inputData} = this.props;
        inputData.map((value) => {
            if (value.is_default) this.setSelectedValue(value);
            return null;
        })
    }
    componentDidMount(){
        this.setDefaultSelectedValue();
    }
    getSelectedOptionStyle = (value) =>{
        const {selectedValueId} = this.state;
        let activeClass = '';
        if (selectedValueId.includes(value.id)) return true;
        else return false;
    }
  	render() {
  		const {inputData, inputLabel, required, resetShow} = this.props;
        // const {selectedValue, selectedValueId} = this.state;
	    return (
			<View>
                {<View>
    				{inputData.map((value, key) => (
        				<TouchableOpacity
        					onPress={resetShow ? ()=> this.setSelectedValue(value) : null}
                            style={this.getSelectedOptionStyle(value) ? styles.active_box_wrapper : styles.box_wrapper}
                        >
        			        <Text allowFontScaling={false} style={this.getSelectedOptionStyle(value) ? styles.active_text : styles.text}>{value.label}</Text>
                            {value.price > 0 &&
                                <Text allowFontScaling={false} style={this.getSelectedOptionStyle(value) ? styles.active_text : styles.text}>
                                    {` + ${value.price_type === 'FIXED' ? this.priceTypeSymbol['FIXED'] : ''}${value.price}${value.price_type === 'PERCENT' ? this.priceTypeSymbol['PERCENT'] : ''}`}
                                </Text>
                            }
        				</TouchableOpacity>
    				))}
                </View>}
			</View>
	    );
  	}
}
export default CheckBox;
// className={[Style.checkbox_wrapper, this.getSelectedOptionStyle(value)].join(' ')}
