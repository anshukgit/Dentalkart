import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import DropDownPicker from 'react-native-dropdown-picker';
import {showErrorMessage} from '../../../../../helpers/show_messages';

const ItemRender = ({
  updateReutrnItemObject,
  removeReturnItemObject,
  orderData,
  returnReasons,
  returnActions,
  formSubmitted,
  canReturn,
}) => {
  const [selectCheckbox, setSelectCheckbox] = useState(false);

  const [openQty, setOpenQty] = useState(false);
  const [qty, setQty] = useState(null);
  const [qtyItems, setQtyItems] = useState([]);

  const [openReason, setOpenReason] = useState(false);
  const [openSubReason, setOpenSubReason] = useState(false);
  const [reason, setReason] = useState(null);
  const [subReason, setSubReason] = useState('');
  const [reasonItems, setReasonItems] = useState([]);
  const [subReasons, setSubReasons] = useState([]);

  const [openAction, setOpenAction] = useState(false);
  const [action, setAction] = useState(null);
  const [actionItems, setActionItems] = useState([]);

  useEffect(() => {
    let sub = reasonItems.filter(item => item.value === reason);

    setSubReasons(sub?.[0]?.children?.length > 0 ? sub?.[0]?.children : []);
  }, [reason, reasonItems]);

  useEffect(() => {
    setQty(null), setReason(null);
    setAction(null);
    setSelectCheckbox(false);
  }, [formSubmitted]);

  useEffect(() => {
    if (!selectCheckbox) {
      setQty(null);
      setReason(null);
      setAction(null);
      setSubReason('');
    }
  }, [selectCheckbox]);

  useEffect(() => {
    if (orderData && orderData?.qty_ordered > 0) {
      let data = [];
      for (let i = 1; i <= orderData?.qty_ordered; i++) {
        let newData = {
          id: i,
          label: i,
          value: i,
        };
        data.push(newData);
      }
      setQtyItems(data);
    }
  }, [orderData]);

  useEffect(() => {
    if (reason || action || qty || subReason) {
      updateObject();
    }
  }, [reason, action, qty, subReason]);

  const updateObject = () => {
    let reasonAttachment = reasonItems.find(
      element => element.value === reason,
    );
    let data = {
      sku: orderData?.sku,
      name: orderData?.name,
      image: orderData?.image,
      qty: qty,
      action: action,
      reason: reason,
      sub_reason: subReason,
      attachment: reasonAttachment?.attachment ?? false,
    };
    updateReutrnItemObject(data);
  };

  useEffect(() => {
    returnReasons?.length && setReasonItems(returnReasons);
  }, [returnReasons]);

  useEffect(() => {
    returnActions?.length && setActionItems(returnActions);
  }, [returnActions]);

  return (
    <View style={{marginBottom: hp('3%')}}>
      <View style={styles.itemHeaderContainer}>
        <View style={styles.itemHeaderImageContainer}>
          <Image
            resizeMode="contain"
            source={{uri: orderData?.image}}
            style={styles.itemHeaderImage}
          />
        </View>
        <Text style={styles.itemHeaderText}>{orderData?.name}</Text>
        <CheckBox
          tintColors={{
            true: '#1876d1',
            false: canReturn ? '#e8e8e8' : '#666666',
          }}
          disabled={canReturn}
          tintColor={'#666666'}
          style={{width: 20, height: 20}}
          boxType={'square'}
          onFillColor={'#1876d1'}
          onCheckColor={'#FFF'}
          value={selectCheckbox}
          onValueChange={value => {
            setSelectCheckbox(selectCheckbox => !selectCheckbox),
              !value ? removeReturnItemObject(orderData?.sku) : updateObject();
          }}
        />
      </View>
      {canReturn ? (
        <Text style={styles.returnErrorText}>{'Non Returnable'}</Text>
      ) : null}
      <View pointerEvents={selectCheckbox ? 'auto' : 'none'}>
        <DropDownPicker
          listMode="MODAL"
          placeholder="Qty *"
          placeholderStyle={styles.dropDownPlaceholderText}
          style={styles.dropDownStyle}
          dropDownContainerStyle={styles.dropDownOpenContainerStyle}
          containerStyle={styles.dropDownContainerStyle}
          textStyle={styles.dropDownTextStyle}
          open={openQty}
          value={qty}
          items={qtyItems}
          setOpen={setOpenQty}
          setValue={setQty}
          setItems={setQtyItems}
        />
        <DropDownPicker
          listMode="MODAL"
          placeholder="Reason *"
          placeholderStyle={styles.dropDownPlaceholderText}
          style={styles.dropDownStyle}
          dropDownContainerStyle={styles.dropDownOpenContainerStyle}
          containerStyle={styles.dropDownContainerStyle}
          textStyle={styles.dropDownTextStyle}
          open={openReason}
          value={reason}
          items={reasonItems}
          renderListItem={props => {
            return (
              <TouchableOpacity
                style={styles.dropDownItemStyle}
                onPress={() => {
                  props.onPress(props.item);
                }}>
                <Text style={styles.dropDownTextStyle}>{props.item.label}</Text>
                {props.isSelected && props.TickIconComponent()}
              </TouchableOpacity>
            );
          }}
          setOpen={setOpenReason}
          setValue={setReason}
          // setItems={tttttttt}
        />
        {reason && subReasons.length > 0 && (
          <DropDownPicker
            listMode="MODAL"
            placeholder="Sub Reason *"
            placeholderStyle={styles.dropDownPlaceholderText}
            style={styles.dropDownStyle}
            dropDownContainerStyle={styles.dropDownOpenContainerStyle}
            containerStyle={styles.dropDownContainerStyle}
            textStyle={styles.dropDownTextStyle}
            open={openSubReason}
            value={subReason}
            items={subReasons.map(reasonItem => {
              return {
                ...reasonItem,
                label: reasonItem.reason,
                value: reasonItem.reason,
              };
            })}
            renderListItem={props => {
              return (
                <TouchableOpacity
                  style={styles.dropDownItemStyle}
                  onPress={() => {
                    props.onPress(props.item);
                  }}>
                  <Text style={styles.dropDownTextStyle}>
                    {props.item.label}
                  </Text>
                  {props.isSelected && props.TickIconComponent()}
                </TouchableOpacity>
              );
            }}
            setOpen={setOpenSubReason}
            setValue={setSubReason}
          />
        )}

        <DropDownPicker
          listMode="MODAL"
          placeholder="Action *"
          placeholderStyle={styles.dropDownPlaceholderText}
          style={styles.dropDownStyle}
          dropDownContainerStyle={styles.dropDownOpenContainerStyle}
          containerStyle={styles.dropDownContainerStyle}
          textStyle={styles.dropDownTextStyle}
          open={openAction}
          value={action}
          items={actionItems}
          setOpen={setOpenAction}
          setValue={setAction}
          setItems={setActionItems}
        />
      </View>
    </View>
  );
};

