import React, {Component} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
} from 'react-native';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {
  CHECK_PRODUCT_BOUGHT_QUERY,
  SUBMIT_REVIEW_QUERY,
  CUSTOMER_INFO_QUERY,
} from '../graphql';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {TextField} from 'react-native-material-textfield';
import {SecondaryColor} from '@config/environment';
import styles from './write_reviews.style';
import {client} from '@apolloClient';
import {fireAnalyticsEvent} from '@helpers/firebase_analytics';
import {DentalkartContext} from '@dentalkartContext';
import {
  showErrorMessage,
  showSuccessMessage,
} from '../../../helpers/show_messages';
import HeaderComponent from '@components/HeaderComponent';
import AnalyticsEvents from '../../../components/Analytics/AnalyticsEvents';
import TouchableCustom from '@helpers/touchable_custom';
import DropDownPicker from 'react-native-dropdown-picker';

export default class Reviews extends Component {
  static contextType = DentalkartContext;
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      loading: true,
      isBought: null,
      star: 0,
      reviewTitle: '',
      reviewDescription: '',
      currentProductId: this.props.navigation.getParam(
        'groupedProductData',
        'No-ID',
      )?.items?.[0]?.id,
      productId: this.props.navigation.getParam('productId', 'No-ID'),
      typeId: this.props.navigation.getParam('type_id', 'No-ID'),
      groupedProductData: this.props.navigation.getParam(
        'groupedProductData',
        'No-ID',
      ),
    };
  }

  setOpen = open => {
    this.setState({
      open,
    });
  };

  setValue = async callback => {
    // this.setState({orders: []});
    // this.fetchOrders(1);
    this.setState(state => ({
      currentProductId: callback(state.currentProductId),
    }));
    this.setState({
      star: 0,
      reviewTitle: '',
      reviewDescription: '',
    });
    setTimeout(() => this.checkProductBought(), 100);
  };

  checkProductBought = async () => {
    try {
      this.setState({loading: true});
      const {data} = await client.query({
        query: CHECK_PRODUCT_BOUGHT_QUERY,
        variables: {
          id:
            this.state.typeId === 'grouped'
              ? this.state.currentProductId
              : this.state.productId,
        },
        fetchPolicy: 'network-only',
      });
      const isBought = data?.checkCustomerBoughtProduct;
      this.setState({
        isBought: isBought,
      });
      this.setState({loading: false});
    } catch (e) {
      this.setState({loading: false});
    }
  };

  async submitReview(submitReview) {
    const {userInfo} = this.context;
    const {reviewDescription, reviewTitle, star} = this.state;
    const productId = this.props.navigation.getParam('productId', 'No-ID');

    const validateErrors = this.checkErrors();
    if (validateErrors) {
      // const data = await client.readQuery({query: CUSTOMER_INFO_QUERY});
      // console.log('ggggg=g=g==gg=g==3', data);
      // const {customer} = data;
      const variables = {
        product_id:
          this.state.typeId === 'grouped'
            ? parseInt(this.state.currentProductId)
            : parseInt(this.state.productId),
        nickname:
          userInfo?.getCustomer?.firstname +
          ' ' +
          userInfo?.getCustomer?.lastname,
        title: reviewTitle,
        details: reviewDescription,
        rating: parseInt(star),
      };

      this.setState({loading: true});
      try {
        await client.mutate({
          mutation: SUBMIT_REVIEW_QUERY,
          variables: variables,
          onError: error => {
            showErrorMessage(`${error.message}. Please try again.`, 'top');
          },
        });
      } catch (error) {
        this.setState({loading: false});
        showErrorMessage(`${error.message}. Please try again.`, 'top');
      }

      this.setState({loading: false});
      AnalyticsEvents('PRODUCT_RATED', 'Product Rated', variables);
      showSuccessMessage(
        'Thank you so much. Review has been accepted for moderation.',
        'top',
      );
      this.props.navigation.goBack();
    }
  }
  checkErrors() {
    const {reviewDescription, reviewTitle, star} = this.state;
    if (star <= 0) {
      this.setState({ratingError: true});
      showErrorMessage(
        'You must provide your rating to rate this product',
        'top',
      );
      return false;
    }
    if (!reviewTitle) {
      this.setState({titleError: 'This is a required field.'});
      showErrorMessage('Title is a required field.', 'top');
      return false;
    }
    if (!reviewDescription) {
      this.setState({descriptionError: 'This is a required field.'});
      showErrorMessage('Description is a required field.', 'top');
      return false;
    }
    return true;
  }
  triggerScreenEvent = _ => {
    const {userInfo} = this.context;
    fireAnalyticsEvent({
      eventname: 'screenname',
      screenName: 'Write Review',
      userId: userInfo && userInfo.getCustomer ? userInfo.getCustomer.id : '',
    });
  };
  componentDidMount() {
    this.checkProductBought();
    this.triggerScreenEvent();
  }
  render() {
    const {navigation} = this.props;
    const productId = navigation.getParam('productId', 'No-ID');

    return (
      <View>
        <HeaderComponent
          navigation={this.props.navigation}
          label={'Review Product'}
          style={{height: 40}}
        />
        {this.state.typeId === 'grouped' ? (
          <View style={{paddingBottom: 16, zIndex: 2}}>
            <Text
              allowFontScaling={false}
              style={[
                styles.ratingHeadingText,
                {paddingLeft: 12, paddingVertical: 0},
              ]}>
              Select product
            </Text>
            <DropDownPicker
              style={[pageStyles.dropDownStyle]}
              dropDownContainerStyle={pageStyles.dropDownContainer}
              containerStyle={[pageStyles.containerStyle]}
              textStyle={pageStyles.dropdownText}
              open={this.state.open}
              value={this.state.currentProductId}
              items={this.state?.groupedProductData?.items?.map(e => {
                return {label: e.name, value: e.id};
              })}
              setOpen={this.setOpen}
              setValue={this.setValue}
            />
          </View>
        ) : null}

        {this.state.loading ? (
          <ActivityIndicator size="large" color="#343434" />
        ) : this.state?.isBought ? (
          <View>
            <View style={styles.ratingHeadingContainer}>
              <Text allowFontScaling={false} style={styles.ratingHeadingText}>
                Rate the product
              </Text>
              <Text allowFontScaling={false} style={styles.ratingQuestion}>
                How did you find this product based on your usage?
              </Text>
            </View>
            <StarRating _this={this} />
            {/* <ReviewFields _this={this} /> */}
            <KeyboardAvoidingView
              behaviour="padding"
              style={styles.reviewFieldsWrapper}>
              {/* <TextField
                label="Title"
                tintColor={SecondaryColor}
                labelHeight={15}
                value={this.state.reviewTitle}
                onChangeText={title => this.setState({reviewTitle: title})}
                keyboardType="default"
                autoCorrect={false}
                returnKeyType="next"
                fontSize={12}
                maxlength={50}
              /> */}
              <TextInput
                value={this.state.reviewTitle}
                onChangeText={title => this.setState({reviewTitle: title})}
                keyboardType="default"
                tintColor={SecondaryColor}
                autoCorrect={false}
                returnKeyType="next"
                fontSize={12}
                maxLength={50}
                multiline={true}
                editable={true}
                placeholder="Write your title here..."
                underlineColorAndroid={SecondaryColor}
                style={{
                  textAlignVertical: 'top',
                  marginBottom: Platform.OS === 'ios' ? 20 : null,
                }}
              />
              <TextInput
                value={this.state.reviewDescription}
                onChangeText={description =>
                  this.setState({reviewDescription: description})
                }
                keyboardType="default"
                autoCorrect={false}
                fontSize={12}
                multiline={true}
                numberOfLines={10}
                editable={true}
                placeholder="Write your description here..."
                underlineColorAndroid={SecondaryColor}
                style={{
                  textAlignVertical: 'top',
                  marginBottom: Platform.OS === 'ios' ? 20 : null,
                }}
              />
              <TouchableCustom
                underlayColor={'#ffffff10'}
                onPress={() => this.submitReview()}>
                <View style={styles.submitReviewButton}>
                  <Text
                    allowFontScaling={false}
                    style={styles.submitReviewButtonText}>
                    Submit
                  </Text>
                </View>
              </TouchableCustom>
            </KeyboardAvoidingView>
          </View>
        ) : (
          <NoAccessAddReview _this={this} />
        )}
      </View>
    );
  }
}

