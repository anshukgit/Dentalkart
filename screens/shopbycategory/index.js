import React, {Component} from 'react';
import {
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  ToastAndroid,
} from 'react-native';
import TouchableCustom from '@helpers/touchable_custom';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Header from '@components/header';
import {Query} from 'react-apollo';
import {GET_NAVIGATION} from './graphql/navigation.gql';
import styles from './shopbycategory.style';
import {DentalkartContext} from '@dentalkartContext';
import sortCategory from '@helpers/sort_by_position';
import Loader from '@components/loader';
import {fireAnalyticsEvent} from '@helpers/firebase_analytics';
import {showErrorMessage} from '../../helpers/show_messages';
import {newclient} from '@apolloClient';
import AnalyticsEvents from '../../components/Analytics/AnalyticsEvents';

export default class ShopByCategory extends Component {
  static contextType = DentalkartContext;
  constructor(props) {
    super(props);
    this.state = {
      activeCategory: 0,
      isOpen: false,
      subSubCategory: [],
      categoryId: 0,
    };
  }
  isSubCategory(id) {
    return this.state.subSubCategory.length > 0 && id === this.state.categoryId
      ? true
      : false;
  }
  initState(subSubData, id) {
    if (this.state.categoryId !== id) {
      !this.state.isOpen
        ? this.setState({isOpen: true})
        : this.setState({isOpen: false});
      this.setState({subSubCategory: subSubData, categoryId: id});
    } else {
      this.setState({subSubCategory: [], isOpen: false, categoryId: ''});
    }
  }
  renderSubItem({item, analyticsData}) {
    const {push} = this.props.navigation;
    if (item.include_in_menu === 1) {
      return (
        <TouchableCustom
          underlayColor={'#ffffff10'}
          onPress={() => {
            AnalyticsEvents('SUB_CATEGORY_VIEWED', 'Sub Category viewed', {
              category_id: analyticsData.sub_category_id,
              category_name: analyticsData.sub_category_name,
              sub_category_id: item.id,
              sub_category_name: item.name,
            });
            push('Category', {categoryId: item.id});
          }}>
          <View style={styles.subItem}>
            <Text allowFontScaling={false} style={styles.subItemName}>
              {item.name}
            </Text>
          </View>
        </TouchableCustom>
      );
    } else {
      return null;
    }
  }
  renderSection_3(subSubData, id, analyticsData) {
    const {push} = this.props.navigation;
    return (
      <View style={styles.section_3}>
        <TouchableCustom
          underlayColor={'#ffffff10'}
          onPress={() => {
            AnalyticsEvents(
              'SUB_CATEGORY_VIEWED',
              'Sub Category viewed',
              analyticsData,
            );
            push('Category', {categoryId: id});
          }}>
          <View style={styles.subItem}>
            <Text allowFontScaling={false} style={styles.subItemName}>
              View All
            </Text>
          </View>
        </TouchableCustom>
        <FlatList
          renderItem={({item, index}) =>
            this.renderSubItem({item, analyticsData})
          }
          data={subSubData}
          extraData={this.state}
          keyExtractor={(item, index) => JSON.stringify(item.id)}
        />
      </View>
    );
  }
  renderSectionHeader({item, index}) {
    if (item.include_in_menu === 1) {
      return (
        <TouchableCustom
          underlayColor={'#ffffff10'}
          onPress={() => this.setState({activeCategory: index})}>
          <View style={[styles.item, styles.itemWithIcon]}>
            <View
              style={[
                styles.itemWrapper,
                this.state.activeCategory === index ? styles.showBorder : null,
              ]}>
              <View style={styles.categoryNameWrapper}>
                {/* {item.thumbnail ? (
                  <Image
                    source={{uri: item.thumbnail}}
                    style={styles.categoryIcon}
                  />
                ) : null} */}
                <Text allowFontScaling={false} style={styles.subItemName}>
                  {item.name.trim()}
                </Text>
              </View>
              <Icon name="chevron-right" size={15} />
            </View>
          </View>
        </TouchableCustom>
      );
    } else {
      return null;
    }
  }
  renderItem({item, index, categoryData}) {
    const subSubData = item.children ? item.children : [];
    const {push} = this.props.navigation;
    let analyticsData = {
      category_id: categoryData[this.state.activeCategory].id,
      category_name: categoryData[this.state.activeCategory].name,
      sub_category_id: item.id,
      sub_category_name: item.name,
    };
    if (item.include_in_menu === 1) {
      return (
        <TouchableCustom
          underlayColor={'#ffffff10'}
          onPress={() => {
            AnalyticsEvents(
              'SUB_CATEGORY_VIEWED',
              'Sub Category viewed',
              analyticsData,
            );
            subSubData.length > 0
              ? this.initState(subSubData, item.id)
              : push('Category', {categoryId: item.id});
          }}>
          <View style={styles.subItem}>
            <View
              style={this.isSubCategory(item.id) ? styles.showBorder : null}>
              <View style={styles.subChildWrapper}>
                <Text allowFontScaling={false} style={styles.subItemName}>
                  {item.name}
                </Text>
                {subSubData.length > 0 ? (
                  <Icon
                    name={this.isSubCategory(item.id) ? 'minus' : 'plus'}
                    size={15}
                    style={styles.icon}
                  />
                ) : (
                  false
                )}
              </View>
              {this.isSubCategory(item.id)
                ? this.renderSection_3(
                    this.state.subSubCategory,
                    item.id,
                    analyticsData,
                  )
                : false}
            </View>
          </View>
        </TouchableCustom>
      );
    } else {
      return null;
    }
  }
  sortCategories = categories => {
    const sortedCategories = sortCategory(categories);
    sortedCategories.map((category, index) => {
      sortedCategories[index].children = sortCategory(category.children);
      return null;
    });
    return sortedCategories;
  };
  triggerScreenEvent = _ => {
    const {userInfo} = this.context;
    fireAnalyticsEvent({
      eventname: 'screenname',
      screenName: 'Navigation',
      userId: userInfo && userInfo.getCustomer ? userInfo.getCustomer.id : '',
    });
  };
  componentDidMount() {
    this.triggerScreenEvent();
  }
  render() {
    const {userInfo} = this.context;
    return (
      <View>
        <Header goBack title search cart navigation={this.props.navigation} />
        <Query
          query={GET_NAVIGATION}
          fetchPolicy="cache-and-network"
          client={newclient}>
          {({loading, error, data}) => {
            if (loading) {
              return <Loader loading={true} transparent={true} />;
            }
            if (error) {
              return showErrorMessage(`${error.message}. Please try again.`);
            }
            if (data.categoryList) {
              const categoryData = this.sortCategories(
                data.categoryList[0].children,
              );
              const categoryId = categoryData[this.state.activeCategory].id;
              const subCategoryData =
                categoryData[this.state.activeCategory]?.children ?? [];
              console.log('categoryData', categoryData);
              return (
                <View style={styles.container}>
                  <FlatList
                    renderItem={({item, index}) =>
                      this.renderSectionHeader({item, index})
                    }
                    data={categoryData}
                    keyExtractor={(item, index) => JSON.stringify(item.id)}
                    style={styles.section_1}
                    initialNumToRender={13}
                    getItemLayout={(data, index) => {
                      return {length: 40, offset: 40 * index, index: index};
                    }}
                    ListFooterComponent={() => <View style={{height: 200}} />}
                  />
                  <View style={styles.section_2}>
                    <TouchableCustom
                      underlayColor={'#ffffff10'}
                      onPress={() => {
                        AnalyticsEvents('CATEGORY_VIEWED', 'Category viewed', {
                          category_id: categoryId,
                          category_name:
                            categoryData[this.state.activeCategory].name,
                        });
                        categoryId === 496
                          ? this.props.navigation.navigate('BrandPageScreen')
                          : this.props.navigation.push('Category', {
                              categoryId: categoryId,
                            });
                      }}>
                      <View style={styles.subItem}>
                        <Text
                          allowFontScaling={false}
                          style={styles.subItemName}>
                          View All
                        </Text>
                      </View>
                    </TouchableCustom>
                    <FlatList
                      renderItem={({item, index}) =>
                        this.renderItem({item, index, categoryData})
                      }
                      data={subCategoryData}
                      extraData={this.state}
                      keyExtractor={(item, index) => JSON.stringify(item.id)}
                      initialNumToRender={13}
                      getItemLayout={(data, index) => {
                        return {length: 40, offset: 40 * index, index: index};
                      }}
                      ListFooterComponent={() => <View style={{height: 200}} />}
                    />
                  </View>
                </View>
              );
            }
          }}
        </Query>
      </View>
    );
  }
}
