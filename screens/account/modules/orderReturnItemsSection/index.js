import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  Image,
  FlatList,
  ActivityIndicator,
  TextInput,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import HeaderComponent from '@components/HeaderComponent';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import {RETURN_REASONS, GET_PRESIGNED_URL, RETURN_VALIDATE} from './graphql';
import {newclient, orderReturnStagingClient} from '../../../../apollo_client';
import {
  showErrorMessage,
  showSuccessMessage,
} from '../../../../helpers/show_messages';
import {RETURN_REQUEST_CREATE} from './graphql/mutations';
import {Dropdown} from 'react-native-element-dropdown';
import * as Yup from 'yup';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

export default function OrderReturnSection(props) {
  const [showLoader, setShowLoader] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [returnReasons, setReturnReasons] = useState([]);
  const [returnAction, setReturnAction] = useState([]);
  const [currentReturnForm, setCurrentReturnForm] = useState({});
  const [returnFormItems, setReturnFormItems] = useState([]);
  const [returnItems, setReturnItems] = useState([]);
  const [subReason, setSubReason] = useState([]);
  const [error, setError] = useState({});

  const [selectedItemForReturn, setSelectedItemForReturn] = useState({});
  const orderId = props?.navigation.getParam('orderId');

  const orderReturnSchema = Yup.object().shape({
    reason_id: Yup.string().required('Please select Reason'),
    sub_reason_id:
      subReason.length > 0
        ? Yup.string().required('Please select Sub Reason')
        : Yup.string(),
    action_id:
      returnAction.length > 0
        ? Yup.string().required('Please select Action')
        : Yup.string(),
    attachments: Yup.array()
      .min(2, 'At least 2 attachments are required')
      .required('Attachment is required'),
  });

  const handleValidation = useCallback(
    async formData => {
      try {
        await orderReturnSchema.validate(formData, {abortEarly: false});
        console.log('Validation success');
        setError({});
      } catch (validateError) {
        const errors = {};
        validateError.inner.forEach(err => {
          errors[err.path] = err.message;
        });
        console.error('Validation failed:', errors);
        setError(errors);
        return errors;
      }
    },
    [orderReturnSchema],
  );

  const onSaveReturnForm = useCallback(() => {
    handleValidation(currentReturnForm);
    const items = returnFormItems.filter(
      form => form.sku !== currentReturnForm?.sku,
    );
    setReturnFormItems([...items, currentReturnForm]);
    setCurrentReturnForm({});
    setModalVisible(false);
  }, [returnFormItems, currentReturnForm]);

  const onClearForm = useCallback(() => {
    const items = returnFormItems.filter(
      form => form.sku !== currentReturnForm?.sku,
    );
    setReturnAction([]);
    setSubReason([]);
    setReturnFormItems([...items]);
    setCurrentReturnForm({});
    setModalVisible(false);
  }, [returnFormItems, currentReturnForm]);

  const getData = async () => {
    try {
      await getReturnReasons();
      await getReturnItems();
    } catch (e) {
      console.log('e', e);
    }
    setShowLoader(false);
  };

  const getReturnReasons = async () => {
    try {
      const {data} = await orderReturnStagingClient.query({
        query: RETURN_REASONS,
        fetchPolicy: 'network-only',
        variables: {},
      });

      // console.log('RETURN_REASONS====RETURN_REASONS', JSON.stringify(data));

      if (data?.getReturnReasonList && data.getReturnReasonList.length) {
      }
      setReturnReasons(
        data?.getReturnReasonList?.filter(item => item.enable === true),
      );
    } catch (e) {
      console.log('getReturnReasons error', e);
    }
  };

  const getReturnItems = async () => {
    try {
      const {data} = await orderReturnStagingClient.query({
        query: RETURN_VALIDATE,
        fetchPolicy: 'network-only',
        variables: {orderId: orderId},
      });
      if (data?.returnValidate) {
        setReturnItems(data.returnValidate);
        selectedItemForReturn?.is_tat_expired &&
          returnReasons?.find(item => item?.code === 'NOT_WORKING');
      }
    } catch (e) {
      console.log('getReturnAction error', e);
    }
  };

  const uriToBlob = uri => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function () {
        // return the blob
        resolve(xhr.response);
      };
      xhr.onerror = function () {
        reject(new Error('uriToBlob failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);

      xhr.send(null);
    });
  };

  const requestCameraPermission = async type => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Cool Photo App Camera Permission',
          message:
            'Cool Photo App needs access to your camera ' +
            'so you can take awesome pictures.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera');
        handleDocumentSelection(type);
      } else {
        console.log('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const handleDocumentSelection = async type => {
    try {
      // const response = await DocumentPicker.pickSingle({
      //   type: [DocumentPicker.types.allFiles],
      //   presentationStyle: 'fullScreen',
      // });
      let response;
      if (type === 'camera') {
        await launchCamera({mediaType: 'photo'}, data => {
          if (data.didCancel) {
            console.log('User cancelled image picker');
          } else if (data.errorCode) {
            console.log('ImagePicker Error: ', data.errorMessage);
          } else {
            response = data?.assets?.[0];
          }
        });
      } else {
        const result = await launchImageLibrary({mediaType: 'mixed'});
        response = result?.assets?.[0];
      }

      if (response) {
        setShowLoader(true);
        let fileName = `${orderId}_${new Date()}_${response?.fileName}`;
        const {data} = await newclient.query({
          query: GET_PRESIGNED_URL,
          fetchPolicy: 'network-only',
          variables: {name: [fileName]},
        });
        let awaitfetch = await uriToBlob(response.uri);
        // const imageBody = await awaitfetch.blob();
        if (data?.getPreSignedUrl && data?.getPreSignedUrl?.length) {
          try {
            const uploadrResponse = await fetch(
              data?.getPreSignedUrl[0].pre_signed_url,
              {
                method: 'PUT',
                body: awaitfetch,
              },
            );
            if (uploadrResponse.status === 200) {
              // let fileResponseData = [...fileResponse];

              let imageIndex = uploadrResponse?.url?.indexOf('?');
              let imageUrl = uploadrResponse?.url?.slice(0, imageIndex);
              console.log('imageUrl=======', imageUrl);
              // fileResponseData.push({...response, imageUrl});
              // console.log(
              //   'fileResponseData.map(item => item.imageUrl)======',
              //   fileResponseData.map(item => item.imageUrl),
              // );
              setCurrentReturnForm(prev => ({
                ...prev,
                attachments: [...(prev?.attachments || []), imageUrl],
              }));
              // setFileResponse(fileResponseData);
            }
          } catch (err) {
            console.log('err', err);
            showErrorMessage('Unable to upload file');
          }
        }
      } else {
        showErrorMessage('Something went wrong');
      }
      setShowLoader(false);
    } catch (err) {
      setShowLoader(false);
      console.warn(err);
    }
  };

  const removeDocument = index => {
    const newAttachment =
      currentReturnForm?.attachments?.length === 1
        ? []
        : // : currentReturnForm?.attachments?.splice(index, 1);
          [
            ...currentReturnForm?.attachments?.slice(0, index),
            ...currentReturnForm?.attachments?.slice(index + 1),
          ];

    setCurrentReturnForm(prev => ({
      ...prev,
      attachments: newAttachment,
    }));
  };

  const loaderView = () => (
    <View style={styles.loaderContainer}>
      <ActivityIndicator size={'large'} color={'#2b79ac'} />
    </View>
  );

  const quantityIncreaseSelector = () => {
    if (
      currentReturnForm.qty === selectedItemForReturn?.max_qty_returnable ||
      selectedItemForReturn?.non_returnable === 0
    ) {
      return;
    }
    setCurrentReturnForm(prev => ({
      ...prev,
      qty: Number(prev?.qty) + 1,
    }));
  };

  const quantityDecreaseSelector = () => {
    if (currentReturnForm.qty === 1) {
      return;
    }
    setCurrentReturnForm(prev => ({
      ...prev,
      qty: Number(prev?.qty) - 1,
    }));
  };

  const submitReturnRequest = async () => {
    setShowLoader(true);
    let formItems = [];
    let description = [];
    returnFormItems.map(item => {
      if (item?.description) {
        description.push(item.description);
      }
      delete item.description;
      return formItems.push(item);
    }, []);
    let formattedData = {
      order_id: orderId,
      description: description.join(', '),
      items: formItems,
      source: 'app',
    };
    try {
      const {data} = await orderReturnStagingClient.mutate({
        mutation: RETURN_REQUEST_CREATE,
        // fetchPolicy: 'network-only',
        variables: {input: formattedData},
      });
      if (data?.createReturn) {
        setCurrentReturnForm({});
        setReturnFormItems([]);
        getReturnItems();
        showSuccessMessage('return request raised successfully.');
        props.navigation.navigate('ReturnTnC', {orderId});
      }
    } catch (e) {
      setShowLoader(false);
      showErrorMessage('Something went wrong');
    }
    setShowLoader(false);
  };

  const onCardPress = useCallback(
    item => {
      setSelectedItemForReturn(item);
      if (item?.is_tat_expired || item?.is_free_product) {
        returnReasons?.find(
          item =>
            item?.code === 'NOT_WORKING' &&
            (setReturnAction(item.return_actions),
            setSubReason(item.sub_reasons)),
        );
        setCurrentReturnForm(prev => {
          return {
            ...prev,
            reason_id: returnReasons?.find(item => item?.code === 'NOT_WORKING')
              .id,
            action_id: returnReasons
              ?.find(item => item?.code === 'NOT_WORKING')
              ?.return_actions?.find(e => e.action === 'Repair')?.id,
            qty: 1,
            sku: item?.sku,
          };
        });
      } else {
        setCurrentReturnForm(prev => {
          return {
            ...prev,
            qty: 1,
            sku: item?.sku,
          };
        });
      }
      setModalVisible(true);
    },
    [returnReasons],
  );

  const editPress = useCallback(
    item => {
      onCardPress(item);
      let data = returnFormItems?.find(e => e?.sku === item?.sku);
      setCurrentReturnForm(prev => {
        return {
          ...prev,
          ...data,
        };
      });
    },
    [returnFormItems],
  );

  useEffect(() => {
    setShowLoader(true);
    getData();
  }, []);

  useEffect(() => {
    handleValidation(currentReturnForm);
  }, [currentReturnForm]);

  const renderItems = ({item, index}) => {
    return (
      <View
        style={{
          borderWidth: 0.4,
          marginVertical: 4,
          borderRadius: 8,
          padding: 4,
        }}>
        <TouchableOpacity
          disabled={
            item?.error ||
            returnFormItems?.find(data => data?.sku === item?.sku)
              ? true
              : false
          }
          onPress={() => onCardPress(item)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingLeft: 5,
            flex: 1,
            paddingVertical: 10,
          }}>
          <View style={styles.imageBox}>
            <Image
              style={{width: 30, height: 30}}
              source={{
                uri:
                  'https://images.dentalkart.com/media/catalog/product' +
                  item?.image,
              }}
            />
          </View>

          <View style={{paddingHorizontal: 6}}></View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              flex: 1,
              paddingHorizontal: 6,
            }}>
            <View style={{flex: 1}}>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: '500',
                  color: '#282C3F',
                }}>
                {item?.name}
              </Text>
              <Text style={{fontSize: 10}}>Order Amount - Rs {item.price}</Text>
            </View>
            {!item.error ? (
              returnFormItems?.find(data => data?.sku === item?.sku) ? (
                <View
                  style={{
                    flexDirection: 'row',
                    flex: 0.8,
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                  }}>
                  <Text
                    style={{color: '#F85100', fontSize: 13, fontWeight: '500'}}>
                    Request Saved
                  </Text>
                  <TouchableOpacity
                    onPress={() => editPress(item)}
                    style={{paddingLeft: 8}}>
                    <Image
                      source={require('../../../../assets/edit.png')}
                      style={{width: 24, height: 24}}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <Image
                    source={require('../../../../assets/arrowDown.png')}
                    style={{transform: [{rotate: '270deg'}]}}
                  />
                </View>
              )
            ) : null}
          </View>
        </TouchableOpacity>

        <Text
          style={{
            color: 'red',
            fontSize: 12,
            paddingHorizontal: 4,
            marginTop: -5,
          }}>
          {item.error}
        </Text>
      </View>
    );
  };
  return (
    <View style={{flex: 1}}>
      {showLoader && loaderView()}
      <SafeAreaView style={styles.pageContainer}>
        <HeaderComponent
          isempty
          onPress={() => {
            props.navigation.goBack();
          }}
          label={'Order Return'}
          style={{height: 40}}
        />

        <View style={styles.sectionsContainer}>
          <View style={styles.selectedProductView}>
            <Text style={styles.selectedProductText}>{'Select Product'}</Text>
          </View>
          <View style={styles.productListView}>
            <View style={{flex: 1}}>
              <View style={styles.bodyWithList}>
                <FlatList
                  data={returnItems?.items}
                  renderItem={renderItems}
                  keyExtractor={(_, i) => i.toString()}
                />
              </View>
              <View
                style={{
                  shadowColor: '#000',
                  shadowOffset: {width: 0, height: -3},
                  shadowOpacity: 0.3,
                  shadowRadius: 2.0,
                  elevation: 3,
                }}>
                <View
                  style={{
                    marginTop: 8,
                    padding: 12,
                    backgroundColor: '#fff',
                  }}>
                  <TouchableOpacity
                    onPress={submitReturnRequest}
                    disabled={returnFormItems.length === 0}
                    style={[
                      styles.subReqBtn,
                      returnFormItems.length === 0
                        ? {backgroundColor: 'lightgrey'}
                        : {},
                    ]}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 14,
                        fontWeight: '500',
                      }}>
                      Submit Request
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
              setCurrentReturnForm({});
            }}>
            {showLoader && loaderView()}
            <SafeAreaView style={styles.centeredView}>
              <View style={styles.modalView}>
                <View style={{padding: 10}}>
                  <TouchableOpacity
                    onPress={() => {
                      setModalVisible(false);
                      setCurrentReturnForm({});
                    }}
                    style={{position: 'absolute', right: 6, top: 6}}>
                    <Image
                      source={require('../../../../assets/close.png')}
                      style={{width: 24, height: 24}}
                    />
                  </TouchableOpacity>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View
                      style={{
                        borderWidth: 1,
                        borderColor: 'grey',
                        borderRadius: 8,
                        width: 40,
                        height: 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Image
                        style={{width: 30, height: 30}}
                        source={{
                          uri:
                            'https://images.dentalkart.com/media/catalog/product' +
                            selectedItemForReturn?.image,
                        }}
                      />
                    </View>
                    <View style={{paddingHorizontal: 6}}></View>
                    <Text
                      style={{
                        fontSize: 11,
                        fontWeight: '500',
                        color: '#282C3F',
                        width: '80%',
                      }}>
                      {selectedItemForReturn?.name}
                    </Text>
                  </View>
                  <View style={{paddingVertical: 4}}></View>
                  <View
                    style={{
                      flexDirection: 'row',
                      // flex: 1,
                      justifyContent: 'space-between',
                    }}>
                    <View style={{width: '30%'}}>
                      <Text style={{paddingBottom: 4}}>Quantity</Text>
                      <View style={styles.quantityView}>
                        <TouchableOpacity
                          style={{paddingHorizontal: 6}}
                          onPress={quantityDecreaseSelector}>
                          <Text style={{fontSize: 18}}>-</Text>
                        </TouchableOpacity>
                        <View style={{paddingHorizontal: 6}}></View>
                        <Text style={{color: 'black'}}>
                          {currentReturnForm?.qty || 1}
                        </Text>
                        <View style={{paddingHorizontal: 6}}></View>
                        <TouchableOpacity
                          style={{paddingHorizontal: 6}}
                          onPress={quantityIncreaseSelector}>
                          <Text style={{fontSize: 18, color: 'black'}}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View style={{paddingHorizontal: 8}}></View>

                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        bottom: 0,
                      }}>
                      <Text style={{paddingBottom: 4}}>Select Reason</Text>
                      <Dropdown
                        renderItem={item => (
                          <View
                            style={{
                              justifyContent: 'space-between',
                              padding: 8,
                              paddingVertical: 4,
                            }}>
                            <Text style={{}}>{item.reason}</Text>
                          </View>
                        )}
                        selectedTextStyle={[
                          {
                            color: 'black',
                            fontSize: 14,
                          },
                          selectedItemForReturn?.is_tat_expired && {
                            color: 'grey',
                          },
                        ]}
                        disable={
                          selectedItemForReturn?.non_returnable ||
                          selectedItemForReturn?.is_tat_expired
                        }
                        style={[
                          styles.dropdown,
                          selectedItemForReturn?.is_tat_expired && {
                            borderColor: 'grey',
                          },
                        ]}
                        placeholderStyle={styles.placeholderStyle}
                        data={returnReasons}
                        value={returnReasons.find(
                          e => e.id === currentReturnForm.reason_id,
                        )}
                        maxHeight={300}
                        labelField="reason"
                        valueField="reason"
                        placeholder={'Reason'}
                        onChange={item => {
                          setSubReason(item?.sub_reasons);
                          setReturnAction(item?.return_actions);
                          setCurrentReturnForm(prev => ({
                            ...prev,
                            reason_id: item.id,
                          }));
                        }}
                      />

                      {error ? (
                        <Text style={{color: 'red'}}>
                          {String(error?.reason_id || '')}
                        </Text>
                      ) : null}
                    </View>
                  </View>
                  <View style={{paddingVertical: 4}}>
                    <Text>Select Sub Reason</Text>
                  </View>
                  <View style={{}}>
                    <Dropdown
                      renderItem={item => (
                        <View
                          style={{
                            justifyContent: 'space-between',
                            padding: 8,
                            paddingVertical: 4,
                          }}>
                          <Text style={{}}>{item.reason}</Text>
                        </View>
                      )}
                      selectedTextStyle={{
                        color: 'black',
                        fontSize: 14,
                      }}
                      disable={
                        selectedItemForReturn?.non_returnable ||
                        subReason.length === 0
                      }
                      style={styles.dropdown}
                      placeholderStyle={styles.placeholderStyle}
                      data={subReason}
                      maxHeight={300}
                      labelField="reason"
                      valueField="reason"
                      placeholder={'Sub Reason'}
                      value={subReason?.find(
                        e => e.id === currentReturnForm.sub_reason_id,
                      )}
                      onChange={item => {
                        setCurrentReturnForm(prev => ({
                          ...prev,
                          sub_reason_id: item.id,
                        }));
                      }}
                    />
                    {error ? (
                      <Text style={{color: 'red'}}>
                        {String(error?.sub_reason_id || '')}
                      </Text>
                    ) : null}
                  </View>
                  <View style={{paddingVertical: 4}}>
                    <Text>Select Action</Text>
                  </View>
                  <View style={{width: '60%'}}>
                    <Dropdown
                      renderItem={item => (
                        <View
                          style={{
                            justifyContent: 'space-between',
                            padding: 8,
                            paddingVertical: 4,
                          }}>
                          <Text style={{}}>{item.action}</Text>
                        </View>
                      )}
                      selectedTextStyle={[
                        {
                          color: 'black',
                          fontSize: 14,
                        },
                        selectedItemForReturn?.is_tat_expired && {
                          color: 'grey',
                        },
                      ]}
                      style={[
                        styles.dropdown,
                        selectedItemForReturn?.is_tat_expired && {
                          borderColor: 'grey',
                        },
                      ]}
                      disable={
                        selectedItemForReturn?.non_returnable ||
                        returnAction === 0 ||
                        selectedItemForReturn?.is_tat_expired
                      }
                      placeholderStyle={styles.placeholderStyle}
                      data={returnAction}
                      value={returnAction?.find(
                        e => e.id === currentReturnForm.action_id,
                      )}
                      maxHeight={300}
                      labelField="action"
                      valueField="action"
                      placeholder={'Action'}
                      onChange={item => {
                        setCurrentReturnForm(prev => ({
                          ...prev,
                          action_id: item.id,
                        }));
                      }}
                    />
                    {error ? (
                      <Text style={{color: 'red'}}>
                        {String(error?.action_id || '')}
                      </Text>
                    ) : null}
                  </View>
                  <View style={{paddingVertical: 4}}>
                    <Text>Attachment</Text>
                  </View>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {Array.from(
                      {
                        length: 3,
                      },
                      (v, i) => i,
                    ).map(i => {
                      return !!currentReturnForm?.attachments?.[i] ? (
                        <View
                          style={[styles.imageContainer, {marginRight: 8}]}
                          key={i.toString()}>
                          <Image
                            style={{
                              flex: 1,
                            }}
                            // source={{uri: data?.uri}}
                            source={{
                              uri: currentReturnForm?.attachments?.[i],
                            }}
                          />
                          <TouchableOpacity
                            onPress={() => removeDocument(i)}
                            style={styles.imageContainerClose}>
                            <Icon
                              name={'close'}
                              size={22}
                              style={{color: '#FFF'}}
                            />
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity
                          key={i.toString()}
                          onPress={() =>
                            Alert.alert(
                              'Select Your Source',
                              'Choose to upload from your gallery or take a new photo with your camera',
                              [
                                {
                                  text: 'Browse Files',
                                  onPress: () =>
                                    handleDocumentSelection('gallary'),
                                  // style: 'cancel',
                                },
                                {
                                  text: 'Use Camera',
                                  onPress: () =>
                                    requestCameraPermission('camera'),
                                },
                              ],
                              {cancelable: false},
                            )
                          }
                          style={[
                            styles.imageContainer,
                            {
                              marginRight: 8,
                              alignItems: 'center',
                              justifyContent: 'center',
                            },
                          ]}>
                          <Text>+</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                  {error ? (
                    <Text style={{color: 'red'}}>
                      {String(error?.attachments || '')}
                    </Text>
                  ) : null}
                  <View style={{paddingVertical: 4}}>
                    <Text>Comments, if Any</Text>
                  </View>
                  <View style={{}}>
                    <TextInput
                      value={currentReturnForm?.description || ''}
                      onChangeText={text =>
                        setCurrentReturnForm(prev => ({
                          ...prev,
                          description: text,
                        }))
                      }
                      numberOfLines={4}
                      style={{borderWidth: 0.5, height: 60}}
                    />
                  </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <TouchableOpacity
                      onPress={onClearForm}
                      style={[styles.saveFormBtn]}>
                      <Text style={{color: 'white'}}>Clear</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={onSaveReturnForm}
                      disabled={Object.keys(error).length > 0}
                      style={[
                        styles.saveFormBtn,
                        Object.keys(error).length > 0 && {
                          backgroundColor: 'lightgrey',
                        },
                      ]}>
                      <Text style={{color: 'white'}}>Save</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </SafeAreaView>
          </Modal>
        </View>
      </SafeAreaView>
    </View>
  );
}
