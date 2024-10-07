import React, {Component} from 'react';
import {View, Image, TouchableOpacity, Text, FlatList} from 'react-native';
import Carousel from 'react-native-snap-carousel';
import {DeviceWidth} from '@config/environment';
import styles from './product_images.style';
import getImageUrl from '@helpers/getImageUrl';
import sortByPosition from '@helpers/sort_by_position';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

export default class ProductImages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _this: props._this,
      image: props.image,
      gallery: props.gallery,
      activeImage: 0,
    };
  }
  changeActiveImage(index) {
    this.setState({activeImage: index});
  }
  render() {
    const {_this, image, gallery} = this.state;
    const activeEntries = gallery.filter(entry => !entry.disabled);
    let videoEntries = [];
    let imageEntries = [];
    activeEntries.map(item =>
      item.media_type === 'image'
        ? imageEntries.push(item)
        : videoEntries.push(item),
    );
    imageEntries = sortByPosition(imageEntries);
    // const firstImage = imageEntries.shift();
    // const sortedEntries = videoEntries.concat(imageEntries);
    // sortedEntries.unshift(firstImage);
    return (
      <View style={styles.imageContainer}>
        <View style={styles.bigimageWrapper}>
          <Carousel
            layout={'default'}
            ref={c => {
              this._carousel = c;
            }}
            data={imageEntries}
            inactiveSlideOpacity={0}
            firstItem={this.state.activeImage}
            renderItem={({item, index}) => (
              <View>
                <TouchableOpacity
                  onPress={() =>
                    this.props.onImagePress(this.state.activeImage)
                  }
                  activeOpacity={0.4}>
                  {this.props?.tags && this.props.tags.length
                    ? this.props?.tags.map((item, index) => {
                        let iconStyle =
                          item?.position === 0
                            ? styles.left
                            : item?.position === 1
                            ? styles.right
                            : item?.position === 2
                            ? styles.bottom
                            : null;
                        return (
                          <View
                            key={index}
                            style={[styles.iconContainer, iconStyle]}>
                            <Image
                              resizeMode="contain"
                              style={styles.iconImage}
                              resizeMethod={'resize'}
                              source={{uri: item?.image}}
                            />
                          </View>
                        );
                      })
                    : null}
                  <Image
                    resizeMethod={'resize'}
                    source={{
                      uri: getImageUrl(
                        imageEntries[this.state.activeImage].file,
                      ),
                    }}
                    style={styles.bigimage}
                  />
                </TouchableOpacity>
              </View>
            )}
            sliderWidth={DeviceWidth}
            itemWidth={DeviceWidth}
            onBeforeSnapToItem={index => this.changeActiveImage(index)}
          />
        </View>
        <View style={styles.thumbnailsWrapper}>
          <FlatList
            data={imageEntries}
            keyExtractor={(item, index) => index.toString()}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({item, index}) => (
              <TouchableOpacity
                style={[
                  styles.thumbnailContainer,
                  index === this.state.activeImage ? styles.activeImage : null,
                ]}
                onPress={() => this.changeActiveImage(index)}>
                <Image
                  resizeMethod={'resize'}
                  source={{uri: getImageUrl(item.file)}}
                  style={styles.thumbnail}
                />
              </TouchableOpacity>
            )}
            extraData={this.state}
          />
        </View>
      </View>
    );
  }
}