export default ItemRender;

const styles = StyleSheet.create({
  itemHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemHeaderImageContainer: {
    height: wp('15%'),
    width: wp('15%'),
    borderRadius: wp('10%'),
    backgroundColor: '#f7f7f7',
    borderWidth: 1,
    borderColor: '#efefef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemHeaderImage: {
    height: wp('12%'),
    width: wp('12%'),
    borderRadius: wp('10%'),
  },
  itemHeaderText: {
    flex: 1,
    marginHorizontal: wp('5%'),
    fontSize: 14,
    fontWeight: 'bold',
  },
  returnErrorText: {
    flex: 1,
    marginHorizontal: wp('5%'),
    paddingTop: hp('1%'),
    fontSize: 12,
    color: 'red',
  },
  inputContainer: {
    marginTop: hp('2%'),
    borderWidth: 1,
    borderRadius: hp('1%'),
    borderColor: '#cccccc',
    height: hp('6%'),
    paddingHorizontal: wp('3%'),
  },
  dropDownStyle: {
    height: hp('6%'),
    borderWidth: 1,
    borderColor: '#CCCCCC',
  },
  dropDownContainerStyle: {
    alignSelf: 'center',
    marginTop: hp('2%'),
  },
  dropDownItemStyle: {
    alignSelf: 'flex-start',
    padding: hp('1%'),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dropDownOpenContainerStyle: {
    backgroundColor: '#FFF',
    borderColor: '#CCCCCC',
    position: 'absolute',
    zIndex: 100,
  },
  dropDownTextStyle: {
    fontWeight: '500',
    fontSize: wp('4%'),
    color: '#25303C',
  },
  dropDownPlaceholderText: {
    fontSize: 15,
    color: 'grey',
  },
});
