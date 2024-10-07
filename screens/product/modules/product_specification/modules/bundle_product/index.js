import React, {Component} from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  FlatList,
  ToastAndroid,
} from 'react-native';
import {Query} from 'react-apollo';
import {GET_BUNDLE_PRODUCT_QUERY} from '../../../../graphql';
import Picker from '@components/picker';
import CheckBox from '@components/checkbox';
import QuantitySelector from '@components/quantity_selector';
import styles from './bundle_product.style';
import {showErrorMessage} from '../../../../../../helpers/show_messages';

export default class BundleProduct extends Component {
  constructor(props) {
    super(props);
    this.options = {};
    this.state = {
      product: props.product,
      _this: props._this,
    };
    this.orignalProduct = JSON.parse(JSON.stringify(props.product));
  }
  setSelectedOptions = (optionId, options) => {
    const {_this} = this.props;
    this.options[optionId] = options;
    _this.setProductOptions(this.options);
    this.changePrice();
  };
  getPercentIncrementPrice = (price, percent) => {
    return (price * percent) / 100;
  };
  getFixedIncrementPrice = (price, addByValue) => {
    return addByValue;
  };
  getPriceTypeMethod = symbol => {
    const priceTypeSymbol = {
      FIXED: this.getFixedIncrementPrice,
      PERCENT: this.getPercentIncrementPrice,
    };
    return priceTypeSymbol[symbol];
  };
  changePrice = () => {
    let newProduct = JSON.parse(JSON.stringify(this.state.product));
    let minimalPriceAddFactor = 0;
    let regularPriceAddFactor = 0;
    const minimalPrice = this.orignalProduct.price.minimalPrice.amount.value;
    const regularPrice = this.orignalProduct.price.regularPrice.amount.value;
    Object.keys(this.options).map(key => {
      if (this.options[key].length > 0) {
        this.options[key].map(item => {
          if (item.price > 0) {
            minimalPriceAddFactor =
              minimalPriceAddFactor +
              this.getPriceTypeMethod(item.price_type)(
                minimalPrice,
                item.price,
              );
            regularPriceAddFactor =
              regularPriceAddFactor +
              this.getPriceTypeMethod(item.price_type)(
                regularPrice,
                item.price,
              );
          }
        });
      }
    });
    newProduct.price.minimalPrice.amount.value =
      minimalPrice + minimalPriceAddFactor;
    newProduct.price.regularPrice.amount.value =
      regularPrice + regularPriceAddFactor;
    this.setState({product: newProduct});
  };
  render() {
    const {_this, product} = this.state;
    const currency = product.price.regularPrice.amount.currency;
    return (
      <View>
        {product.is_in_stock ? (
          <QuantitySelector
            qty={1}
            max_quantity={this.state.product?.max_sale_qty}
            id={product.id}
            product_this={_this}
            title="product"
          />
        ) : null}
        <Query
          query={GET_BUNDLE_PRODUCT_QUERY}
          variables={{sku: product.sku}}
          fetchPolicy="cache-and-network"
          onError={error => {
            showErrorMessage(`${error.message}. Please try again.`);
          }}>
          {({data, loading, error}) => {
            if (loading || error)
              return <ActivityIndicator size="large" color="#343434" />;
            if (data.products) {
              const productProperties = data.products.items[0];
              return (
                <View>
                  {productProperties.items.map((item, index) => {
                    if (!this.options.hasOwnProperty(item.option_id)) {
                      this.options[item.option_id] = [];
                    }
                    return (
                      <View
                        style={styles.configurableProductSelectionWrapper}
                        key={index}>
                        {item.options ? (
                          <View>
                            <Text
                              allowFontScaling={false}
                              style={styles.productIndex}>
                              Choose from Product {index + 1} -
                            </Text>
                            <View style={styles.optionsWrapper}>
                              <View
                                style={styles.configurablePickerLabelWrapper}>
                                <Text
                                  allowFontScaling={false}
                                  style={styles.configurablePickerLabel}>
                                  {item.title}
                                  {item.required ? '*' : ''}:{' '}
                                </Text>
                              </View>
                              <BundleOptions
                                currency={currency}
                                optionData={item}
                                setSelectedOptions={this.setSelectedOptions}
                                _this={_this}
                              />
                            </View>
                          </View>
                        ) : null}
                      </View>
                    );
                  })}
                </View>
              );
            }
          }}
        </Query>
      </View>
    );
  }
}

class BundleOptions extends Component {
  getSelectedOptions = values => {
    const {optionData, setSelectedOptions} = this.props;
    let selectedOptions = [];
    values.map(id => {
      let option = {};
      if (id) {
        option.id = optionData.option_id;
        option.value = id.toString();
        optionData.options.map(item => {
          if (item.id === id) {
            option.price = item.price;
            option.price_type = item.price_type;
          }
        });
        selectedOptions.push(option);
      }
    });
    setSelectedOptions(optionData.option_id, selectedOptions);
  };
  getInputType = () => {
    const {
      currency,
      optionData: {options, title, type, required},
      _this,
    } = this.props;
    const inputProps = {
      inputData: options,
      inputLabel: title,
      required,
      currency,
      type: 'bundle',
      getSelectedOptions: this.getSelectedOptions,
    };
    const bundleInputTypes = {
      radio: (
        <Picker
          {...inputProps}
          title="choose an option"
          currency={currency}
          _this={_this}
          resetShow={!required && options.length > 1 ? true : false}
        />
      ),
      select: (
        <Picker
          {...inputProps}
          title="choose an option"
          currency={currency}
          _this={_this}
          resetShow={!required && options.length > 1 ? true : false}
        />
      ),
      multi: (
        <CheckBox
          {...inputProps}
          resetShow={!required && options.length > 1 ? true : false}
          currency={currency}
        />
      ),
      checkbox: (
        <CheckBox
          {...inputProps}
          resetShow={!required && options.length > 1 ? true : false}
          currency={currency}
        />
      ),
    };
    return bundleInputTypes[type];
  };
  render() {
    return <View>{this.getInputType()}</View>;
  }
}
