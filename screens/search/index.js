import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useContext,
} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Text,
  SafeAreaView,
  Alert,
  Button,
  Modal,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import tokenClass from '@helpers/token';
import LinearGradient from 'react-native-linear-gradient';
import {SearchPageStyle} from './searchPageStyle';
import objectToQueryString from '@helpers/objectToQueryString';
import Filters from '../../components/filters';
import {ProductList} from './ProductList';
import {config} from '@helpers/algoliaConfig';
import {searchMapper} from '@helpers/searchMapper';
import getRequest from '@helpers/get_request';
//  import styles from 'rn-range-slider/styles';
import styles from '../cart/modules/delivery_address/delivery_address.style';
import TextInputComponent from '../../components/TextInputComponent';
import ADD_PRODUCT_SUGGESTION_DETAILS from './graphql/Product_suggestion.gql';
import {client} from '../../apollo_client';
import {showSuccessMessage} from '@helpers/show_messages';
import {Icon} from 'native-base';
import colors from '../../config/colors';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {DentalkartContext} from '@dentalkartContext';
import TouchableCustom from '@helpers/touchable_custom';
import {DeviceWidth} from '@config/environment';
// import Voice from 'react-native-voice';
import FastImage from 'react-native-fast-image';

export const useIsMount = () => {
  const isMountRef = useRef(true);
  useEffect(() => {
    isMountRef.current = false;
  }, []);
  return isMountRef.current;
};

