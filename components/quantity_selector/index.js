import React, {Component} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Modal,
} from 'react-native';
import TouchableCustom from '@helpers/touchable_custom';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './quantity_selector.style';

const RenderQuantityPicker = ({_this}) => {
  console.warn(
    'RenderQuantityPicker ::: ',
    _this.props.title +
      ' - ' +
      _this.state.cartQty +
      ' -  ' +
      _this.state.quantity,
  );
  return (
    <View style={{}}>
      <TouchableCustom
        underlayColor={'#ffffff10'}
        onPress={() => _this.openModal()}>
        <View style={styles.quantityPickerWrapper}>
          <Text allowFontScaling={false} style={styles.quantityTitle}>
            Qty:{' '}
          </Text>
          <Text allowFontScaling={false} style={styles.quantityTitle}>
            {_this.props.title === 'cart'
              ? _this.state.cartQty
              : _this.state.quantity}
          </Text>
          {/* <Text allowFontScaling={false} style={styles.quantityTitle}>{ _this.state.quantity}</Text> */}
          <Icon name="chevron-down" size={17} style={styles.dropdownIcon} />
        </View>
      </TouchableCustom>
    </View>
  );
};

const RenderQuantityInput = ({_this}) => {
  const maxQuantity = _this.props.max_quantity;
  const updateQty = input => {
    if (_this.props.max_quantity && input <= maxQuantity) {
      _this.setState({inputFieldQuantityValue: input});
    } else {
      _this.setState({inputFieldQuantityValue: maxQuantity});
    }
  };
  return (
    <View style={styles.quantityInputWrapper}>
      <TextInput
        maxLength={
          _this.props.max_quantity
            ? _this.props.max_quantity?.toString()?.length
            : 2
        }
        style={styles.quantityInput}
        onChangeText={updateQty}
        value={_this.state.inputFieldQuantityValue}
        underlineColorAndroid={'transparent'}
        selectTextOnFocus={true}
        returnKeyType={'done'}
        onSubmitEditing={() => _this.onPressUpdate()}
        autoFocus
        keyboardType={'numeric'}
      />
      <TouchableCustom
        underlayColor={'#ffffff10'}
        onPress={() => _this.onPressUpdate()}>
        <View style={styles.updateButton}>
          <Text allowFontScaling={false} style={styles.updateButtonText}>
            Update
          </Text>
        </View>
      </TouchableCustom>
    </View>
  );
};

const SelectQuantity = ({_this}) => {
  _this.props.title === 'product'
    ? (staticQuantity = [0, 1, 2, 3, 4, 5, 6, 7, 8, 'more'])
    : (staticQuantity = [1, 2, 3, 4, 5, 6, 7, 8, 9, 'more']);
  return (
    <Modal
      visible={_this.state.modalVisible}
      onRequestClose={() => _this.closeModal()}
      transparent
      animationType={'fade'}>
      <View style={styles.modalWrapper}>
        <TouchableOpacity
          onPress={() => _this.closeModal()}
          style={styles.modalOverlay}></TouchableOpacity>
        <View style={styles.modalContainer}>
          {/* <TouchableCustom underlayColor={'#ffffff10'} onPress={() => _this.changeQuantityState(item)}> */}
          <View style={[styles.listWrapper]}>
            <Text allowFontScaling={false} style={{fontSize: 16}}>
              Qty:
            </Text>
          </View>
          {/* </TouchableCustom> */}
          <FlatList
            data={staticQuantity}
            listKey={(item, index) => index.toString()}
            keyExtractor={(item, index) => 'qty-' + index.toString()}
            renderItem={({item, index}) => (
              <TouchableCustom
                underlayColor={'#ffffff10'}
                onPress={() => _this.changeQuantityState(item)}>
                <View
                  style={[
                    styles.listWrapper,
                    item === 'more' ? styles.lastQuantity : null,
                  ]}>
                  <Text allowFontScaling={false}>{item}</Text>
                </View>
              </TouchableCustom>
            )}
          />
        </View>
      </View>
    </Modal>
  );
};
export default class QuantitySelector extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity: props.qty,
      inputFieldQuantityValue: null,
      quantityInput: false,
      quantitySelect: true,
      modalVisible: false,
      cartQty: props.qty,
    };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.title === 'cart' && props.qty !== state.cartQty) {
      return {
        cartQty: props.qty,
      };
    }
    return null;
  }

  openModal() {
    console.warn('on open modal : ', this.state.cartQty, this.state.quantity);

    this.setState({
      inputFieldQuantityValue: this.state.cartQty,
      modalVisible: true,
    });
  }
  closeModal() {
    this.setState({modalVisible: false});
  }
  componentDidUpdate(prevProps, prevState) {
    //  ((this.state.quantity || this.state.quantity == 0) && (prevState.quantity != this.state.quantity)) ? (this.update_qty()) : null
  }
  onPressUpdate() {
    this.state.inputFieldQuantityValue
      ? //     (this.state.quantity != this.state.inputFieldQuantityValue) ? (
        (this.setState({quantity: this.state.inputFieldQuantityValue}, () => {
          this.update_qty();
        }),
        this.setState({quantityInput: false}),
        this.setState({quantitySelect: true}))
      : // ) : (
        //     this.setState({ quantityInput: false }),
        //     this.setState({ quantitySelect: true })
        // )
        (this.setState({quantityInput: false}),
        this.setState({quantitySelect: true}));
  }
  changeQuantityState(qty) {
    console.warn(
      'changeQuantityState on open modal : ',
      qty,
      this.state.cartQty,
      this.state.quantity,
      qty,
    );

    this.state.modalVisible ? this.closeModal() : null;
    let typcst;
    qty === 'more'
      ? ((typcst = String(this.state.cartQty)), // String(this.state.quantity),
        console.warn('typcst quantity : ', typcst),
        this.setState({inputFieldQuantityValue: typcst}),
        this.setState({quantityInput: true}),
        this.setState({quantitySelect: false}))
      : (this.setState({quantityInput: false}),
        this.setState({quantitySelect: true}),
        this.setState({quantity: qty}, () => this.update_qty()));
  }
  update_qty() {
    switch (this.props.title) {
      case 'cart':
        this.props.updateQuantity(this.state.quantity, this.props.id);
        break;
      case 'product':
        if (this.props.type === 'grouped') {
          this.props.product_this.updateQuantity(
            this.state.quantity,
            this.props.sku,
            this.props.type,
            this.props.productPrice,
          );
          this.props?.onUpdateQuantity(
            this.state.quantity,
            this.props.productPrice,
            this.props.sku,
          );
          break;
        } else {
          this.props.product_this.updateQuantity(
            this.state.quantity,
            this.props.id,
            this.props.sku,
          );
          break;
        }
      default:
        null;
    }
  }
  render() {
    return (
      <View style={styles.quantityWrapper}>
        <SelectQuantity _this={this} />
        {this.state.quantitySelect ? (
          <RenderQuantityPicker _this={this} />
        ) : (
          <RenderQuantityInput _this={this} />
        )}
      </View>
    );
  }
}