const NoAccessAddReview = ({_this}) => {
  return (
    <View style={styles.notAllowedRatingContainer}>
      <Image
        resizeMethod={'resize'}
        source={{
          uri: 'https://s3.ap-south-1.amazonaws.com/dentalkart-media/App/Not-Allowed-Review-image-.png',
        }}
        style={styles.notAllowedImage}
      />
      <Text allowFontScaling={false} style={styles.notAllowedHeading}>
        Haven't purchased this product?
      </Text>
      <Text allowFontScaling={false} style={styles.notAllowedText}>
        Sorry! You are not allowed to review this product since you haven't
        bought it on Dentalkart.
      </Text>
      <TouchableCustom
        underlayColor={'#ffffff10'}
        onPress={() => _this.props.navigation.navigate('Home')}>
        <View style={styles.continueShoppingButton}>
          <Text
            allowFontScaling={false}
            style={styles.continueShoppingButtonText}>
            Continue Shopping
          </Text>
        </View>
      </TouchableCustom>
    </View>
  );
};

const StarRating = ({_this}) => {
  return (
    <View style={styles.starRatingContainer}>
      <TouchableOpacity
        style={styles.starRating}
        onPress={() => _this.setState({star: 1})}>
        <Icon
          name="star"
          size={30}
          color={_this.state.star < 1 ? '#ddd' : '#0ecc2a'}
        />
        <Text allowFontScaling={false}>Horrible</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.starRating}
        onPress={() => _this.setState({star: 2})}>
        <Icon
          name="star"
          size={30}
          color={_this.state.star < 2 ? '#ddd' : '#0ecc2a'}
        />
        <Text allowFontScaling={false}>Bad</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.starRating}
        onPress={() => _this.setState({star: 3})}>
        <Icon
          name="star"
          size={30}
          color={_this.state.star < 3 ? '#ddd' : '#0ecc2a'}
        />
        <Text allowFontScaling={false}>Average</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.starRating}
        onPress={() => _this.setState({star: 4})}>
        <Icon
          name="star"
          size={30}
          color={_this.state.star < 4 ? '#ddd' : '#0ecc2a'}
        />
        <Text allowFontScaling={false}>Good</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.starRating}
        onPress={() => _this.setState({star: 5})}>
        <Icon
          name="star"
          size={30}
          color={_this.state.star < 5 ? '#ddd' : '#0ecc2a'}
        />
        <Text allowFontScaling={false}>Excellent</Text>
      </TouchableOpacity>
    </View>
  );
};

