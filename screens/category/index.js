import React, {Component, Fragment, useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  SectionList,
  Image,
  ActivityIndicator,
  ToastAndroid,
  Modal,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import {Query} from 'react-apollo';
import {GET_CATEGORY_PRODUCTS_QUERY, GET_FILTERS_QUERY} from './graphql';
import ProductListing from './modules/product_listing';
import Header from '@components/header';
import styles from './category.style';
import {DentalkartContext} from '@dentalkartContext';
import Loader from '@components/loader';
import {fireAnalyticsEvent} from '@helpers/firebase_analytics';
import TouchableCustom from '@helpers/touchable_custom';
import AIcon from 'react-native-vector-icons/Ionicons';
import {SecondaryColor, DeviceWidth, DeviceHeight} from '@config/environment';
import Icon from 'react-native-vector-icons/Entypo';
import CheckBox from '@react-native-community/checkbox';
import HeaderComponent from '@components/HeaderComponent';
import {SafeAreaView} from 'react-navigation';
import {productClick} from '../../helpers/sendData';
import AnalyticsEvents from '../../components/Analytics/AnalyticsEvents';
import {client, newclient} from '../../apollo_client';
import Carousel from 'react-native-snap-carousel';

const mobileBanner =
  'https://s3.ap-south-1.amazonaws.com/dentalkart-media/React/PLP+Top+Banner/Mobile-White-Gloves.jpg';
const bannerLink = 'waldent-latex-examination-gloves.html';

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
const CustomCheckBox = ({data, item, changeFilteredData, filteredData}) => {
  let checked = false;
  if (item?.label === 'Price Range') {
    if (filteredData?.price) {
      let value = data.value.split('-');
      if (
        value[0] == filteredData?.price?.min_price &&
        value[1] == filteredData?.price?.max_price
      ) {
        checked = true;
      }
    }
  } else {
    if (filteredData?.manufacturer?.length) {
      checked = filteredData?.manufacturer?.includes(data?.value);
    }
  }
  return (
    <TouchableCustom
      onPress={() => {
        AnalyticsEvents('FILTER_CATEGORY', 'filterCategory', {
          category_selected: data.label,
        });
        changeFilteredData(data, item.label, item.code, checked);
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          height: 30,
          marginStart: 5,
        }}>
        <CheckBox
          value={checked}
          onValueChange={() =>
            Platform.OS === 'ios'
              ? null
              : changeFilteredData(data, item.label, item.code, checked)
          }
          style={{width: 20, height: 20}}
        />
        <Text allowFontScaling={false} style={{marginStart: 5}}>
          {'  ' + data.label}
        </Text>
      </View>
    </TouchableCustom>
  );
};
const sort = [
  {label: 'Popularity', key: {}},
  {label: 'Price -- Low to High', key: {price: 'ASC'}},
  {label: 'Price -- High to Low', key: {price: 'DESC'}},
];
const SortBy = props => {
  return (
    <View style={{marginTop: 15, paddingHorizontal: 10}}>
      {sort.map((sortby, index) => (
        <View style={{marginBottom: 10}}>
          <TouchableOpacity
            style={{flexDirection: 'row', alignItems: 'center'}}
            onPress={() => {
              props.applySort(sort[index], index);
            }}>
            <View style={{marginRight: 10}}>
              <RadioButton selected={props.selectedSortIndex === index} />
            </View>
            <Text allowFontScaling={false}>{sortby.label}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const FilterList = props => {
  const [activeTab, setActiveTab] = useState([]);
  const [openFilters, setOpenFilters] = useState({});
  const [rn, setrn] = useState(Math.random());
  const {filteredData, setFilteredData} = props;
  const changeFilteredData = (data, name, code, checked) => {
    checked
      ? deleteFilteredData(data, name, code)
      : addFilteredData(data, name, code);
  };
  const addFilteredData = (data, name, code) => {
    let label = name === 'Price Range' ? 'price' : 'manufacturer';
    let filteredDataObject = filteredData;
    let prevData;
    if (label === 'price') {
      let value = data.value.split('-');
      prevData = {
        min_price: parseInt(value[0]),
        max_price: parseInt(value[1]),
      };
      filteredDataObject[label] = prevData;
    } else {
      prevData = filteredDataObject[label] ? filteredDataObject[label] : [];
      filteredDataObject[label] = [...prevData, data.value];
    }
    setFilteredData(filteredDataObject);
  };
  const deleteFilteredData = (data, name, code) => {
    let label = name === 'Price Range' ? 'price' : 'manufacturer';
    let filteredDataObject = filteredData;
    let prevData;
    if (label === 'price') {
      delete filteredDataObject[label];
    } else {
      if (filteredDataObject[label].length === 1) {
        delete filteredDataObject[label];
      } else {
        prevData = filteredDataObject[label];
        let no = prevData.indexOf(data.value);
        prevData.splice(no, 1);
        filteredDataObject[label] = [...prevData];
      }
    }
    setFilteredData(filteredDataObject);
  };
  const initState = index => {
    if (!activeTab.includes(index)) {
      const tempActiveTab = activeTab;
      tempActiveTab.push(index);
      setActiveTab(tempActiveTab);
      setrn(Math.random());
    } else {
      const tempActiveTab = activeTab;
      tempActiveTab.splice(tempActiveTab.indexOf(index), 1);
      setActiveTab(tempActiveTab);
      setrn(Math.random());
    }
  };
  const filteredDataArray = Object.keys(filteredData);
  return (
    <View>
      {/* <View style={{ paddingHorizontal: 10 }}>
        {filteredDataArray.length > 0 && (
          <View style={{ marginVertical: 10 }}>
            <Text allowFontScaling={false} style={{ fontSize: 20 }}>Selected Filters</Text>
          </View>
        )}
        <View style={{ flexDirection: 'row' }}>
          {filteredDataArray.map((data, index) => (
            <TouchableOpacity onPress={() => deleteFilteredData(data)}>
              <View
                style={{
                  backgroundColor: '#e0e0e0',
                  flexDirection: 'row',
                  borderRadius: 10,
                  padding: 5,
                  alignItems: 'center',
                  marginBottom: 10,
                  marginRight: 10,
                }}>
                <Text allowFontScaling={false} style={{ marginRight: 7 }}>{data}</Text>
                <AIcon name="md-close" size={18} color="#333" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View> */}
      <View style={styles.productTabsWrapper}>
        <FlatList
          keyboardShouldPersistTaps={'always'}
          data={props.data}
          renderItem={({item, index}) => (
            <DescriptionTabs
              filteredData={filteredData}
              item={item}
              index={index}
              initState={initState}
              activeTab={activeTab}
              changeFilteredData={changeFilteredData}
            />
          )}
          keyExtractor={(item, index) => index.toString()}
          extraData={rn}
          style={{marginBottom: 10}}
          ListFooterComponent={() => <View style={{height: 80}} />}
        />
      </View>
    </View>
  );
};

const DescriptionTabs = ({
  item,
  index,
  initState,
  activeTab,
  changeFilteredData,
  filteredData,
}) => {
  const data = item;
  return (
    <View>
      <TouchableCustom
        underlayColor={'#ffffff10'}
        onPress={() => initState(index)}>
        <View style={styles.tabTagWrapper}>
          <Text allowFontScaling={false} style={styles.tabTag}>
            {item.label}
          </Text>
          <Icon
            name={
              activeTab === index ? 'chevron-small-up' : 'chevron-small-down'
            }
            size={17}
            color={SecondaryColor}
          />
        </View>
      </TouchableCustom>
      <View style={styles.webViewWrapper}>
        {activeTab.includes(index) ? (
          <View>
            <FlatList
              data={data.options}
              renderItem={({item, index}) => (
                <CustomCheckBox
                  filteredData={filteredData}
                  data={item}
                  item={data}
                  changeFilteredData={changeFilteredData}
                />
              )}
              keyExtractor={(item, index) => index.toString()}
              initialNumToRender={10}
            />
          </View>
        ) : null}
      </View>
    </View>
  );
};

export default class Category extends Component {
  static contextType = DentalkartContext;
  constructor(props) {
    super(props);
    this.getCategoryId = () => {
      const {navigation, urlResolver} = this.props;
      let categoryId = '';
      if (urlResolver) {
        categoryId = urlResolver.id;
      } else {
        categoryId = navigation.getParam('categoryId', 'No-name');
      }
      // return 8;
      return categoryId;
    };
    this.state = {
      nextPage: 2,
      hideLoader: true,
      appliedFilters: [],
      filterSortModal: false,
      selectedSort: sort[0],
      selectedSortIndex: 0,
      sortBy: '',
      price: '',
      manufacturerData: '',
      manufacturer: '',
      category: this.getCategoryId(),
      filteredData: {},
      newItemsState: 1,
    };
  }
  onProductClick = data => {
    const {userInfo} = this.context;
    (data.customer_id = userInfo?.getCustomer.email
      ? userInfo?.getCustomer.email
      : null),
      productClick(data);
  };
  setFilteredData = data => {
    this.setState({filteredData: data});
  };
  getNextPage = totalPage => {
    this.setState({
      nextPage: this.state.nextPage + 1,
      hideLoader: false,
    });
  };
  showLoader = () => {
    this.setState({
      hideLoader: true,
    });
  };
  triggerScreenEvent = _ => {
    const {userInfo} = this.context;
    let categoryId = this.getCategoryId();
    const {navigation} = this.props;
    let {params} = navigation.state;
    const entry = params ? params.entry : false;
    fireAnalyticsEvent({
      eventname: 'screenname',
      screenName: `Category: ${categoryId}`,
      entry,
      userId: userInfo && userInfo.getCustomer ? userInfo.getCustomer.id : '',
    });
  };
  componentDidMount() {
    this.triggerScreenEvent();
  }
  applyFilter = (type, data, code) => {
    let {manufacturerData, appliedFilters} = this.state;
    let appliedFilter = {
      field_name: code,
      field_value: data.value,
      condition_type: 'eq',
    };
    switch (type) {
      case 'Category':
        this.setState({category: data.value});
        break;
      case 'Price':
        this.setState({price: data.value});
        break;
      case 'Manufacturer':
        manufacturerData = {};
        manufacturerData[data.label] = data.value;
        this.setState({
          manufacturer: data.value,
          manufacturerData,
        });
        break;
      default:
        console.error('No such type of ' + type + ' found.');
        break;
    }
    appliedFilters = appliedFilters.filter(
      item => item.field_name !== appliedFilter.field_name,
    );
    appliedFilters.push(appliedFilter);
    this.setState({appliedFilters});
  };
  removeFilter = async data => {
    let {manufacturerData, category, price, pageId, appliedFilters} =
      this.state;
    appliedFilters = appliedFilters.filter(
      item => item.field_value !== Object.values(data)[0],
    );
    this.setState({appliedFilters});
    if (category === Object.values(data)[0]) {
      this.setState({category: this.getCategoryId()});
    } else if (manufacturerData[Object.keys(data)[0]]) {
      delete manufacturerData[Object.keys(data)[0]];
      this.setState({
        manufacturerData,
        manufacturer:
          Object.values(manufacturerData).length > 0
            ? Object.values(manufacturerData)
            : '',
      });
    } else if (price === Object.values(data)[0]) {
      this.setState({price: ''});
    }
  };
  clearAllFilters = () => {
    this.setState({
      category: this.getCategoryId(),
      price: '',
      manufacturer: '',
      manufacturerData: '',
      appliedFilters: [],
      filteredData: {},
    });
  };
  applySort = (key, index) => {
    this.setState({sortBy: key.key, selectedSortIndex: index});
  };
  filterSort = ({filters}) => {
    return (
      <Fragment>
        <View style={styles.filterSortContainer}>
          <View style={styles.filterSortWrapper}>
            <View style={styles.filterButtonWrapper}>
              <TouchableCustom
                underlayColor={'#ffffff10'}
                onPress={() =>
                  this.setState({filterSortModal: true, modalType: 'filter'})
                }>
                <View style={styles.filterButton}>
                  <Text allowFontScaling={false} style={styles.filterText}>
                    Filter
                  </Text>
                </View>
              </TouchableCustom>
            </View>
            <View style={styles.sortButtonWrapper}>
              <TouchableCustom
                underlayColor={'#ffffff10'}
                onPress={() =>
                  this.setState({filterSortModal: true, modalType: 'sort'})
                }>
                <View style={{...styles.sortButton, width: DeviceWidth / 2}}>
                  <Text allowFontScaling={false} style={styles.sortButtonText}>
                    Sort
                  </Text>
                </View>
              </TouchableCustom>
            </View>
          </View>
        </View>
        <Modal
          visible={this.state.filterSortModal}
          transparent={false}
          animationType="fade"
          onRequestClose={() => this.setState({filterSortModal: false})}>
          <SafeAreaView style={{flex: 1}}>
            <View style={styles.modalHeader}>
              <TouchableOpacity
                style={styles.backIconWrapper}
                onPress={() => this.setState({filterSortModal: false})}
                hitSlop={{top: 20, right: 10, bottom: 20, left: 20}}>
                <AIcon name="md-close" size={23} color="#ffffff" />
              </TouchableOpacity>
              <Text allowFontScaling={false} style={styles.headerHeading}>
                {this.state.modalType === 'filter' ? 'Filters' : 'Sort By'}
              </Text>
            </View>
            <ScrollView>
              {this.state.modalType === 'filter' ? (
                <Query
                  client={newclient}
                  query={GET_FILTERS_QUERY}
                  variables={{
                    category_id: parseInt(this.getCategoryId()),
                  }}
                  fetchPolicy="cache-and-network">
                  {({loading, data, error}) => {
                    if (loading) {
                      return (
                        <View
                          style={{
                            flex: 1,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: DeviceHeight - 50,
                          }}>
                          <ActivityIndicator
                            size="large"
                            color={SecondaryColor}
                          />
                        </View>
                      );
                    }
                    if (error) {
                      return (
                        <Text allowFontScaling={false}>
                          {JSON.stringify(error)}
                        </Text>
                      );
                    }
                    filters =
                      data && data.getCategoryFilters?.filters
                        ? data.getCategoryFilters?.filters
                        : [];
                    if (data && data.getCategoryFilters) {
                      return (
                        <FilterList
                          applySort={this.applySort}
                          data={filters}
                          applyFilter={this.applyFilter}
                          removeFilter={this.removeFilter}
                          clearAllFilters={this.clearAllFilters}
                          filteredData={this.state.filteredData}
                          setFilteredData={this.setFilteredData}
                        />
                      );
                    }
                  }}
                </Query>
              ) : (
                <SortBy
                  applySort={this.applySort}
                  selectedSortIndex={this.state.selectedSortIndex}
                />
              )}
            </ScrollView>
            <View style={styles.filterSortContainer}>
              <View style={styles.filterSortWrapper}>
                {this.state.modalType === 'filter' && (
                  <View style={styles.filterButtonWrapper}>
                    <TouchableCustom
                      underlayColor={'#ffffff10'}
                      onPress={() => this.clearAllFilters()}>
                      <View style={styles.filterButton}>
                        <Text
                          allowFontScaling={false}
                          style={styles.filterText}>
                          Clear All
                        </Text>
                      </View>
                    </TouchableCustom>
                  </View>
                )}
                <View
                  style={{
                    ...styles.sortButtonWrapper,
                    width:
                      this.state.modalType === 'filter'
                        ? DeviceWidth / 2
                        : DeviceWidth,
                  }}>
                  <TouchableCustom
                    underlayColor={'#ffffff10'}
                    onPress={() => this.setState({filterSortModal: false})}>
                    <View
                      style={{
                        ...styles.sortButton,
                        width:
                          this.state.modalType === 'filter'
                            ? DeviceWidth / 2
                            : DeviceWidth,
                      }}>
                      <Text
                        allowFontScaling={false}
                        style={styles.sortButtonText}>
                        Close
                      </Text>
                    </View>
                  </TouchableCustom>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </Modal>
      </Fragment>
    );
  };
  render() {
    const {navigation, urlResolver} = this.props;
    const {userInfo} = this.context;
    const {sortBy, price, manufacturer, category, filteredData} = this.state;
    let categoryId = this.getCategoryId();
    let filters = [];
    return (
      <View style={{flex: 1}}>
        {!urlResolver && (
          <HeaderComponent
            navigation={this.props.navigation}
            label={''}
            style={{height: 40}}
          />
        )}
        <View style={{flex: 0.95}}>
          <Query
            query={GET_CATEGORY_PRODUCTS_QUERY}
            client={newclient}
            variables={{
              categoryId: categoryId,
              filter: {
                ...filteredData,
                // manufacturer:[],
                // price:{}
                // manufacturer: ["22", "546"]
                // price: {min_price: 100, max_price: 345850}
              },
              sort: {
                ...sortBy,
              },
            }}
            fetchPolicy="cache-and-network"
            onError={() => navigation.navigate({screen: 'Home'})}>
            {({loading, error, data, fetchMore}) => {
              // if (loading) {
              //   return <Loader loading={true} transparent={false} />;
              // }
              if (error) {
                return (
                  <Text allowFontScaling={false}>{JSON.stringify(error)}</Text>
                );
              }
              if (data !== undefined && data?.getCategoryProducts) {
                AnalyticsEvents('PRODUCT_SCREEN', 'productviewed', data);
                const {
                  ads_banner,
                  category,
                  name,
                  items,
                  page_no,
                  product_count,
                } = data?.getCategoryProducts;
                console.log('ads_banner', ads_banner);
                // const items = products.items;
                const current_page = page_no;
                // const image = category.image;
                const totalProducts = product_count;
                const totalPage =
                  parseInt(totalProducts % 20) > 0
                    ? parseInt(totalProducts / 20) + 1
                    : parseInt(totalProducts / 20);
                return (
                  <View style={{flex: 1}}>
                    <SectionList
                      renderItem={({item}) => (
                        <ProductListing
                          item={item}
                          _this={this}
                          showLoader={this.state.showLoader}
                          categoryId={categoryId}
                          onProductClick={data =>
                            this.onProductClick({...data, section: name})
                          }
                        />
                      )}
                      sections={[
                        {
                          data: items?.length ? items : [],
                          title: name,
                          image: ads_banner[0]?.banners,
                        },
                      ]}
                      renderSectionHeader={({section}) => (
                        <View>
                          <Text
                            allowFontScaling={false}
                            style={styles.categoryTitle}>
                            {section.title}
                          </Text>
                          <Carousel
                            layout={'default'}
                            ref={c => {
                              this._carousel = c;
                            }}
                            hasParallaxImages={true}
                            data={section?.image}
                            inactiveSlideScale={0.94}
                            inactiveSlideOpacity={0.7}
                            renderItem={({item}) => {
                              return (
                                <TouchableOpacity
                                  activeOpacity={0.5}
                                  onPress={() => {
                                    item?.app_url?.includes('sale')
                                      ? navigation.navigate('Branding', {
                                          saleUrl: item.app_url,
                                        })
                                      : navigation.navigate('UrlResolver', {
                                          url_key: item.app_url,
                                        });
                                  }}>
                                  <Image
                                    source={{uri: item?.mobile_img}}
                                    style={styles.categoryImage}
                                  />
                                </TouchableOpacity>
                              );
                            }}
                            sliderWidth={DeviceWidth}
                            itemWidth={DeviceWidth}
                            loop={true}
                            // loopClonesPerSide={6}
                            contentContainerCustomStyle={{
                              paddingVertical: 10,
                              backgroundColor: '#FFF',
                            }}
                          />
                        </View>
                      )}
                      style={styles.categoryWrapper}
                      keyExtractor={(items, index) => index}
                      onEndReachedThreshold={0.9}
                      onEndReached={() => {
                        if (
                          this.state.nextPage < totalPage &&
                          items.length > 20
                        ) {
                          this.getNextPage(totalPage);
                          fetchMore({
                            variables: {pageNo: this.state.nextPage},
                            updateQuery: (prevResult, {fetchMoreResult}) => {
                              const prevItems =
                                prevResult.getCategoryProducts.items;
                              const newItems =
                                fetchMoreResult.getCategoryProducts.items;
                              this.setState({newItemsState: newItems?.length});
                              return newItems.length
                                ? {
                                    getCategoryProducts: {
                                      ...fetchMoreResult.getCategoryProducts,
                                      items: [...prevItems, ...newItems],
                                    },
                                  }
                                : prevResult;
                            },
                          });
                          this.showLoader();
                        }
                      }}
                      renderSectionFooter={() => {
                        return this.state.nextPage < totalPage &&
                          items.length > 20 &&
                          this.state.newItemsState > 0 ? (
                          <View style={{marginBottom: 70}}>
                            <ActivityIndicator size="large" color="#343434" />
                          </View>
                        ) : null;
                      }}
                    />
                    {items && items.length ? null : (
                      <View
                        style={{
                          flex: 2,
                          width: '100%',
                          alignItems: 'center',
                          justifyContent:
                            Object.keys(filteredData).length === 0
                              ? 'center'
                              : 'flex-start',
                        }}>
                        <Image
                          resizeMode="contain"
                          source={require('../../assets/notfound.png')}
                          style={{width: 200, height: 200}}
                        />
                        <Text
                          style={{
                            fontWeight: '400',
                            fontSize: 16,
                            width: '80%',
                            textAlign: 'center',
                          }}>
                          {Object.keys(filteredData).length === 0
                            ? 'No product available'
                            : "We couldn't find Products for selected filters"}
                        </Text>
                      </View>
                    )}
                  </View>
                );
              } else {
                return (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <ActivityIndicator size="large" color="#343434" />
                  </View>
                );
              }
            }}
          </Query>
        </View>
        {this.filterSort({filters})}
      </View>
    );
  }
}
