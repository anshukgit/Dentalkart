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
  Switch,
  Button,
  TextField,
  Image,
  FlatList,
  ActivityIndicator,
  PermissionsAndroid,
  HelperText,
  ToastAndroid,
} from 'react-native';
import ReturnStyle from './ReturnListStyle';
import {ConfirmDialog} from 'react-native-simple-dialogs';
import {Query} from 'react-apollo';
import {GET_RETURNS_QUERY} from './graphql';
import CancelReturn from './modules/cancel_return';
import {client} from '@apolloClient';
import Header from '@components/header';
import Loader from '@components/loader';
import {fireAnalyticsEvent} from '@helpers/firebase_analytics';
import {DentalkartContext} from '@dentalkartContext';
import {
  showErrorMessage,
  showSuccessMessage,
} from '../../../../helpers/show_messages';
import HeaderComponent from '@components/HeaderComponent';

const sortByPosition = arr => {
  const sortedArr = arr.sort((A, B) => {
    if (A.position && B.position) {
      let positionA = A.position;
      let positionB = B.position;
      if (positionA < positionB) {
        return -1;
      }
      if (positionA > positionB) {
        return 1;
      }
      return 0;
    } else {
      console.error('Position Attribute is required');
      return 0;
    }
  });
  return sortedArr;
};
class ReturnList extends Component {
  static contextType = DentalkartContext;
  constructor() {
    super();
    this.state = {
      availableColumn: {
        return_id: {key: 'return_id', label: 'Return Id', position: 1},
        order_id: {key: 'order_id', label: 'Order Id', position: 2},
        status: {key: 'status', label: 'Status', position: 3},
        shipment_status: {
          key: 'shipment_status',
          label: 'Shipment Status',
          position: 4,
        },
        shipping_amount: {
          key: 'shipping_amount',
          label: 'Shipping Amount',
          position: 5,
        },
        total_repair_charge: {
          key: 'total_repair_charge',
          label: 'Repair Charge',
          position: 6,
        },
        created_at: {key: 'created_at', label: 'Created At', position: 7},
        can_cancel: {key: 'can_cancel', label: 'Action', position: 8},
      },
      visibleColumn: [],
      defaultVisibleColumns: [
        'return_id',
        'order_id',
        'status',
        'shipment_status',
        'created_at',
        'can_cancel',
        'shipping_amount',
        'total_repair_charge',
      ],
      dialogVisible: false,
      title: 'Return List',
    };
  }
  setVisibleColumn(values = []) {
    const {availableColumn} = this.state;
    let isSubset = true;
    values.map(item => {
      if (!Object.keys(availableColumn).includes(item)) {
        isSubset = false;
      }
      return null;
    });
    if (isSubset) {
      const sortedValues = sortByPosition(
        values.map(item => availableColumn[item]),
      );
      this.setState({visibleColumn: sortedValues});
    } else {
      console.log('Values is not a proper subset.');
    }
  }
  handleOnPress = () => {
    this.setState({
      dialogVisible: true,
    });
  };
  postCancellingReturn = (cache, {data}) => {
    try {
      client.writeQuery({
        query: GET_RETURNS_QUERY,
        data: {Returns: data.CancelReturn},
      });
      showSuccessMessage('Request cancelled successfully');
    } catch (e) {
      showErrorMessage(`${e}. Please try again.`);
    }
  };
  cancelReturn = returnItem => {
    return returnItem.item.can_cancel ? (
      <CancelReturn
        returnItem={returnItem.item}
        postCancellingReturn={this.postCancellingReturn}>
        {(
          cancelReturn,
          {data, loading, error},
          {cancelReturnDialog, closeDialog, openDialog},
        ) => {
          if (loading) {
            return <Loader loading={true} transparent={true} />;
          }
          return (
            <View>
              <Text
                allowFontScaling={false}
                style={{color: 'blue'}}
                onPress={() => openDialog()}>
                {' '}
                cancel
              </Text>
              <ConfirmDialog
                title="Cancel Return"
                message="Cancelling the return will stop return in process immediately."
                visible={cancelReturnDialog}
                onTouchOutside={() => closeDialog()}
                positiveButton={{
                  title: 'Ok',
                  onPress: () => {
                    closeDialog();
                    cancelReturn();
                  },
                }}
                negativeButton={{
                  title: 'Close',
                  onPress: () => {
                    closeDialog();
                  },
                }}
              />
            </View>
          );
        }}
      </CancelReturn>
    ) : (
      <Text allowFontScaling={false}> - </Text>
    );
  };
  getCellValue = (returnItem, {column}) => {
    const cellValue = {
      can_cancel: this.cancelReturn(returnItem),
      return_id: (
        <Text allowFontScaling={false} style={{color: 'blue'}}>
          {returnItem.item.return_id}
        </Text>
      ),
      order_id: (
        <Text allowFontScaling={false} style={{color: 'blue'}}>
          {returnItem.item.order_id}
        </Text>
      ),
      default: (
        <Text allowFontScaling={false}>
          {returnItem[column.key] !== null ? returnItem.item[column.key] : '-'}
        </Text>
      ),
    };
    return cellValue[column.key] ? cellValue[column.key] : cellValue.default;
  };
  triggerScreenEvent = _ => {
    const {userInfo} = this.context;
    fireAnalyticsEvent({
      eventname: 'screenname',
      screenName: 'Return List',
      userId: userInfo && userInfo.getCustomer ? userInfo.getCustomer.id : '',
    });
  };
  componentDidMount() {
    this.triggerScreenEvent();
    const {defaultVisibleColumns} = this.state;
    this.setVisibleColumn(defaultVisibleColumns);
  }
  render() {
    const {navigation} = this.props;
    const {visibleColumn, availableColumn, defaultVisibleColumns} = this.state;
    return (
      <View style={{backgroundColor: '#fff'}}>
        <HeaderComponent
          navigation={this.props.navigation}
          label={'Return List'}
          style={{height: 40}}
        />
        <ScrollView>
          <Query
            query={GET_RETURNS_QUERY}
            fetchPolicy="cache-and-network"
            onError={error => {
              showErrorMessage(`${error.message}. Please try again.`);
            }}>
            {({loading, error, data}) => {
              if (error) {
                return (
                  <Text allowFontScaling={false}>
                    Something Went Wrong Please Try Again
                  </Text>
                );
              }
              if (loading) {
                return <Loader loading={true} transparent={true} />;
              }
              if (data.Returns) {
                const returns = data.Returns;
                return (
                  <View style={{marginBottom: 50}}>
                    <FlatList
                      data={data.Returns}
                      renderItem={(returnItem, index) => (
                        <View key={index} style={ReturnStyle.cardWrapper}>
                          {visibleColumn.map((column, index) => (
                            <TouchableOpacity
                              style={{flexDirection: 'row'}}
                              onPress={() => {
                                this.props.navigation.navigate(
                                  'RmaHistoryScreen',
                                  {
                                    return_id: returnItem.item.return_id,
                                  },
                                );
                              }}>
                              <Text
                                allowFontScaling={false}
                                style={{fontWeight: 'bold'}}>
                                {availableColumn[column.key].label} :{' '}
                              </Text>
                              {this.getCellValue(returnItem, {column})}
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                      keyExtractor={(returnItem, index) =>
                        JSON.stringify(returnItem.return_id)
                      }
                      initialNumToRender={3}
                      ListEmptyComponent={() => (
                        <Text allowFontScaling={false}>
                          you have no pending Returns
                        </Text>
                      )}
                    />
                  </View>
                );
              } else {
                return <Loader loading={true} transparent={true} />;
              }
            }}
          </Query>
        </ScrollView>
      </View>
    );
  }
}

export default ReturnList;
