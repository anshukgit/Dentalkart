import React, {Component} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import WebView from 'react-native-webview';
import TouchableCustom from '@helpers/touchable_custom';
import {Query} from 'react-apollo';
import {
  ADD_QUESTION_ANSWER,
  EDIT_QUESTION_ANSWER,
  GET_PRODUCT_SPECIFICATIONS_QUERY,
  GET_QUESTIONS,
} from '../../graphql';
import {SecondaryColor} from '@config/environment';
import Icon from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import styles from './product_tabs.style';
import {
  showErrorMessage,
  showSuccessMessage,
} from '../../../../helpers/show_messages';
import {newclient, faqClient} from '@apolloClient';
import HTML from 'react-native-render-html';
import Faqs from '@components/faqs';
import tokenClass from '@helpers/token';

export default class ProductTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: '',
      faqTab: true,
      faqData: '',
      postBtnModal: false,
      viewAllQuestionModal: false,
      questionText: '',
      searchText: '',
      loginStatus: null,
      isLoading: null,
    };
  }
  initState(index) {
    this.state.activeTab === index
      ? this.setState({activeTab: ''})
      : this.setState({activeTab: index});
  }

  getQuestions = async () => {
    try {
      const data = await faqClient.query({
        query: GET_QUESTIONS,
        fetchPolicy: 'no-cache',
        variables: {
          product_id: this.props.product?.id,
          enable: 'Enabled',
          // rowsPerPage: 10,
          // pageNumber: 1,
          search: this.state.searchText,
        },
      });
      // console.log(
      //   'data=======of====getQuestions!!==new',
      //   JSON.stringify(data?.data?.getQuestions?.result),
      // );
      if (data) {
        this.setState({faqData: data});
      }
    } catch (error) {}
  };

  prePostButton = async () => {
    if (this.state.loginStatus) {
      this.setState({postBtnModal: true});
    } else {
      this.props.navigation.navigate('Login', {
        screen: 'ProductDetails',
        params: {
          productId: this.props.product?.id,
        },
      });
    }
  };

  enterQuestion = text => {
    this.setState({showQuesError: false});
    this.setState({questionText: text});
  };

  addQuestionAnswer = async () => {
    if (this.state.questionText === '') {
      this.setState({showQuesError: true});
      return false;
    }
    try {
      const token = await tokenClass.getToken();
      let variables = {
        question: this.state.questionText,
        product_id: this.props.product?.id,
        product_name: this.props.product?.name,
        product_image: this.props.product?.thumbnail_url,
        like: 0,
        dislike: 0,
        enable: false,
        customer_token: token,
        user: 'customer',
      };
      const data = await faqClient.mutate({
        mutation: ADD_QUESTION_ANSWER,
        variables: variables,
      });
      if (data) {
        showSuccessMessage('Question Posted Successfully', 'top');
        this.getQuestions();
        this.setState({questionText: ''});
        this.setState({postBtnModal: false});
      }
    } catch (error) {}
  };

  editQuestionsAnswer = async props => {
    try {
      let variables = {
        product_id: 1,
        _id: props?.questionId,
        like: props?.likes,
        dislike: props?.dislikes,
      };
      const data = await faqClient.mutate({
        mutation: EDIT_QUESTION_ANSWER,
        variables: variables,
      });
      if (data) {
        this.setState({isLoading: false}, () => {
          this.getQuestions();
        });
      }
    } catch (error) {}
  };

  searchPress = () => {
    this.getQuestions();
  };

  crossPress = () => {
    this.setState({searchText: ''}, () => {
      this.getQuestions();
    });
  };

  searchingText = text => {
    this.setState({searchText: text}, () => {
      this.getQuestions();
    });
  };
  async componentDidMount() {
    this.getQuestions();
    const loginStatus = await tokenClass.loginStatus();
    this.setState({loginStatus: loginStatus});
  }
  render() {
    const {product, activeTab} = this.props;
    return (
      <>
        <Query
          query={GET_PRODUCT_SPECIFICATIONS_QUERY}
          variables={{id: product.id}}
          fetchPolicy="cache-and-network"
          client={newclient}
          onError={error => {
            showErrorMessage(`${error.message}. Please try again.`);
          }}>
          {({data, loading, error}) => {
            if (loading || error) {
              return null;
            }
            if (data.GetAttributesBySku) {
              const productKeys = data.GetAttributesBySku.attributes;

              let filteredData = productKeys.filter(item => {
                return item.attribute_label !== 'FAQs';
              });
              return (
                <View style={styles.productTabsWrapper}>
                  <FlatList
                    keyboardShouldPersistTaps={'always'}
                    data={filteredData}
                    renderItem={({item, index}) => (
                      <DescriptionTabs item={item} index={index} _this={this} />
                    )}
                    keyExtractor={(item, index) => index.toString()}
                    extraData={this.state.activeTab}
                    style={{marginBottom: 10}}
                  />

                  <View style={{top: -10}}>
                    <TouchableCustom
                      underlayColor={'#ffffff10'}
                      onPress={() =>
                        this.setState({faqTab: !this.state.faqTab})
                      }>
                      <View style={styles.tabTagWrapperr}>
                        <Text allowFontScaling={false} style={styles.tabTag}>
                          FAQs
                        </Text>
                        <Icon
                          name={
                            this.state.faqTab
                              ? 'chevron-small-up'
                              : 'chevron-small-down'
                          }
                          size={17}
                          color={SecondaryColor}
                        />
                      </View>
                    </TouchableCustom>
                    {this.state.faqTab ? (
                      <>
                        <View style={styles.faqTabMainContainer}>
                          <View style={styles.faqContainer}>
                            {this.state.faqData?.data?.getQuestions?.count !==
                              0 || this.state.searchText ? (
                              <View style={styles.postSearchView}>
                                <TextInput
                                  style={styles.postSearch}
                                  placeholder="Search Question"
                                  onChangeText={text =>
                                    this.searchingText(text)
                                  }
                                  value={this.state.searchText}
                                />
                                <TouchableOpacity onPress={this.searchPress}>
                                  <AntDesign
                                    name={'search1'}
                                    size={17}
                                    color={'black'}
                                  />
                                </TouchableOpacity>
                                {this.state.searchText ? (
                                  <TouchableOpacity onPress={this.crossPress}>
                                    <Icon
                                      name={'cross'}
                                      size={25}
                                      color={'black'}
                                    />
                                  </TouchableOpacity>
                                ) : null}
                              </View>
                            ) : null}

                            <FlatList
                              data={this.state.faqData?.data?.getQuestions?.result.slice(
                                0,
                                3,
                              )}
                              keyExtractor={item => item?._id}
                              renderItem={item => {
                                return (
                                  <Faqs
                                    items={item?.item}
                                    _this={this}
                                    loginStatus={this.state.loginStatus}
                                    // isLoading={this.state.isLoading}
                                  />
                                );
                              }}
                            />

                            {this.state.faqData?.data?.getQuestions?.count ===
                              0 && this.state.searchText ? (
                              <Text style={styles.NoQuesAvailText}>
                                No Questions Available.
                              </Text>
                            ) : null}

                            {this.state.faqData?.data?.getQuestions?.count >
                            3 ? (
                              <View style={styles.viewAllQues}>
                                <TouchableOpacity
                                  onPress={() =>
                                    this.setState({viewAllQuestionModal: true})
                                  }>
                                  <Text style={styles.viewAllText}>
                                    View all{' '}
                                    {
                                      this.state.faqData?.data?.getQuestions
                                        ?.count
                                    }{' '}
                                    Questions
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            ) : null}

                            <View style={styles.faqTabContainer}>
                              <Text style={styles.noDataText}>
                                Have doubts regarding this product?
                              </Text>
                              <TouchableOpacity
                                style={styles.postQuesButton}
                                onPress={this.prePostButton}>
                                <Text style={styles.postQuesButtonText}>
                                  POST YOUR QUESTION
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      </>
                    ) : null}
                  </View>
                </View>
              );
            } else {
              return null;
            }
          }}
        </Query>
        <Modal
          transparent={true}
          animationType={'fade'}
          visible={this.state.postBtnModal}
          // visible={true}
          onRequestClose={() => this.setState({postBtnModal: false})}>
          <View style={styles.modalMainContainer}>
            <View style={styles.modalContainer}>
              <View style={styles.subModalContainer}>
                <View style={styles.postQuesHead}>
                  <Text style={styles.postQuesHeadText}>
                    Post Your Question
                  </Text>
                  <TouchableOpacity
                    onPress={() => this.setState({postBtnModal: false})}>
                    <Icon name={'cross'} size={25} color={'black'} />
                  </TouchableOpacity>
                </View>
                <TextInput
                  style={[
                    styles.postQuesTextInput,
                    this.state.showQuesError ? {borderColor: 'red'} : '',
                  ]}
                  placeholder="Enter Your Question"
                  multiline
                  textAlignVertical="top"
                  value={this.state.questionText}
                  // onChangeText={text => this.setState({questionText: text})}
                  onChangeText={text => this.enterQuestion(text)}
                />
                {this.state.showQuesError ? (
                  <Text style={styles.quesErrorText}>Enter Question</Text>
                ) : null}
                <TouchableOpacity
                  style={styles.postQuesButton}
                  onPress={this.addQuestionAnswer}>
                  <Text style={styles.postQuesButtonText}>
                    POST YOUR QUESTION
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal
          transparent={true}
          animationType={'slide'}
          visible={this.state.viewAllQuestionModal}
          // visible={true}
          onRequestClose={() => this.setState({viewAllQuestionModal: false})}>
          <View style={styles.modalMainContainerr}>
            <View style={styles.modalContainerr}>
              <View style={styles.subModalContainerr}>
                <View style={styles.postQuesHeadd}>
                  <Text style={styles.postQuesHeadText}>All Questions</Text>
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({viewAllQuestionModal: false})
                    }>
                    <Icon name={'cross'} size={25} color={'black'} />
                  </TouchableOpacity>
                </View>
                <FlatList
                  showsVerticalScrollIndicator={false}
                  data={this.state.faqData?.data?.getQuestions?.result}
                  keyExtractor={item => item?._id}
                  renderItem={(item, index) => {
                    return (
                      <Faqs
                        items={item?.item}
                        _this={this}
                        loginStatus={this.state.loginStatus}
                        // isDateShow={true}
                        // isLoading={this.state.isLoading}
                      />
                    );
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
      </>
    );
  }
}

export const RenderHtml = ({htmlContent}) => {
  const preprocessedHtml = htmlContent.replace(/style="[^"]*"/g, '');
  return <HTML source={{html: preprocessedHtml}} />;
};

export const DescriptionTabs = ({item, index, _this}) => {
  let data = item.attribute_value.toString();
  return (
    <View>
      <TouchableCustom
        underlayColor={'#ffffff10'}
        onPress={() => _this.initState(index)}>
        <View style={styles.tabTagWrapper}>
          <Text allowFontScaling={false} style={styles.tabTag}>
            {item.attribute_label.split('_').join(' ').toUpperCase()}
          </Text>
          <Icon
            name={
              _this.state.activeTab === index
                ? 'chevron-small-up'
                : 'chevron-small-down'
            }
            size={17}
            color={SecondaryColor}
          />
        </View>
      </TouchableCustom>
      <View style={styles.webViewWrapper}>
        {_this.state.activeTab === index ? (
          item.attribute_code == 'video' ? (
            <WebView
              source={{uri: item.attribute_value}}
              style={{height: 200}}
            />
          ) : (
            <View style={{paddingHorizontal: 16}}>
              <RenderHtml htmlContent={data} />
            </View>
          )
        ) : null}
      </View>
    </View>
  );
};
