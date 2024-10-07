import React, {Component} from 'react';
import {View, Text, ActivityIndicator, ToastAndroid} from 'react-native';
import QuantitySelector from '@components/quantity_selector';
import {GET_CONFIGURABLE_PRODUCT_QUERY} from '../../../../graphql';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Query} from 'react-apollo';
import styles from './configurable_product.style';
import Picker from '@components/picker';
import {showErrorMessage} from '../../../../../../helpers/show_messages';
export default class ConfigurableProduct extends Component {
  constructor(props) {
    super(props);
    this.options = {};
    this.state = {
      _this: props._this,
      product: props.product,
    };
  }
  setSelectedOptions = (optionId, options, payload) => {
    const {_this} = this.props;
    this.options[optionId] = options;
    _this.setConfigurableProductOptions(this.options, payload);
  };
  setOptionId = attribute_id => {
    if (!this.options.hasOwnProperty(attribute_id)) {
      this.options[attribute_id] = [];
    }
  };
  render() {
    const {product, _this} = this.state;
    const {currency} = product.price.regularPrice.amount.currency;
    return (
      <View>
        {product.is_in_stock ? (
          <QuantitySelector
            qty={1}
            max_quantity={this.state.product?.max_sale_qty}
            id={product.id}
            sku={product.sku}
            product_this={_this}
            title="product"
          />
        ) : null}
        <Query
          query={GET_CONFIGURABLE_PRODUCT_QUERY}
          variables={{sku: product.sku}}
          fetchPolicy="cache-and-network"
          onError={error => {
            showErrorMessage(`${error.message}. Please try again.`);
          }}>
          {({data, loading, error}) => {
            if(loading || error) {
              return <ActivityIndicator size="large" color="#343434" />;
            }
            if (data.products) {
              const configurableOptions =
                data.products.items[0].configurable_options;
              const product = data.products.items[0];
              const productVariants = data.products.items[0].variants;
              return (
                <ConfigurableTypes
                  configurableOptions={configurableOptions}
                  productVariants={productVariants}
                  currency={currency}
                  configurable_this={this}
                  setSelectedOptions={this.setSelectedOptions}
                  setOptionId={this.setOptionId}
                  product={product}
                  _this={_this}
                />
              );
            }
          }}
        </Query>
      </View>
    );
  }
}

