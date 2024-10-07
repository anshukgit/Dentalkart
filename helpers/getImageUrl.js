import {productBaseUrl, productBaseUrlSlash} from '@config/environment';

const getImageUrl = image => {
  if (image) {
    if (image.charAt(0) === '/') {
      return `${productBaseUrl}${image}`;
    } else {
      return `${productBaseUrlSlash}${image}`;
    }
  } else {
    return 'https://s3.ap-south-1.amazonaws.com/dentalkart-media/React/Web+Icon+%26+Skeleton+Gif/Default-Product-Image-Place-Holder.png';
  }
};

export const getImageCDNURL = (image) => {
	return 'https://images.dentalkart.com/media/' + image;
}
export default getImageUrl;
