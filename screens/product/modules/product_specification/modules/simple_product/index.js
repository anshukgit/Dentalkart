import React, {Component} from 'react';
import {View, Text} from 'react-native';
import QuantitySelector from '@components/quantity_selector';

export default class SimpleProduct extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _this: props._this,
      product: props.product,
    };
  }
  render() {
    const {product, _this} = this.state;
    return (
      <View style={{marginBottom: 7}}>
        {product.is_in_stock ? (
          <QuantitySelector
            qty={1}
            max_quantity={this.props?.product?.max_sale_qty}
            id={product.id}
            sku={product.sku}
            product_this={_this}
            title="product"
          />
        ) : null}
      </View>
    );
  }
}
