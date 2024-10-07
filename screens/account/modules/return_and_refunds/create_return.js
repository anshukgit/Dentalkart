import React, {Component} from 'react';
import {
  View,
  TextInput,
  TouchableNativeFeedback,
  Text,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Linking,
  Picker,
  CheckBox,
  Button,
  TextField,
  Image,
} from 'react-native';
import {GET_RETURN_EXCHANGE} from './graphql';
import ReturnStyle from './ReturnListStyle';
import {GET_ORDER_DETAILS_N_EXCHANGE_TYPES} from './graphql';
import {Query} from 'react-apollo';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '@components/header';
import {AttachmentBlock} from '@helpers/attachments';
import SubmitReturn from './modules/submit_return_mutation';
import {DentalkartContext} from '@dentalkartContext';
import Loader from '@components/loader';
import {fireAnalyticsEvent} from '@helpers/firebase_analytics';
import {showErrorMessage} from '../../../../helpers/show_messages';
import HeaderComponent from '@components/HeaderComponent';

const HeaderDetails = ({userInfo, itemObject}) => {
  return (
    <View style={ReturnStyle.cardWrapper}>
      <Text allowFontScaling={false} style={ReturnStyle.headerText}>
        #{itemObject.order_id}
      </Text>
      {userInfo && (
        <View style={ReturnStyle.infoContainer}>
          <Text allowFontScaling={false} style={ReturnStyle.headerText}>
            Request Information :{' '}
          </Text>
          <View style={ReturnStyle.addressContainer}>
            <Text allowFontScaling={false} style={ReturnStyle.headerText}>
              Customer Name :{' '}
            </Text>
            <Text allowFontScaling={false}>
              {userInfo.firstname + ' '}
              {userInfo.lastname}
            </Text>
          </View>
          <View style={ReturnStyle.addressContainer}>
            <Text allowFontScaling={false} style={ReturnStyle.headerText}>
              Email-address :{' '}
            </Text>
            <Text allowFontScaling={false}>{userInfo.email}</Text>
          </View>
        </View>
      )}
      <View style={ReturnStyle.shippingContainer}>
        <Text allowFontScaling={false} style={ReturnStyle.headerText}>
          Order Shipping Adrress :
        </Text>
        <Text allowFontScaling={false}>{itemObject.shipping_address.name}</Text>
        <Text allowFontScaling={false}>
          {itemObject.shipping_address.street},{' '}
          {itemObject.shipping_address.region} (
          {itemObject.shipping_address.postcode})
        </Text>
        <Text allowFontScaling={false}>
          {itemObject.shipping_address.country_id}
        </Text>
        <Text allowFontScaling={false}>
          Mob: {itemObject.shipping_address.telephone}
        </Text>
      </View>
    </View>
  );
};
class ItemBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reason: '',
      condition: '',
      resolution: '',
      reasonData: {key: 'reason', options: []},
      conditionData: {key: 'condition', options: []},
      resolutionData: {key: 'resolution', options: []},
      quantity: '',
      checked: false,
      fieldvisibility: false,
      description: '',
      initialSelectData: props.selectsData,
      attachments: [],
      errors: props.errors,
      itemDeclaration: false,
    };
  }
  componentDidMount() {
    const {
      item: {
        return: {options},
      },
    } = this.props;
    this.setState({
      resolutionData: {key: 'resolution', options: options.resolution_options},
      reasonData: {key: 'reason', options: options.reason_options},
      conditionData: {key: 'condition', options: options.condition_options},
    });
  }
  static getDerivedStateFromProps(props, state) {
    if (props.errors !== state.errors) {
      return {errors: props.errors};
    }
    return null;
  }
  triggerEventChange = (event, field) => {
    let ifError = false;
    ifError = this.checkFieldError(event, field);
    const getCurrentField = {
      itemCheck: this.setItemCheck,
      reason: this.selectChangeTriggered,
      condition: this.selectChangeTriggered,
      resolution: this.selectChangeTriggered,
      quantity: this.setQuantity,
      description: this.setDescription,
      //"itemDeclaration": this.setTermCheck,
      default: () => console.error('Wrong Field Provided'),
    };
    if (!ifError) {
      getCurrentField[field]
        ? getCurrentField[field](event, field)
        : getCurrentField.default();
    }
  };
  checkFieldError = (event, field) => {
    let error = false;
    const {errors} = this.state;
    const tempErrors = errors;
    const getCurrentField = {
      reason: () => {
        if (errors.reason) {
          tempErrors.reason = false;
        }
        error = false;
      },
      condition: () => {
        if (errors.condition) {
          tempErrors.condition = false;
        }
        error = false;
      },
      resolution: () => {
        if (errors.resolution) {
          tempErrors.resolution = false;
        }
        error = false;
      },
      //"itemDeclaration": () =>{if(errors.itemDeclaration) tempErrors.itemDeclaration = false;  error = false},
      itemCheck: () => {
        error = false;
      },
      quantity: () => {
        if (errors.quantity) {
          tempErrors.quantity = false;
        }
        error =
          (event > 0 && event <= this.props.item.return.returnable_qty) ||
          event === ''
            ? false
            : true;
      },
      description: () => {
        if (errors.description) {
          tempErrors.description = false;
        }
        error = false;
      },
      default: () => console.error('Wrong Field Provided'),
    };
    getCurrentField[field]
      ? getCurrentField[field]()
      : getCurrentField.default();
    this.setState({errors: tempErrors});
    return error;
  };
  selectChangeTriggered = (value, field) => {
    if (value) {
      this.setState({[field]: value}, () => {
        this.sendSelectionToParent();
      });
    } else {
      this.setState({[field]: ''});
    }
  };
  setTermCheck = event => {
    //this.setState({itemDeclaration:!this.state.itemDeclaration}, ()=>this.sendSelectionToParent())
  };
  setQuantity = value => {
    if (value) {
      this.setState({quantity: value}, () => this.sendSelectionToParent());
    } else {
      this.setState({quantity: ''});
    }
  };
  setDescription = text => {
    if (text) {
      this.setState({description: text}, () => this.sendSelectionToParent());
    } else {
      this.setState({description: ''});
    }
  };
  setItemCheck = () => {
    this.setState(
      {
        checked: !this.state.checked,
        fieldvisibility: !this.state.fieldvisibility,
      },
      () => this.sendSelectionToParent(),
    );
  };
  sendSelectionToParent = () => {
    const {setSelectedItem, item} = this.props;
    const baseImage = [];
    const {
      reason,
      condition,
      resolution,
      quantity,
      checked,
      description,
      attachments,
      itemDeclaration,
    } = this.state;
    if (attachments.length > 0) {
      attachments.map(data => baseImage.push(data.uri));
    }
    let selectedOptions = {
      reason: reason.value,
      condition: condition.value,
      resolution: resolution.value,
      quantity: quantity,
      description: description,
      attachments: baseImage,
    };
    let itemWithSelection = {...item, selectedOptions, checked};
    setSelectedItem(itemWithSelection);
  };
  /*componentDidUpdate(prevProps, prevState) {
        if (prevState.attachments!== this.state.attachments) {
               this.setState({ attachments : this.state.attachments }, () => sendSelectionToParent());
        }
        console.log('hello')
   }*/
  render() {
    const {item} = this.props;
    //const {item: {return: {options}}} = this.props;
    const {reasonData, conditionData, resolutionData, errors, attachments} =
      this.state;
    const selects = [resolutionData, conditionData, reasonData];
    return (
      <View style={ReturnStyle.itemBoxContainer}>
        <View style={ReturnStyle.imageBox}>
          <CheckBox
            style={{width: '10%'}}
            disabled={item.return.can_return ? false : true}
            value={this.state.checked}
            onChange={event => this.triggerEventChange(event, 'itemCheck')}
          />
          <View style={ReturnStyle.imageWrapper}>
            <Image style={ReturnStyle.image} source={{uri: item.thumbnail}} />
          </View>
          <View style={{width: '50%'}}>
            <Text
              allowFontScaling={false}
              style={ReturnStyle.itemName}
              ellipsizeMode="tail"
              numberOfLines={3}>
              {item.name}
            </Text>
            {!item.return.can_return && (
              <View style={ReturnStyle.termContainer}>
                <Text allowFontScaling={false}>
                  <Icon
                    style={{
                      fontSize: 20,
                      jusitifyContent: 'center',
                      textAlignVertical: 'center',
                    }}
                    name="md-warning"
                  />
                </Text>
                <Text
                  allowFontScaling={false}
                  style={{fontSize: 10, width: '80%', paddingLeft: 7}}>
                  {' '}
                  No return available for this product
                </Text>
              </View>
            )}
          </View>
        </View>
        {this.state.fieldvisibility && (
          <View style={{marginTop: 5}}>
            <View style={{flexDirection: 'row'}}>
              <TextInput
                style={ReturnStyle.textInput}
                keyboardType="numeric"
                onChangeText={qty => this.triggerEventChange(qty, 'quantity')}
                value={this.state.quantity}
              />
              <Text
                allowFontScaling={false}
                style={{
                  fontSize: 20,
                  alignContent: 'center',
                  textAlignVertical: 'center',
                }}>
                {' '}
                /{item.return.returnable_qty}
              </Text>
            </View>
            <Text allowFontScaling={false} style={ReturnStyle.errorText}>
              {errors.quantity && 'Please select quantity'}
            </Text>
            {selects.map((select, index) => {
              return (
                <View>
                  <View style={ReturnStyle.itemSelectBox}>
                    <Picker
                      selectedValue={this.state[select.key]}
                      enabled={!select.disabled}
                      onValueChange={(itemValue, itemIndex) =>
                        this.triggerEventChange(itemValue, select.key)
                      }>
                      <Picker.Item
                        label={`Select ${
                          select.key.charAt(0).toUpperCase() +
                          select.key.slice(1)
                        } options `}
                        value={
                          select.key.charAt(0).toUpperCase() +
                          select.key.slice(1)
                        }
                      />
                      {select.options
                        .filter(data => !data.disabled)
                        .map((option, index) => {
                          return (
                            <Picker.Item
                              disabled={option.disabled}
                              key={index}
                              label={option.label}
                              value={option}
                            />
                          );
                        })}
                    </Picker>
                  </View>
                  <Text allowFontScaling={false} style={ReturnStyle.errorText}>
                    {errors[select.key] && `Please select ${select.key}`}
                  </Text>
                </View>
              );
            })}
            <TextInput
              style={ReturnStyle.inputTextArea}
              multiline={true}
              numberOfLines={6}
              onChangeText={text =>
                this.triggerEventChange(text, 'description')
              }
              placeholder=" Add Description...."
              underlineColorAndroid="transparent"
            />
            <Text allowFontScaling={false} style={ReturnStyle.errorText}>
              {errors.description && 'Please fill description'}
            </Text>
            <View style={ReturnStyle.attachButtons}>
              <AttachmentBlock instance={this} />
            </View>
            <Text allowFontScaling={false} style={ReturnStyle.errorText}>
              {attachments.length < 1 &&
                errors.attachments &&
                'Please upload attachments'}
            </Text>
            {/*<View style={{flexDirection:'row' }}>
                            <CheckBox
                                style={ReturnStyle.termCheck}
                                value={this.state.itemDeclaration}
                                onChange={(event)=>this.triggerEventChange(event,'itemDeclaration')}
                            />
                           <Text allowFontScaling={false} style={ReturnStyle.termText}>terms and condition</Text>
                      </View>*/}
            <Text allowFontScaling={false} style={ReturnStyle.errorText}>
              {errors.itemDeclaration && 'Please select terms and conditions'}
            </Text>
            <View style={ReturnStyle.termContainer}>
              <Text allowFontScaling={false}>
                <Icon
                  style={{fontSize: 20, jusitifyContent: 'center'}}
                  name="md-warning"
                />
              </Text>
              <Text
                allowFontScaling={false}
                style={{fontSize: 10, paddingLeft: 7, width: '80%'}}>
                {item.return.error_message}
              </Text>
            </View>
          </View>
        )}
      </View>
    );
  }
}

