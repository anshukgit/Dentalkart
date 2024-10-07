import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  FlatList,
  ToastAndroid,
} from 'react-native';
import {GET_CATEGORY_QUESTIONS_QUERY} from './graphql';
import {Query} from 'react-apollo';
import TouchableCustom from '@helpers/touchable_custom';
import styles from './questions.style';
import Header from '@components/header';
import {showErrorMessage} from '../../../../helpers/show_messages';
import {newclient} from '@apolloClient';
import HeaderComponent from '@components/HeaderComponent';

export default class FaqQuestions extends Component {
  render() {
    const {navigation} = this.props;
    const item = navigation.getParam('item', 'NO-NAME');
    return (
      <View>
        <HeaderComponent
          navigation={this.props.navigation}
          label={'Help Center'}
          style={{height: 40}}
        />
        <Query
          query={GET_CATEGORY_QUESTIONS_QUERY}
          variables={{id: parseInt(item.category_id)}}
          fetchPolicy="cache-and-network"
          client={newclient}
          onError={(error) => {
            showErrorMessage(`${error.message}. Please try again.`);
          }}>
          {({loading, error, data}) => {
            if (loading) {
              return <ActivityIndicator size="large" color="#343434" />;
            }
            if (error) {
              return showErrorMessage(`${error.message}. Please try again.`);
            }
            if (data.faqcategoryitem) {
              const {faqcategoryitem} = data;
              return (
                <View>
                  <View style={styles.qustionsHeader}>
                    <Image
                      resizeMethod={'resize'}
                      style={styles.qustionsHeaderImage}
                      source={{uri: item.thumbnail}}
                    />
                    <Text
                      allowFontScaling={false}
                      style={styles.qustionsHeaderTitle}>
                      {item.category_name}
                    </Text>
                  </View>
                  <FlatList
                    data={faqcategoryitem}
                    keyExtractor={(item, index) => item.id.toString()}
                    renderItem={({item}) => (
                      <Question item={item} _this={this} />
                    )}
                    style={{borderRadius: 10}}
                  />
                </View>
              );
            }
          }}
        </Query>
      </View>
    );
  }
}

const Question = ({_this, item}) => {
  return (
    <View style={styles.listWrapper}>
      <TouchableCustom
        onPress={() =>
          _this.props.navigation.navigate('FaqAnswers', {item: item})
        }
        underlayColor="#dddddd20">
        <View style={styles.questionCardWrapper}>
          <View style={styles.dot} />
          <Text allowFontScaling={false} style={styles.categoryQuestion}>
            {item.question}
          </Text>
        </View>
      </TouchableCustom>
    </View>
  );
};