class ConfigurableTypes extends Component {
  constructor(props) {
    super(props);
    this.state = {
      configurableOptions: props.configurableOptions,
      configurable_keys: [],
      _configurableOptions: {},
      matrix: [],
    };
  }
  componentDidMount() {
    this.getConfigurableOptions();
  }
  getConfigurableOptions() {
    let {configurableOptions, _configurableOptions} = this.state;
    const {productVariants} = this.props;
    configurableOptions.map(function(item) {
      let values = {};
      item.values.map(function(child) {
        child.selected = false;
        values[child.value_index] = child;
      });
      _configurableOptions[item.attribute_code] = values;
    });
    const configurable_keys = Object.keys(_configurableOptions);
    this.setState(
      {
        configurable_keys: configurable_keys,
        _configurableOptions: _configurableOptions,
      },
      () => {
        this.createVariantMatrix(productVariants, configurable_keys);
      },
    );
  }
  createVariantMatrix(variants) {
    let matrix = [];
    const {configurable_keys} = this.state;
    variants.map(function(item) {
      const product = item.product;
      let temp = {};
      configurable_keys.map(function(key) {
        temp[key] = product[key];
      });
      temp.product = product;
      if (product.is_in_stock) {
        matrix.push(temp);
      }
    });
    this.setState({matrix: matrix}, () => {
      this.setOptionsStates(matrix);
    });
  }
  filterVariants(key, value, filtered) {
    const {matrix} = this.state;
    let filteredMatrix = matrix.filter(item => item[key] === value[0]);
    this.setOptionsStates(filteredMatrix, filtered);
  }
  resetConfigurableOptions = () => {
    let {_configurableOptions, configurable_keys, matrix} = this.state;
    matrix.map(function(item) {
      configurable_keys.map(function(key) {
        if (_configurableOptions[key][item[key]]) {
          _configurableOptions[key][item[key]].selected = true;
        }
      });
    });
    this.setState({
      _configurableOptions: _configurableOptions,
    });
  };
  resetDefaultConfigurableOptions() {
    let {_configurableOptions, configurable_keys, matrix} = this.state;
    matrix.map(function(item) {
      configurable_keys.map(function(key) {
        _configurableOptions[key][item[key]].selected = false;
      });
    });
    return _configurableOptions;
  }
  setOptionsStates(matrix, filtered) {
    let {_configurableOptions, configurable_keys} = this.state;
    let data = {};
    if (filtered) {
      data = this.resetDefaultConfigurableOptions();
    } else {
      data = _configurableOptions;
    }

    matrix.map(function(item) {
      configurable_keys.map(function(key) {
        if (data[key][item[key]]) {
          data[key][item[key]].selected = true;
        }
      });
    });
    this.setState({
      _configurableOptions: data,
    });
  }
  checkAvailableVariants = (attributeData, option_value) => {
    const {setSelectedOptions} = this.props;
    const payload = {
      item: this.props.product,
      productType: this.props.product.__typename,
      quantity: 1,
    };
    var data = [];
    data.push({
      id: parseInt(attributeData.attribute_id),
      value: option_value[0].toString(),
    });
    setSelectedOptions(attributeData.attribute_id, data, payload);
    this.filterVariants(attributeData.attribute_code, option_value, true);
  };

  render() {
    const {
      setSelectedOptions,
      productVariants,
      setOptionId,
      _this,
      currency,
    } = this.props;
    const {configurableOptions, _configurableOptions} = this.state;
    return (
      <View>
        {configurableOptions.map((item, index) => {
          const option_id = parseInt(item.attribute_id);
          setOptionId(item.attribute_id);
          return (
            <ConfigurableOptions
              key={index}
              optionData={item}
              currency={currency}
              setSelectedOptions={setSelectedOptions}
              _configurableOptions={_configurableOptions}
              configurableOptions={configurableOptions}
              checkAvailableVariants={this.checkAvailableVariants}
              resetConfigurableOptions={this.resetConfigurableOptions}
              _this={_this}
            />
          );
        })}
      </View>
    );
  }
}

class ConfigurableOptions extends Component {
  convertObjectTOArray() {
    const {
      optionData: {attribute_code},
      _configurableOptions,
    } = this.props;
    const _values = _configurableOptions[attribute_code] || [];
    const keys = Object.keys(_values);
    const data = [];
    keys.map(key => data.push(_values[key]));
    return data;
  }
  getSelectedOptions = option_value => {
    const {optionData, checkAvailableVariants} = this.props;
    checkAvailableVariants(optionData, option_value);
  };
  render() {
    const {
      currency,
      optionData: {values, label, attribute_code},
      _configurableOptions,
      configurableOptions,
      _this,
      resetConfigurableOptions,
    } = this.props;
    const _values = this.convertObjectTOArray();
    const inputProps = {
      inputData: _values,
      inputLabel: label,
      currency,
      getSelectedOptions: this.getSelectedOptions,
      type: 'configurable',
      resetConfigurableOptions: resetConfigurableOptions,
    };
    return (
      <View style={styles.configurableProductSelectionWrapper}>
        {configurableOptions ? (
          <View style={styles.optionsWrapper}>
            <View style={styles.configurablePickerLabelWrapper}>
              <Text allowFontScaling={false} style={styles.configurablePickerLabel}>{label}: </Text>
            </View>
            <Picker
              {...inputProps}
              title="choose an option"
              _this={_this}
              resetShow={true}
            />
          </View>
        ) : null}
      </View>
    );
  }
}