class ItemList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      selectedItems: [],
      globalDescription: '',
      globalDescriptionErr: false,
      globalDeclaration: false,
      globalDeclarationErr: false,
      finalSelectedProducts: [],
    };
  }
  proceedSubmitReturn = submitReturn => {
    const {selectedItems, globalDeclaration} = this.state;
    const tempFinalSelectedProducts = [];
    const errors = {};
    let globlaError = false;
    Object.keys(selectedItems).map(sku => {
      const item = selectedItems[sku];
      if (item.checked) {
        tempFinalSelectedProducts.push(item);
        errors[sku] = {};
        const {
          selectedOptions: {
            attachments,
            condition,
            description,
            quantity,
            reason,
            resolution,
          },
        } = item;
        if (!condition) {
          errors[sku].condition = true;
          globlaError = true;
        }
        if (!description) {
          errors[sku].description = true;
          globlaError = true;
        }
        //if (!itemDeclaration)  {errors[sku].itemDeclaration = true; globlaError = true};
        if (!quantity) {
          errors[sku].quantity = true;
          globlaError = true;
        }
        if (!reason) {
          errors[sku].reason = true;
          globlaError = true;
        }
        if (!resolution) {
          errors[sku].resolution = true;
          globlaError = true;
        }
        if (attachments.length < 1) {
          errors[sku].attachments = true;
          globlaError = true;
        }
      }

      return null;
    });

    if (!globalDeclaration) {
      this.setState({globalDeclarationErr: true});
      globlaError = true;
    }

    this.setState(
      {errors: errors, finalSelectedProducts: tempFinalSelectedProducts},
      () => {
        if (!globlaError && tempFinalSelectedProducts.length > 0) {
          submitReturn();
        }
      },
    );
  };
  static getDerivedStateFromProps(props, state) {
    if (props.selectedItems !== state.selectedItems) {
      return {selectedItems: props.selectedItems};
    }
    return null;
  }
  handleDeclaration = () => {
    const {globalDeclaration, globalDeclarationErr} = this.state;
    if (globalDeclarationErr) {
      this.setState({globalDeclarationErr: false});
    }
    this.setState({globalDeclaration: !globalDeclaration});
  };
  render() {
    const {
      errors,
      globalDescription,
      globalDeclaration,
      globalDescriptionErr,
      globalDeclarationErr,
      finalSelectedProducts,
    } = this.state;
    const {
      itemValue,
      setSelectedItem,
      orderId,
      selectsData,
      navigation,
      dispatch,
    } = this.props;
    return (
      <View style={ReturnStyle.cardWrapper}>
        {Object.keys(itemValue).map((item, key) => (
          <ItemBox
            item={itemValue[item]}
            key={key}
            setSelectedItem={setSelectedItem}
            selectsData={selectsData}
            errors={errors[item] ? errors[item] : {}}
          />
        ))}
        <View style={ReturnStyle.itemListBottomContent}>
          <TextInput
            style={ReturnStyle.inputTextArea}
            multiline={true}
            onChangeText={text => this.setState({globalDescription: text})}
            numberOfLines={6}
            placeholder=" Any Returns Comments...."
            underlineColorAndroid="transparent"
          />
          <Text allowFontScaling={false} style={ReturnStyle.errorText}>
            {globalDescriptionErr && 'Please specify description'}
          </Text>
          <SubmitReturn
            selectedItems={finalSelectedProducts}
            dispatch={dispatch}
            navigation={navigation}
            orderId={orderId}
            globalDescription={globalDescription}
            globalDeclaration={globalDeclaration}>
            {(submitReturn, {data, loading, error}) => {
              if (loading) {
                return <Loader loading={true} transparent={true} />;
              } else {
                return (
                  <TouchableOpacity
                    style={ReturnStyle.button}
                    onPress={() => this.proceedSubmitReturn(submitReturn)}>
                    <Text allowFontScaling={false} style={ReturnStyle.text}>
                      Submit
                    </Text>
                  </TouchableOpacity>
                );
              }
            }}
          </SubmitReturn>
          <View style={ReturnStyle.imageBox}>
            <CheckBox
              style={ReturnStyle.termCheck}
              value={globalDeclaration}
              onChange={() => this.handleDeclaration()}
            />
            <Text allowFontScaling={false} style={ReturnStyle.termText}>
              {'I accept return terms and condition.'}
            </Text>
          </View>
          <Text allowFontScaling={false} style={ReturnStyle.errorText}>
            {globalDeclarationErr && 'Please select terms and conditions'}
          </Text>
        </View>
      </View>
    );
  }
}

