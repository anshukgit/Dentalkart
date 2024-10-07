import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {snakeToTitleCase} from '@helpers/formatter';
import Styles from './past_returns.style';
import HeaderComponent from '@components/HeaderComponent';
import Loader from '@components/loader';
import {getRequest} from '@helpers/network';
const PastReturns = ({navigation}) => {
  const [pageLoader, setPageLoader] = useState(false);
  const [pastReturnList, setPastReturnList] = useState(false);

  const getPastReturns = async () => {
    setPageLoader(true);
    try {
      let url =
        'https://ordermg-prod.dentalkart.com/return/list_return_items/?page=1&page_size=50';
      let data = await getRequest(url);
      let res = await data.json();
      setPastReturnList(res);
      setPageLoader(false);
    } catch (error) {
      setPageLoader(false);
      console.log('error=====getPastReturns', error);
    }
  };

  useEffect(() => {
    getPastReturns();
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: '#F1F3F6'}}>
      {pageLoader ? <Loader loading={true} transparent={true} /> : null}
      <HeaderComponent
        label={'Past Returns'}
        navigation={navigation}
        style={{height: 40}}
      />
      <FlatList
        // data={[]}
        data={pastReturnList?.result}
        renderItem={({item}) => {
          return (
            <>
              <View
                style={Styles.cardContainer}
                // key={this.props.key + '-' + item.increment_id}
              >
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={Styles.cardOrderIdLabel}>Order ID - </Text>
                    <Text style={Styles.cardOrderIdText}> {item.order_id}</Text>
                  </View>

                  <View
                    style={{
                      height: 20,
                      backgroundColor: 'grey',
                      width: 0.5,
                      marginLeft: 10,
                    }}></View>
                  {/* <Text style={Styles.cardStatusText}>{item.status}</Text> */}
                  <Text style={Styles.cardStatusText}>
                    {snakeToTitleCase(
                      item?.status,
                      'Approved',
                      'Request Approved',
                    )}
                  </Text>
                </View>

                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={Styles.cardOrderIdLabel}>Return ID - </Text>
                    <Text style={Styles.cardOrderIdText}>
                      {' '}
                      {item.return_id}
                    </Text>
                  </View>

                  <View
                    style={{
                      height: 20,
                      backgroundColor: 'grey',
                      width: 0.5,
                      marginLeft: 10,
                    }}></View>
                  {/* <Text style={Styles.cardStatusText}>{item.status}</Text> */}
                  <Text style={Styles.cardCreatedText}>
                    Requested On -{item?.created_at?.substr(0, 10)}
                  </Text>
                </View>

                <View style={{marginTop: 10}}>
                  <Text style={Styles.cardItemsText}>{item.name}</Text>

                  <Text style={{fontSize: 12, color: 'black'}}>
                    Quantity :{item?.qty}
                  </Text>
                  {/* 
                  <Text style={Styles.cardItemsText}>
                    Amount - Rs {`${item.amount}`}
                  </Text> */}
                </View>

                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    justifyContent: 'space-between',
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    {/* {console.log('url_key====url_key', item)} */}
                    <TouchableOpacity
                      // onPress={() =>
                      //   this.props.navigation.navigate('UrlResolver', {
                      //     url_key: item?.url,
                      //   })
                      // }
                      style={{
                        borderWidth: 0.3,
                        marginLeft: 5,
                        padding: 6,
                        borderRadius: 5,
                        borderColor: 'grey',
                        justifyContent: 'center',
                      }}>
                      <Image
                        style={{width: 30, height: 30}}
                        source={{
                          uri:
                            'https://images.dentalkart.com/media/catalog/product' +
                            item.image,
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                  {item?.track_url !== '' ? (
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <View>
                        <TouchableOpacity
                          onPress={() =>
                            // navigation.navigate('OrderDetails', {
                            //   orderId: item.order_id,
                            //   can_cancel: item.can_cancel,
                            //   returnValues: {
                            //     sku: item?.sku,
                            //     returnID: item?.return_id,
                            //   },
                            // })
                            Linking.openURL(item?.track_url)
                          }
                          style={{
                            borderRadius: 2,
                            borderWidth: 0.5,
                            borderColor: '#0286FF',
                            backgroundColor: 'rgba(203, 230, 255, 0.47)',
                            paddingHorizontal: 18,
                            paddingVertical: 2,
                            justifyContent: 'center',
                          }}>
                          <Text
                            style={{
                              color: '#00407B',
                              fontSize: 14,
                              fontWeight: '600',
                            }}>
                            Track
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={{paddingHorizontal: 6}}></View>
                    </View>
                  ) : null}
                </View>
              </View>
            </>
          );
        }}
        ListEmptyComponent={() => (
          <Text
            style={{
              fontWeight: '600',
              color: 'black',
              textAlign: 'center',
              paddingTop: 10,
            }}>
            You don't have any past return items.
          </Text>
        )}
      />
    </View>
  );
};

export default PastReturns;
