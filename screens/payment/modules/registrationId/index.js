import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Modal,
  Switch,
  TouchableOpacity,
} from 'react-native';
import colors from '@config/colors';
import {Styles} from './style';
import TextInputComponent from '@components/TextInputComponent';
import TouchableCustom from '@helpers/touchable_custom';
import {client} from '@apolloClient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconAnt from 'react-native-vector-icons/AntDesign';
import {SecondaryColor} from '@config/environment';
import {
  CREATE_CUSTOMER_REGISTRATION,
  GET_CUSTOMER_REGISTARTION,
  DELETE_CUSTOMER_REGISTRATION,
  UPDATE_CUSTOMER_REGISTRATION,
} from '../../graphql';
import RadioButton from '@components/radioButton';

export default function RegistrationId({cartId, isLoggedIn, onChangeValue}) {
  const [regID, setRegID] = useState('');
  const [isModalShow, setIsModalShow] = useState(false);
  const [regErrorMsg, setRegErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [registrationIds, setRegistrationIds] = useState([]);
  const [fullData, setFullData] = useState({});
  const [editItem, setEditItem] = useState(null);
  const [selectedRegId, setSelectedRegId] = useState(null);

  const defaultRegId = useMemo(() => {
    return registrationIds.filter(reg => reg.isDefault)?.[0];
  }, [registrationIds]);

  const toggleModal = useCallback(() => {
    setIsModalShow(!isModalShow);
    setRegErrorMsg(null);

    onChangeValue({
      registrationNo: selectedRegId?.registrationNo
        ? selectedRegId?.registrationNo
        : defaultRegId?.registrationNo,
      registrationNoRequired: fullData?.config?.registrationNoRequired,
    });
  }, [
    isModalShow,
    setIsModalShow,
    setRegErrorMsg,
    onChangeValue,
    selectedRegId,
    defaultRegId,
    fullData,
  ]);

  const addNewRegIdPress = useCallback(async () => {
    if (regID) {
      try {
        setLoading(true);
        const res = await client.query({
          query: CREATE_CUSTOMER_REGISTRATION,
          fetchPolicy: 'network-only',
          variables: {registrationNo: regID},
          // variables: {registrationNo: regID, quoteId: cartId},
        });
      } catch (e) {
        setLoading(false);
      }
      setRegID('');
      getCustomerRegistration();
      setLoading(false);
      setRegErrorMsg(null);
    } else {
      setRegErrorMsg('Please Enter Registration ID.');
    }
  }, [
    regID,
    setRegErrorMsg,
    setLoading,
    cartId,
    getCustomerRegistration,
    setRegID,
  ]);

  const updatePress = useCallback(async () => {
    try {
      setLoading(true);
      const res = await client.query({
        query: UPDATE_CUSTOMER_REGISTRATION,
        fetchPolicy: 'network-only',
        variables: {
          id: Number(editItem?.id),
          registrationNo: editItem?.registrationNo,
          isDefault: editItem?.isDefault,
          // quoteId: cartId,
        },
      });
    } catch (e) {
      console.warn(e);
      setLoading(false);
    }
    getCustomerRegistration();
    setLoading(false);
    setRegErrorMsg(null);
    setEditItem(null);
  }, [
    setRegErrorMsg,
    setLoading,
    cartId,
    getCustomerRegistration,
    setEditItem,
    editItem,
  ]);

  const deletePress = useCallback(
    async regID => {
      try {
        setLoading(true);
        const res = await client.query({
          query: DELETE_CUSTOMER_REGISTRATION,
          fetchPolicy: 'network-only',
          variables: {id: Number(regID)},
          // variables: {id: Number(regID), quoteId: cartId},
        });
      } catch (e) {
        setLoading(false);
      }
      getCustomerRegistration();
      setLoading(false);
    },
    [setLoading, cartId, getCustomerRegistration],
  );

  const pressEdit = useCallback(
    item => {
      setEditItem(item);
    },
    [setEditItem],
  );

  const getCustomerRegistration = useCallback(async () => {
    console.log('cartId=========78656657', cartId);
    try {
      setLoading(true);
      const {data} = await client.query({
        query: GET_CUSTOMER_REGISTARTION,
        fetchPolicy: 'network-only',
        // variables: {quoteId: cartId},
      });
      const registrationIds = data?.getCustomerRegistrations?.registrations;
      setRegistrationIds(registrationIds);
      setFullData(data?.getCustomerRegistrations);
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  }, [setRegistrationIds, setLoading, cartId, setFullData]);

  useEffect(() => {
    getCustomerRegistration();
  }, [getCustomerRegistration]);

  const renderItem = useCallback(
    ({item}) => {
      return (
        <>
          <View style={Styles.separator}></View>
          <View style={Styles.ItemContainer}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
              key={item?.id}>
              <TouchableOpacity
                style={Styles.regNoContainer}
                onPress={() => setSelectedRegId(item)}>
                <RadioButton
                  selected={
                    selectedRegId?.id
                      ? selectedRegId?.id === item?.id
                      : defaultRegId?.id === item?.id
                  }
                />
                {item?.id === editItem?.id ? (
                  <TextInputComponent
                    placeholder="Enter Registration ID"
                    placeholderTextColor={'#DEE0E3'}
                    onChangeText={newValue =>
                      setEditItem({...editItem, registrationNo: newValue})
                    }
                    value={editItem?.registrationNo}
                    style={Styles.editInput}
                  />
                ) : (
                  <Text
                    allowFontScaling={false}
                    ellipsizeMode="tail"
                    numberOfLines={1}
                    style={Styles.regNoText}>
                    {item?.registrationNo}
                  </Text>
                )}
              </TouchableOpacity>
              <View style={Styles.IconsGrid}>
                <TouchableOpacity
                  style={Styles.editIcon}
                  onPress={() => {
                    item?.id === editItem?.id ? updatePress() : pressEdit(item);
                  }}>
                  <Icon
                    name={item?.id === editItem?.id ? 'save' : 'edit'}
                    size={20}
                    color={SecondaryColor}
                  />
                </TouchableOpacity>
                {item?.isDefault === false && selectedRegId?.id !== item?.id && (
                  <TouchableOpacity
                    style={Styles.editIcon}
                    onPress={() => deletePress(item?.id)}>
                    <Icon name={'delete'} size={20} color={colors.red} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            {item?.id === editItem?.id && (
              <View style={Styles.switchContainer}>
                <Text allowFontScaling={false} style={Styles.regNoText}>
                  Save as default
                </Text>
                <Switch
                  trackColor={{false: '#E0E0E0', true: '#aaa'}}
                  thumbColor={'#6B90BC'}
                  ios_backgroundColor={'#E0E0E0'}
                  onValueChange={newValue =>
                    setEditItem({...editItem, isDefault: newValue})
                  }
                  value={editItem?.isDefault}
                />
              </View>
            )}
          </View>
        </>
      );
    },
    [
      editItem,
      setEditItem,
      pressEdit,
      deletePress,
      updatePress,
      selectedRegId,
      setSelectedRegId,
      defaultRegId,
    ],
  );

  return (
    <>
      {fullData?.config?.moduleEnable && (
        <>
          <View style={Styles.paymentWrapper}>
            {!defaultRegId ? (
              <View style={Styles.subView}>
                <View>
                  <Text allowFontScaling={false} style={Styles.regTextDanger}>
                    {fullData?.config?.message
                      ? JSON.parse(fullData?.config?.message)?.no_reg_id_msg
                      : ''}
                  </Text>
                </View>
                <View style={[Styles.couponeSubView]}>
                  <View style={{}}>
                    <Text
                      allowFontScaling={false}
                      style={Styles.couponButtonText}>
                      Registration Id
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={Styles.changeButton}
                    onPress={toggleModal}>
                    <Text
                      allowFontScaling={false}
                      style={Styles.changeButtonText}>
                      {'Add'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={Styles.subView}>
                <Text allowFontScaling={false} style={Styles.couponText}>
                  {fullData?.config?.message
                    ? JSON.parse(fullData?.config?.message)?.reg_info_msg
                    : ''}
                </Text>
                <View style={Styles.couponeSubView}>
                  <View style={Styles.regLabelWithNumber}>
                    <Text allowFontScaling={false} style={Styles.regNoLabel}>
                      Registration Id{' '}
                    </Text>
                    <View style={Styles.regNoDefault}>
                      <Text
                        allowFontScaling={false}
                        ellipsizeMode="tail"
                        numberOfLines={1}
                        style={{fontSize: 13, color: '#292929', maxWidth: 150}}>
                        {selectedRegId?.registrationNo
                          ? selectedRegId?.registrationNo
                          : defaultRegId?.registrationNo}
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={Styles.changeButton}
                    onPress={toggleModal}>
                    <Text
                      allowFontScaling={false}
                      style={Styles.changeButtonText}>
                      {'Change'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
          <Modal
            visible={isModalShow}
            transparent={true}
            animationType="fade"
            onRequestClose={toggleModal}>
            <View style={Styles.contentWrapper}>
              <View style={Styles.applyCouponcodeMainView}>
                {loading && (
                  <View style={Styles.loader}>
                    <ActivityIndicator size={'small'} style={Styles.loader} />
                  </View>
                )}
                <TouchableOpacity
                  style={Styles.closeIcon}
                  onPress={toggleModal}>
                  <IconAnt
                    name={'closecircleo'}
                    size={16}
                    color={colors.black}
                  />
                </TouchableOpacity>
                <View style={Styles.inputWithError}>
                  <View style={Styles.textInputView}>
                    <View style={Styles.txtView}>
                      <Text allowFontScaling={false} style={Styles.couponsTxt}>
                        Registration Id
                      </Text>
                      <TextInputComponent
                        placeholder="Enter Registration ID"
                        placeholderTextColor={'#DEE0E3'}
                        onChangeText={setRegID}
                        value={regID}
                        style={Styles.textInput}
                      />
                    </View>
                    <View style={Styles.applyBtn}>
                      <TouchableCustom
                        underlayColor={'#ffffff10'}
                        onPress={addNewRegIdPress}>
                        <View style={Styles.applyCouponButton}>
                          <Text
                            allowFontScaling={false}
                            style={Styles.applyCouponButtonText}>
                            Add
                          </Text>
                        </View>
                      </TouchableCustom>
                    </View>
                  </View>
                  <View style={Styles.errorText}>
                    {regErrorMsg && (
                      <Text
                        allowFontScaling={false}
                        style={Styles.couponErrorText}>
                        {regErrorMsg}
                      </Text>
                    )}
                  </View>
                </View>
                <View style={Styles.codeBtn}>
                  {registrationIds.length > 0 && (
                    <FlatList
                      data={registrationIds}
                      renderItem={renderItem}
                      keyExtractor={(item, index) => index.toString()}
                      extraData={editItem}
                    />
                  )}
                </View>
              </View>
            </View>
          </Modal>
        </>
      )}
    </>
  );
}
