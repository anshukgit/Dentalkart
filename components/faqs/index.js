import React, {useState} from 'react';
import {StyleSheet, TouchableOpacity, View, Text, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import moment from 'moment';

const Faqs = ({items, _this, loginStatus, isDateShow}) => {
  const [showMore, setShowMore] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [disLike, setDisLike] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);

  const disLikeCLick = () => {
    setIsDisabled(true);
    setTimeout(() => {
      setIsDisabled(false);
    }, 800);

    if (disLike === 0) {
      setDisLike(disLike + 1);
      let data = {
        likes: likeCount === 1 ? items?.like - 1 : items?.like,
        dislikes: items?.dislike + 1,
        questionId: items?._id,
      };
      _this.editQuestionsAnswer(data);
    } else {
      setDisLike(disLike - 1);
      let data = {
        likes: items?.like,
        dislikes: items?.dislike - 1,
        questionId: items?._id,
      };
      _this.editQuestionsAnswer(data);
    }
    setLikeCount(0);
  };

  const LikeCLick = () => {
    setIsDisabled(true);
    setTimeout(() => {
      setIsDisabled(false);
    }, 800);

    if (likeCount === 0) {
      setLikeCount(likeCount + 1);
      let data = {
        likes: items?.like + 1,
        dislikes: disLike === 1 ? items?.dislike - 1 : items?.dislike,
        questionId: items?._id,
      };
      _this.editQuestionsAnswer(data);
    } else {
      setLikeCount(likeCount - 1);
      let data = {
        likes: items?.like - 1,
        dislikes: items?.dislike,
        questionId: items?._id,
      };
      _this.editQuestionsAnswer(data);
    }
    setDisLike(0);
  };
  return (
    <View style={styles.questionAndAnswer}>
      <View style={styles.questionTextView}>
        <Text style={styles.questionAndAnswerText}>Question : </Text>
        <Text style={styles.questionAndAnswerText}>{items?.question}</Text>
      </View>

      <View style={styles.answerText}>
        <Text style={styles.questionAndAnswerText}>Answer {'  '} :</Text>
        <Text style={styles.questionAndAnswerSubText}>
          {/* {showMore
            ? items?.answer?.value
            : items?.answer?.value.slice(0, 60) + '... '} */}
          {/* <Text
            onPress={() => setShowMore(!showMore)}
            style={styles.readMoreText}>
            {showMore ? ' Read less' : 'Read more'}
          </Text> */}

          {showMore
            ? items?.answer?.value
            : items?.answer?.value.length > 60
            ? items?.answer?.value.slice(0, 60) + '... '
            : items?.answer?.value}

          {items?.answer?.value.length > 60 && (
            <Text
              onPress={() => setShowMore(!showMore)}
              style={styles.readMoreText}>
              {showMore ? ' Read less' : 'Read more'}
            </Text>
          )}
        </Text>
      </View>

      {/* {isDateShow ? ( */}
      {/* <Text>{items?.created_at.slice(0, 10)}</Text> */}
      {/* ) : null} */}

      <View style={styles.dateView}>
        {loginStatus ? (
          <View style={styles.likeDislikeView}>
            <View style={styles.likeView}>
              <TouchableOpacity
                disabled={isDisabled}
                style={styles.likeCountBtn}
                onPress={LikeCLick}>
                {likeCount === 0 ? (
                  <Image
                    style={styles.likeImage}
                    source={require('../../assets/like.png')}
                  />
                ) : (
                  <Image
                    style={styles.likeImage}
                    source={require('../../assets/liked.png')}
                  />
                )}
              </TouchableOpacity>
              <Text>{items?.like}</Text>
            </View>

            <View style={styles.disLikeView}>
              <TouchableOpacity
                disabled={isDisabled}
                style={styles.dislikeBtn}
                onPress={disLikeCLick}>
                {disLike === 0 ? (
                  <Image
                    style={styles.likeImagee}
                    source={require('../../assets/like.png')}
                  />
                ) : (
                  <Image
                    style={styles.likeImagee}
                    source={require('../../assets/liked.png')}
                  />
                )}
              </TouchableOpacity>
              <Text>{items?.dislike}</Text>
            </View>
          </View>
        ) : null}
        {/* <Text style={styles.dateText}>{items?.created_at.slice(0, 10)}</Text> */}
        <Text style={styles.dateText}>
          {moment(items?.created_at).format('DD-MM-YYYY')}
        </Text>
      </View>
    </View>
  );
};

export default Faqs;

const styles = StyleSheet.create({
  questionAndAnswer: {
    marginTop: hp(1),
    padding: wp(1),
    borderTopWidth: 0.5,
    width: '95%',
    alignSelf: 'center',
  },
  questionAndAnswerText: {
    fontWeight: '600',
    color: 'black',
    paddingBottom: hp(1),
  },
  questionAndAnswerSubText: {
    width: '90%',
    paddingHorizontal: 4,
    flexDirection: 'row',
  },
  answerText: {
    flexDirection: 'row',
    width: '90%',
  },
  readMoreText: {
    fontWeight: '500',
    color: 'black',
  },
  likeDislikeView: {
    flexDirection: 'row',
    marginTop: hp(1),
  },
  likeImage: {
    tintColor: 'grey',
  },
  likeImagee: {
    tintColor: 'grey',
    transform: [{rotate: '180deg'}],
  },
  dislikeBtn: {
    paddingRight: 5,
  },
  likeView: {
    flexDirection: 'row',
  },
  likeCountBtn: {
    paddingRight: 5,
  },
  disLikeView: {
    flexDirection: 'row',
    paddingLeft: wp(5),
  },
  questionTextView: {
    flexDirection: 'row',
    width: '80%',
  },
  dateView: {
    marginTop: hp(0.5),
    flexDirection: 'row',
    alignItems: 'flex-end',
    // justifyContent: 'space-between',
  },
  dateText: {
    marginLeft: 'auto',
  },
});
