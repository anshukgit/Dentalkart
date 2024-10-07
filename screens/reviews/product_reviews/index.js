import React, {Component} from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Modal,
  Image,
  ToastAndroid,
} from 'react-native';
import {Query} from 'react-apollo';
import {GET_PRODUCT_REVIEWS_QUERY} from './graphql';
import ProgressBarCustom from '@helpers/progress_bar_custom';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './product_reviews.style';
import TouchableCustom from '@helpers/touchable_custom';
import {fireAnalyticsEvent} from '@helpers/firebase_analytics';
import {DentalkartContext} from '@dentalkartContext';
import {newclient} from '@apolloClient';

const Ratings = ({data, _this}) => {
  let progress_5 =
      data.total_reviews > 0 ? data.count['4'] / data.total_reviews : 0,
    progress_4 =
      data.total_reviews > 0 ? data.count['3'] / data.total_reviews : 0,
    progress_3 =
      data.total_reviews > 0 ? data.count['2'] / data.total_reviews : 0,
    progress_2 =
      data.total_reviews > 0 ? data.count['1'] / data.total_reviews : 0,
    progress_1 =
      data.total_reviews > 0 ? data.count['0'] / data.total_reviews : 0;
  return (
    <View style={styles.dataAnalysisWrapper}>
      <View style={styles.ratingContainer}>
        <View style={styles.rightBorder}>
          <View style={styles.totalRatingWrapper}>
            <Text allowFontScaling={false} style={styles.reviewCount}>
              {data.avg_ratings}
            </Text>
            <Icon name="star" size={35} color="#212121" />
          </View>
          <Text allowFontScaling={false} style={styles.reviewCountText}>
            {data.total_reviews} ratings and
          </Text>
          <Text allowFontScaling={false} style={styles.reviewCountText}>
            {data.total_reviews} reviews
          </Text>
        </View>
        <View style={styles.ratingsDataContainer}>
          <View style={styles.ratingsWrapper}>
            <Text allowFontScaling={false} style={styles.ratingText}>
              5
            </Text>
            <Icon
              name="star"
              size={10}
              color="#212121"
              style={styles.ratingIcon}
            />
            <ProgressBarCustom
              styleAttr="Horizontal"
              indeterminate={false}
              progress={progress_5}
              progressTintColor="#0e9d58"
              color="#0ecc2a"
              style={styles.ratingProgress}
            />
          </View>
          <View style={styles.ratingsWrapper}>
            <Text allowFontScaling={false} style={styles.ratingText}>
              4
            </Text>
            <Icon
              name="star"
              size={10}
              color="#212121"
              style={styles.ratingIcon}
            />
            <ProgressBarCustom
              styleAttr="Horizontal"
              indeterminate={false}
              progress={progress_4}
              progressTintColor="#bfd047"
              color="#0ecc2a"
              style={styles.ratingProgress}
            />
          </View>
          <View style={styles.ratingsWrapper}>
            <Text allowFontScaling={false} style={styles.ratingText}>
              3
            </Text>
            <Icon
              name="star"
              size={10}
              color="#212121"
              style={styles.ratingIcon}
            />
            <ProgressBarCustom
              styleAttr="Horizontal"
              indeterminate={false}
              progress={progress_3}
              progressTintColor="#ffc105"
              color="#0ecc2a"
              style={styles.ratingProgress}
            />
          </View>
          <View style={styles.ratingsWrapper}>
            <Text allowFontScaling={false} style={styles.ratingText}>
              2
            </Text>
            <Icon
              name="star"
              size={10}
              color="#212121"
              style={styles.ratingIcon}
            />
            <ProgressBarCustom
              styleAttr="Horizontal"
              indeterminate={false}
              progress={progress_2}
              progressTintColor="#ef7e14"
              color="#fca728"
              style={styles.ratingProgress}
            />
          </View>
          <View style={styles.ratingsWrapper}>
            <Text allowFontScaling={false} style={styles.ratingText}>
              1
            </Text>
            <Icon
              name="star"
              size={10}
              color="#212121"
              style={styles.ratingIcon}
            />
            <ProgressBarCustom
              styleAttr="Horizontal"
              indeterminate={false}
              progress={progress_1}
              progressTintColor="#d36259"
              color="#fc4b28"
              style={styles.ratingProgress}
            />
          </View>
        </View>
      </View>
      <TouchableCustom
        underlayColor={'#ffffff10'}
        onPress={() => _this.canAddReview()}>
        <View style={styles.addReviewButton}>
          <Text allowFontScaling={false} style={styles.addReviewText}>
            RATE AND WRITE A REVIEW
          </Text>
        </View>
      </TouchableCustom>
    </View>
  );
};

const renderReview = item => {
  return (
    <View style={styles.reviewContainer}>
      <View style={styles.reviewHeadingWrapper}>
        <View style={styles.reviewRatingWrapper}>
          <Text allowFontScaling={false} style={styles.reviewRating}>
            {item.rating}
          </Text>
          <Icon name="star" size={10} color="#fff" style={styles.reviewIcon} />
        </View>
        <Text allowFontScaling={false} style={styles.reviewHeading}>
          {item.title}
        </Text>
      </View>
      <Text allowFontScaling={false} style={styles.reviewText}>
        {item.details}
      </Text>
      <Text allowFontScaling={false} style={styles.reviewCustomer}>
        {item.nickname} {item.created_at}
      </Text>
    </View>
  );
};
export default class ProductReviews extends Component {
  static contextType = DentalkartContext;
  triggerScreenEvent = _ => {
    const {userInfo} = this.context;
    fireAnalyticsEvent({
      eventname: 'screenname',
      screenName: `Product Reviews`,
      userId: userInfo && userInfo.getCustomer ? userInfo.getCustomer.id : '',
    });
  };
  componentDidMount() {
    this.triggerScreenEvent();
  }
  render() {
    const {_this, product} = this.props;
    return (
      <View>
        <Query
          query={GET_PRODUCT_REVIEWS_QUERY}
          variables={{id: product.id, type: product.type_id}}
          fetchPolicy="cache-and-network"
          client={newclient}>
          {({data, loading, error}) => {
            if (loading)
              return <ActivityIndicator size="large" color="#343434" />;
            if (error) return null;
            if (data.getProductReviews) {
              return (
                <View style={styles.container}>
                  <Text allowFontScaling={false} style={styles.reviewHeader}>
                    Ratings & Reviews
                  </Text>
                  <Ratings data={data.getProductReviews} _this={_this} />
                  <FlatList
                    data={data.getProductReviews.reviews}
                    renderItem={({item, index}) => renderReview(item)}
                    keyExtractor={(item, index) => index.toString()}
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