class CreateReturn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItems: {},
    };
  }
  static contextType = DentalkartContext;
  setSelectedItems = item => {
    const {selectedItems} = this.state;
    const newSelectedItems = selectedItems;
    newSelectedItems[item.sku] = item;
    this.setState({selectedItems: newSelectedItems});
  };
  triggerScreenEvent = _ => {
    const {userInfo} = this.context;
    fireAnalyticsEvent({
      eventname: 'screenname',
      screenName: 'Create Return',
      userId: userInfo && userInfo.getCustomer ? userInfo.getCustomer.id : '',
    });
  };
  componentDidMount() {
    this.triggerScreenEvent();
  }
  render() {
    var itemValue = {};
    var itemObject = {};
    const {selectedItems} = this.state;
    const {navigation, dispatch} = this.props;
    const orderId = navigation.getParam('orderId', 'No-ID');
    const {userInfo} = this.context;
    const user = userInfo.getCustomer;
    return (
      <View style={{backgroundColor: '#fff'}}>
        <HeaderComponent
          navigation={this.props.navigation}
          label={'Create Return'}
          style={{height: 40}}
        />
        <ScrollView keyboardShouldPersistTaps="handled">
          <KeyboardAvoidingView
            style={ReturnStyle.contentContainer}
            behaviour="padding"
            enabled>
            <View>
              <Query
                query={GET_ORDER_DETAILS_N_EXCHANGE_TYPES}
                variables={{order_id: orderId.toString()}}
                fetchPolicy="cache-and-network"
                onError={error => {
                  showErrorMessage(`${error.message}. Please try again.`);
                }}>
                {({loading, data, error}) => {
                  if (loading) {
                    return <Loader loading={true} transparent={true} />;
                  }
                  if (error) {
                    return (
                      <Text allowFontScaling={false}>Something Went Wrong</Text>
                    );
                  }
                  if (data.OrderDetails) {
                    itemObject = data.OrderDetails;
                    data.OrderDetails.order_details.My_Shipments.map(shipment =>
                      shipment.items.map(product => {
                        if (!itemValue.hasOwnProperty([product.sku])) {
                          itemValue[product.sku] = product;
                        }
                        return null;
                      }),
                    );
                  }
                  return (
                    <View>
                      <HeaderDetails userInfo={user} itemObject={itemObject} />
                      <ItemList
                        itemValue={itemValue}
                        navigation={navigation}
                        dispatch={dispatch}
                        setSelectedItem={this.setSelectedItems}
                        orderId={orderId}
                        selectedItems={selectedItems}
                      />
                    </View>
                  );
                }}
              </Query>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
    );
  }
}

export default CreateReturn;
