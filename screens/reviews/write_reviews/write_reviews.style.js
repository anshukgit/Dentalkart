import {StyleSheet} from 'react-native';
import {SecondaryColor} from '@config/environment';

export default styles = StyleSheet.create({
  ratingHeadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  ratingHeadingText: {
    fontSize: 17,
    paddingVertical: 10,
    color: '#212121',
  },
  ratingQuestion: {
    fontSize: 13,
    color: '#212121',
  },
  notAllowedRatingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 16,
    zIndex: 1,
  },
  notAllowedImage: {
    width: 80,
    height: 80,
  },
  notAllowedHeading: {
    fontSize: 17,
    color: '#212121',
    padding: 5,
  },
  notAllowedText: {
    color: '#21212180',
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 15,
  },
  continueShoppingButton: {
    marginTop: 10,
    borderRadius: 5,
    borderColor: SecondaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  continueShoppingButtonText: {
    color: SecondaryColor,
    fontSize: 15,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  starRatingContainer: {
    flexDirection: 'row',
  },
  starRating: {
    flex: 1,
    alignItems: 'center',
  },
  reviewFieldsWrapper: {
    padding: 10,
  },
  submitReviewButton: {
    borderColor: SecondaryColor,
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 3,
    alignItems: 'center',
  },
  submitReviewButtonText: {
    color: SecondaryColor,
  },
});