const ReviewFields = ({_this}) => {
  return (
    <KeyboardAvoidingView
      behaviour="padding"
      style={styles.reviewFieldsWrapper}>
      <TextField
        label="Title"
        tintColor={SecondaryColor}
        labelHeight={15}
        value={_this.state.reviewTitle}
        onChangeText={title => _this.setState({reviewTitle: title})}
        keyboardType="default"
        autoCorrect={false}
        returnKeyType="next"
        fontSize={12}
        maxlength={50}
      />
      <TextInput
        value={_this.state.reviewDescription}
        onChangeText={description =>
          _this.setState({reviewDescription: description})
        }
        keyboardType="default"
        autoCorrect={false}
        fontSize={12}
        multiline={true}
        numberOfLines={10}
        editable={true}
        placeholder="Write your description here..."
        underlineColorAndroid={SecondaryColor}
        style={{
          textAlignVertical: 'top',
          marginBottom: Platform.OS === 'ios' ? 20 : null,
        }}
      />
      <TouchableCustom
        underlayColor={'#ffffff10'}
        onPress={() => _this.submitReview()}>
        <View style={styles.submitReviewButton}>
          <Text allowFontScaling={false} style={styles.submitReviewButtonText}>
            Submit
          </Text>
        </View>
      </TouchableCustom>
    </KeyboardAvoidingView>
  );
};

const pageStyles = StyleSheet.create({
  dropdownText: {
    fontWeight: '500',
    fontSize: wp('4%'),
    color: '#25303C',
  },
  containerStyle: {
    width: wp('95%'),
    alignSelf: 'center',
    marginTop: hp('2%'),
    minHeight: hp('5%'),
  },
  dropDownContainer: {
    backgroundColor: '#FFF',
    borderColor: '#CCCCCC',
  },
  dropDownStyle: {
    height: hp('5%'),
    borderWidth: 1,
    borderColor: '#CCCCCC',
    width: wp('95%'),
  },
});
