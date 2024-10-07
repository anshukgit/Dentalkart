import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  ScrollView,
  ActivityIndicator,
  Image,
  ToastAndroid,
} from 'react-native';
import Header from '@components/header';
import {GET_FAQ_CATEGORIES_QUERY} from './graphql';
import {Query} from 'react-apollo';
import TouchableCustom from '@helpers/touchable_custom';
import Icon from 'react-native-vector-icons/Ionicons';
import {PrimaryColor} from '@config/environment';
import getImageUrl, {getImageCDNURL} from '@helpers/getImageUrl';
import styles from './helpcenter.style';
import {fireAnalyticsEvent} from '@helpers/firebase_analytics';
import {DentalkartContext} from '@dentalkartContext';
import {showErrorMessage} from '../../helpers/show_messages';
import {newclient} from '@apolloClient';
import HeaderComponent from '@components/HeaderComponent';

export default class HelpCenter extends Component {
  static navigationOptions = {
    title: 'Help Center',
    drawerLabel: ' Help Center',
  };
  static contextType = DentalkartContext;
  triggerScreenEvent = _ => {
    const {userInfo} = this.context;
    fireAnalyticsEvent({
      eventname: 'screenname',
      screenName: 'Help Center',
      userId: userInfo && userInfo.getCustomer ? userInfo.getCustomer.id : '',
    });
  };
  componentDidMount() {
    this.triggerScreenEvent();
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <HeaderComponent
          navigation={this.props.navigation}
          label={'Help Center'}
          style={{height: 40}}
        />
        <ScrollView>
          <Query
            query={GET_FAQ_CATEGORIES_QUERY}
            fetchPolicy="cache-and-network"
            client={newclient}
            onError={error => {
              showErrorMessage(`${error.message}. Please try again.`);
            }}>
            {({loading, data, error}) => {
              if (loading) {
                return <ActivityIndicator size="large" color="#343434" />;
              }
              if (data.faqcategory) {
                console.log(data.faqcategory);
                return (
                  <View>
                    <FlatList
                      renderItem={({item}) => (
                        <Categories item={item} _this={this} />
                      )}
                      data={data.faqcategory}
                      keyExtractor={(item, index) =>
                        item.category_id.toString()
                      }
                      style={{marginTop: 5}}
                    />
                    {/*<ContactUs _this={this}/>*/}
                  </View>
                );
              }
            }}
          </Query>
        </ScrollView>
      </View>
    );
  }
}

const Categories = ({_this, item}) => {
  return (
    <View style={styles.listWrapper}>
      <TouchableCustom
        onPress={() =>
          _this.props.navigation.navigate('FaqQuestions', {item: item})
        }
        underlayColor="#ffffff10">
        <View style={styles.cardWrapper}>
          <View style={styles.categoryNameWrapper}>
            <Image
              resizeMethod={'resize'}
              source={{uri: getImageCDNURL(item.category_thumbnail)}}
              style={styles.categoryImage}
            />
            <Text allowFontScaling={false} style={styles.categoryName}>
              {item.category_name}
            </Text>
          </View>
          <Icon name="ios-arrow-forward" color={PrimaryColor} size={20} />
        </View>
      </TouchableCustom>
    </View>
  );
};

const ContactUs = ({_this}) => {
  return (
    <View style={styles.contactUsContainer}>
      <Text allowFontScaling={false} style={styles.contactUsText}>
        Want to reach us old style?
      </Text>
      <TouchableCustom
        onPress={() => _this.props.navigation.navigate('ContactUs')}
        underlayColor="#ffffff10">
        <View style={styles.contactUsButton}>
          <Text allowFontScaling={false} style={styles.contactUsButtonText}>
            Postal address
          </Text>
        </View>
      </TouchableCustom>
    </View>
  );
};