export default SearchScreen = ({navigation}) => {
  const inputRef = useRef(null);
  const context = useContext(DentalkartContext);
  const isMount = useIsMount();
  const [searchValue, setSearchValue] = useState('');
  const [searchData, setSearchData] = useState({
    products: [],
    searchInfo: {},
  });
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(null);
  const [searchTimeOut, setSearchTiemeOut] = useState(0);
  const [filters, setFilters] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [voiceVisible, setVoiceVisible] = useState(false);
  const [productName, setProductName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [commentName, setComment] = useState('');
  const [error, setError] = useState('');
  const [sortModal, setSortModal] = useState(false);
  const [selectedSortValue, setSelectedSortValue] = useState('');
  const [voiceSearchResult, setVoiceSearchResult] = useState('Listening...');

  // useEffect(() => {
  //   //Setting callbacks for the process status
  //   Voice.onSpeechStart = onSpeechStart;
  //   Voice.onSpeechEnd = onSpeechEnd;
  //   Voice.onSpeechError = onSpeechError;
  //   Voice.onSpeechResults = onSpeechResults;

  //   return () => {
  //     //destroy the process after switching the screen
  //     Voice.destroy().then(Voice.removeAllListeners);
  //   };
  // }, []);

  const onSpeechStart = e => {
    //Invoked when .start() is called without error
    console.log('onSpeechStart: ', e);
  };

  const onSpeechEnd = e => {
    //Invoked when SpeechRecognizer stops recognition
    console.log('onSpeechEnd: ', e);
    setVoiceVisible(false);
  };

  const onSpeechError = e => {
    //Invoked when an error occurs.
    console.log('onSpeechError: ', e);
    if (e) {
      setVoiceVisible(false);
      // alert('Voice recognition error: ' + JSON.stringify(e));
    }
  };

  // const onSpeechResults = e => {
  //   setSearchValue(e.value[0]);
  //   setVoiceSearchResult(e.value[0]);
  //   Voice.stop();
  //   setTimeout(() => {
  //     setVoiceVisible(false);
  //   }, 1000);

  //   inputRef.current.blur();
  // };

  const flatListRef = useRef(null);
  const RadioButton = props => {
    return (
      <View
        style={[
          {
            height: 20,
            width: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: '#000',
            alignItems: 'center',
            justifyContent: 'center',
          },
          props.style,
        ]}>
        {props.selected ? (
          <View
            style={{
              height: 10,
              width: 10,
              borderRadius: 5,
              backgroundColor: '#000',
            }}
          />
        ) : null}
      </View>
    );
  };
  const sort = [
    {label: 'Popularity', key: ''},
    {label: 'Price -- Low to High', key: 'ASC'},
    {label: 'Price -- High to Low', key: 'DSC'},
  ];
  const SortBy = props => {
    return (
      <View style={{marginTop: 15, paddingHorizontal: 10}}>
        {sort.map((sortby, index) => (
          <View style={{marginBottom: 10}}>
            <TouchableOpacity
              style={{flexDirection: 'row', alignItems: 'center'}}
              onPress={() => {
                setSelectedSortValue(sortby.key);
              }}>
              <View style={{marginRight: 10}}>
                <RadioButton selected={selectedSortValue === sortby.key} />
              </View>
              <Text allowFontScaling={false}>{sortby.label}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };
  const goToTop = () => {
    flatListRef?.current?.scrollToOffset({animated: true, offset: 0});
  };

  const applyFilters = useCallback(
    inputFilter => {
      setFilters({...filters, ...inputFilter});
    },
    [filters],
  );

  const fetchSearchProducts = useCallback(
    async type => {
      try {
        let page, search_key;
        type === 'search' ? (page = 0) : (page = pageNumber);
        search_key = searchValue ? searchValue : '';

        setLoading(true);

        let searchConfig = config;
        let newFilter = {};
        if (filters?.category?.length > 0)
          newFilter.category = filters?.category;
        if (filters?.manufacturer?.length > 0)
          newFilter.manufacturer = filters?.manufacturer;
        if (filters?.rating) newFilter.rating = filters?.rating;
        if (
          filters?.price &&
          filters?.price?.min !== null &&
          filters?.price?.max !== null
        )
          newFilter.price = filters?.price;

        const _search_payload = {
          query: search_key.trim(),
          applyFilters: JSON.stringify(newFilter),
          sortBy: selectedSortValue,
          page: page,
        };

        // const res = await getRequest(
        //   `${
        //     searchConfig.apiConfig?.[searchConfig.current]?.url
        //   }?${objectToQueryString(_search_payload)}`,
        //   searchConfig.apiConfig?.[searchConfig.current]?.key,
        // );

        const res = await getRequest(
          `https://search-prod.dentalkart.com/api/v1/search/results?${objectToQueryString(
            _search_payload,
          )}`,
        );

        const result = await res.json();
        const mappedData = searchMapper(searchConfig, result);
        if (mappedData?.searchdata) {
          setLoading(false);
          const {searched_items, ...resObject} = mappedData.searchdata;
          if (page === 0) {
            setTotalPages(resObject?.total_pages);
            setPageNumber(0);
          }
          if (type === 'search') {
            goToTop();
            setSearchData({
              products: [...searched_items],
              searchInfo: resObject,
            });
          } else {
            setSearchData({
              products: [...searchData.products, ...searched_items],
              searchInfo: resObject,
            });
          }
        }
      } catch (e) {
        setLoading(false);
        console.log('error in algolia fetch', e.message);
      }
    },
    [filters, searchValue, pageNumber, selectedSortValue],
  );

  const addProductSuggestion = async () => {
    if (productName) {
      setLoading(true);
      const loginStatus = await tokenClass.loginStatus();
      const {userInfo} = context;
      const user = userInfo ? userInfo.getCustomer : {};
      try {
        const data = await client.mutate({
          mutation: ADD_PRODUCT_SUGGESTION_DETAILS,
          variables: {
            searched_key: searchValue,
            product_name: productName,
            brand: brandName,
            comment: commentName,
            user: loginStatus ? user?.email : 'guest_user',
          },
          fetchPolicy: 'no-cache',
        });
        setLoading(false);
        if (data?.data) {
          handleCloseModal();
          showSuccessMessage('suggestion added successfully.');
          setError('');
          setBrandName('');
          setComment('');
          setProductName('');
        }
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    } else {
      setError('Please enter Product Name');
    }
  };

  const handleCloseModal = () => {
    setModalVisible(!modalVisible);
  };

  const renderContent = useCallback(
    loading => {
      const hasResults = searchData?.products && searchData?.products.length;
      return hasResults || loading ? (
        <>
          {searchValue ? (
            <View style={SearchPageStyle.textFilterContainer}>
              <Text style={{color: 'gray'}}>
                Showing
                <Text style={{fontWeight: 'bold', color: 'black'}}>
                  {' '}
                  {searchData?.products.length}{' '}
                </Text>
                results{' '}
                {searchValue ? (
                  <>
                    <Text style={{color: 'gray'}}>for </Text>
                    <Text style={{fontWeight: 'bold', color: 'black'}}>
                      '{searchValue}'
                    </Text>
                  </>
                ) : null}
              </Text>
            </View>
          ) : null}
          <ProductList
            products={searchData?.products}
            searchData={{
              'Search Keyword': searchValue,
              'Item Count': searchData?.products.length,
            }}
            loading={loading}
            pageNumber={pageNumber}
            totalPages={totalPages}
            navigation={navigation}
            setPageNumber={setPageNumber}
            flatListRef={flatListRef}
          />
        </>
      ) : !loading ? (
        <View style={SearchPageStyle.emptySearchWrapper}>
          <Text style={SearchPageStyle.notFoundHeading}>
            {' '}
            Did not find your items ?
          </Text>
          <Text style={SearchPageStyle.notFoundSubHeading}>
            Let us know by filling in details below{' '}
            {searchValue ? (
              <Text style={SearchPageStyle.notFoundText}>'{searchValue}'</Text>
            ) : (
              ''
            )}
          </Text>
          <TouchableOpacity
            style={SearchPageStyle.filterButton}
            onPress={() => setModalVisible(true)}>
            <Text
              style={{
                color: 'white',
                fontSize: 14,
                paddingVertical: hp('1%'),
                paddingHorizontal: hp('1%'),
              }}>
              SUGGEST A PRODUCT
            </Text>
          </TouchableOpacity>
        </View>
      ) : null;
    },
    [searchData?.products, searchValue, loading, filters, pageNumber],
  );

  useEffect(() => {
    inputRef.current.focus();
    fetchSearchProducts('search');
  }, []);

  useEffect(() => {
    if (pageNumber > 0 && !isMount) {
      pageNumber <= totalPages - 1 && fetchSearchProducts('loadMore');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber]);

  useEffect(() => {
    if (!isMount) {
      if (searchTimeOut !== 0) {
        clearTimeout(searchTimeOut);
      }
      const timeOut = setTimeout(() => {
        setSearchData({
          products: [],
          searchInfo: {},
        });
        fetchSearchProducts('search', searchValue);
        goToTop();
      }, 500);
      setSearchTiemeOut(timeOut);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchValue]);

  useEffect(() => {
    setSearchData({
      products: [],
      searchInfo: {},
    });
    fetchSearchProducts('search');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // const startRecognizing = async () => {
  //   //Starts listening for speech for a specific locale
  //   try {
  //     setVoiceVisible(true);
  //     setVoiceSearchResult('Listening...');
  //     await Voice.start('en-US');
  //   } catch (e) {
  //     console.error(e);
  //     setVoiceVisible(false);
  //   }
  // };

  return (
    <View style={{flex: 1}}>
      <SafeAreaView>
        <View style={SearchPageStyle.searchBoxWrapper}>
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            style={SearchPageStyle.backIconWrapper}>
            <Icon name="md-arrow-back" size={23} color={'#000'} />
          </TouchableOpacity>
          <TextInput
            ref={inputRef}
            style={SearchPageStyle.inputField}
            onChangeText={text => setSearchValue(text?.trimStart())}
            value={searchValue}
            placeholder={'Search for products, brands...'}
            clearButtonMode={'always'}
            spellCheck={false}
            autoCorrect={false}
            autoCapitalize={'none'}
            autoFocus={true}
            underlineColorAndroid={'transparent'}
            selectionColor={'#000'}
            returnKeyType="search"
          />
          {/* startRecognizing */}
          {/* <TouchableOpacity
            style={SearchPageStyle.voice}
            onPress={startRecognizing}>
            <FastImage
              style={SearchPageStyle.closeIcon}
              source={require('../../assets/googleVoice.png')}
            />
          </TouchableOpacity> */}
        </View>
      </SafeAreaView>
      {renderContent(loading)}
      <View style={styles.filterSortContainer}>
        <View style={styles.filterSortWrapper}>
          <View style={styles.filterButtonWrapper}>
            <Filters
              searchInfo={searchData?.searchInfo}
              defaultFilters={filters}
              applyFilters={applyFilters}
            />
          </View>
          <View style={styles.sortButtonWrapper}>
            <TouchableCustom
              underlayColor={'#ffffff10'}
              onPress={() => setSortModal(true)}>
              <View style={{...styles.sortButton, width: DeviceWidth / 2}}>
                <Text allowFontScaling={false} style={styles.sortButtonText}>
                  SORT
                </Text>
              </View>
            </TouchableCustom>
          </View>
        </View>
      </View>
      <Modal
        onRequestClose={handleCloseModal}
        visible={modalVisible}
        transparent={true}
        animationType="slide">
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          showsVerticalScrollIndicator={false}
          style={{flex: 1}}>
          <View style={SearchPageStyle.modalMainView}>
            <View
              style={{
                flex: 1,
              }}></View>
            <View style={SearchPageStyle.addressModalView}>
              <View
                style={{
                  backgroundColor: 'white',
                  padding: 2,
                  width: 80,
                  height: 80,
                  borderRadius: 50,
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 40,
                  position: 'absolute',
                  alignSelf: 'center',
                  top: 0,
                }}>
                <View
                  style={[
                    {
                      alignSelf: 'center',
                      backgroundColor: '#FFF',
                      width: 75,
                      height: 75,
                      borderRadius: 50,
                      borderWidth: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderColor: '#6ACADD',
                      position: 'absolute',
                    },
                  ]}>
                  <Image
                    source={require('../../assets/findIcon.png')}
                    style={{
                      height: 100,
                      width: 100,
                    }}
                    resizeMode="contain"
                  />
                </View>
              </View>
              <LinearGradient
                start={{x: 0, y: 0}}
                end={{x: 1, y: 0}}
                colors={['#6ACADD', '#B5D784']}
                style={SearchPageStyle.modalHeaderView}>
                {/* <View> */}
                <View
                  style={{
                    marginTop: 45,
                    justifyContent: 'center',
                    paddingVertical: 4,
                  }}>
                  <Text
                    allowFontScaling={false}
                    style={[SearchPageStyle.headerText]}>
                    Suggest Product
                  </Text>
                </View>
                {/* </View> */}

                <Pressable
                  style={styles.closeIconView}
                  onPress={handleCloseModal}>
                  <Icon
                    name={'closecircleo'}
                    type={'AntDesign'}
                    style={styles.closeIcon}
                  />
                </Pressable>
              </LinearGradient>
              <View
                style={{
                  paddingHorizontal: 10,
                  backgroundColor: colors.white,
                }}>
                <Text style={SearchPageStyle.textStyle}>
                  Didn't find what you are looking for? Let us know by filling
                  in details below
                </Text>
                <View
                  style={{
                    flexDirection: 'row',
                    borderRadius: 30,
                    alignItems: 'center',
                    marginVertical: 10,
                    borderWidth: 1,
                    borderColor: colors.LightGray,
                  }}>
                  <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={{
                      width: 60,
                      height: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderTopLeftRadius: 26,
                      borderBottomLeftRadius: 26,
                    }}
                    colors={['#6ACADD', '#B5D784']}>
                    <Image
                      style={{width: 30, height: 30}}
                      source={require('../../assets/Product_icon.png')}
                    />
                  </LinearGradient>

                  <TextInputComponent
                    style={{marginLeft: 10}}
                    placeholder="Product Name"
                    keyboardType="text"
                    defaultValue={productName}
                    onChangeText={value => {
                      setProductName(value);
                      setError('');
                    }}
                  />
                </View>
                {!!error && <Text style={{color: colors.red}}>{error}</Text>}
                <View
                  style={{
                    flexDirection: 'row',
                    borderRadius: 30,
                    alignItems: 'center',
                    marginVertical: 10,
                    borderWidth: 1,
                    borderColor: colors.LightGray,
                  }}>
                  <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    style={{
                      width: 60,
                      height: 50,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderTopLeftRadius: 26,
                      borderBottomLeftRadius: 26,
                    }}
                    colors={['#6ACADD', '#B5D784']}>
                    <Image
                      style={{width: 50, height: 50}}
                      source={require('../../assets/Brand_icon.png')}
                    />
                  </LinearGradient>
                  <TextInputComponent
                    style={{marginLeft: 10}}
                    placeholder="Brand Name (Optional)"
                    keyboardType="text"
                    defaultValue={brandName}
                    onChangeText={value => setBrandName(value)}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    borderRadius: 50,
                    alignItems: 'center',
                    marginVertical: 10,
                    paddingLeft: 60,
                    borderWidth: 1,
                    borderColor: colors.LightGray,
                  }}>
                  <TextInputComponent
                    placeholder="Comment (Optional)"
                    multiline={true}
                    numberOfLines={2}
                    keyboardType="text"
                    defaultValue={commentName}
                    onChangeText={value => setComment(value)}
                  />
                </View>
                <TouchableOpacity
                  style={{
                    paddingBottom: Platform.OS === 'ios' ? hp('3%') : hp('4%'),
                  }}
                  onPress={() => {
                    !loading ? addProductSuggestion() : null;
                  }}>
                  <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                    colors={['#6ACADD', '#B5D784']}
                    style={SearchPageStyle.submitBtn}>
                    {loading ? (
                      <ActivityIndicator size="small" transparent={true} />
                    ) : (
                      <Text
                        style={{
                          color: 'white',
                          textAlign: 'center',
                          fontSize: 15,
                        }}>
                        Submit
                      </Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
      {/* voiceModel==================== */}
      {/* <Modal
        style={{flex: 1}}
        visible={voiceVisible}
        transparent={false}
        animationType="slide">
        <SafeAreaView style={SearchPageStyle.modelContinuer}>
          <View style={SearchPageStyle.modelContinuerSub}>
            <TouchableOpacity
              onPress={() => {
                Voice.cancel();
              }}
              style={SearchPageStyle.imageContinuer}>
              <FastImage
                style={SearchPageStyle.closeIcon}
                source={require('../../assets/close.png')}
              />
            </TouchableOpacity>
            <View style={SearchPageStyle.micView}>
              <FastImage
                resizeMode="cover"
                style={SearchPageStyle.micImage}
                source={require('../../assets/micOrange.gif')}
              />
            </View>
            <Text style={SearchPageStyle.voiceText}>{voiceSearchResult}</Text>
            <TouchableOpacity
              onPress={() => Voice.stop()}
              style={SearchPageStyle.button}>
              <Text style={SearchPageStyle.buttonText}>Complete</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal> */}

      <Modal
        transparent={true}
        animationType={'fade'}
        visible={sortModal}
        onRequestClose={() => {
          setSortModal(false);
        }}>
        <View style={SearchPageStyle.containerr}>
          <View style={SearchPageStyle.contentt}>
            <View style={SearchPageStyle.headerr}>
              <View style={SearchPageStyle.filterHeadingg}>
                <Text style={SearchPageStyle.filterHeadingTextt}>Sort By:</Text>
              </View>
            </View>
            <View style={SearchPageStyle.bodyy}>
              <View style={SearchPageStyle.filterContainerr}>
                <SortBy />
              </View>
            </View>
            <View style={SearchPageStyle.footerr}>
              <TouchableOpacity
                style={SearchPageStyle.cancleButtonn}
                onPress={() => {
                  setSortModal(false);
                }}>
                <Text
                  style={{color: 'white', textAlign: 'center', fontSize: 15}}>
                  CANCEL
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={SearchPageStyle.applyButtonn}
                onPress={() => {
                  fetchSearchProducts('search');
                  setSortModal(false);
                }}>
                <Text
                  style={{color: 'white', textAlign: 'center', fontSize: 15}}>
                  APPLY
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
