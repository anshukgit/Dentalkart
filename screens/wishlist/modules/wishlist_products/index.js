import React, {Component} from 'react';
import {Text, View, TouchableHighlight, Image, TouchableOpacity, ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './wishlist_products.style';
import getImageUrl from '@helpers/getImageUrl';
import RemoveWishlistMutation from '../remove_wishlist_item';
import Loader from '@components/loader';


export default class WishlistProducts extends Component{
    render(){
        const {item, _this} = this.props;
        const getImageObj= item.product.media_gallery_entries.filter(data => data.types.length>0).find(data=>data.file)
        const imageUrl = getImageObj && getImageObj.file
        return(
            <View>
                <TouchableHighlight
                    onPress={()=> _this.navigateToDetail(item)}
                    underlayColor={'#ddd'}
                    style={styles.categoryProductWrapper}
                >
                    <View style={styles.categoryProduct}>
                        <View style={styles.productImageWrapper}>
                            <Image resizeMethod={"resize"} source={{uri:  getImageUrl(imageUrl)}} style={styles.categoryProductImage}/>
                            {item.product.stock_status !== "IN_STOCK" ? <Text allowFontScaling={false} style={styles.soldOut}>Sold Out</Text> : false}
                        </View>
                        <View style={styles.productDetailsWrapper}>
                            <Text allowFontScaling={false} style={styles.productItemName} numberOfLines={2}>{item.product.name}</Text>
                            {(item.product.average_rating && item.product.rating_count>0)?
                                <View style={styles.reviewsWrapper}>
                                    <View style={styles.ratingBoxWrapper}>
                                        <Text allowFontScaling={false} style={styles.ratingBox}>{parseFloat(item.product.average_rating).toFixed(1)}</Text>
                                        <MCIcon name='star' style={styles.star} />
                                    </View>
                                    <Text allowFontScaling={false} style={styles.reviewsQty}>({item.product.rating_count})</Text>
                                </View>
                                : false
                            }
                            <View style={styles.productItemPriceWrapper}>
                            {item.product.price.regularPrice.amount.value > 0 &&
                                <Text allowFontScaling={false} style={styles.productItemNewPrice}>{item.product.price.regularPrice.amount.currency}{item.product.price.regularPrice.amount.value || item.product.price.minimalPrice.amount.value }</Text> }
							{!item.product.price.regularPrice.amount.value &&
                                <Text allowFontScaling={false} style={styles.productItemNewPrice}>From: {item.product.price.regularPrice.amount.currency}{item.product.price.minimalPrice.amount.value}</Text>}
								{(item.product.discount)? <Text allowFontScaling={false} style={styles.productItemOldPrice}>{item.product.price}</Text> : false}
								{(item.product.discount)? <Text allowFontScaling={false} style={styles.productDiscount}>{item.product.discount}%</Text> : false}
							</View>
                        </View>
                    </View>
                </TouchableHighlight>
                {/*{(item.stock_status)?
                    <TouchableOpacity onPress={()=> _this.addToCart(item)} underlayColor={'#ddd'} style={styles.categoryProductCart} hitSlop={{top: 20, right: 10, bottom: 20, left: 20}}>
                        <Icon name='cart-plus' style={styles.categoryProductIcon}/>
                    </TouchableOpacity>
                    : false
                }*/}

                {/*<RemoveWishlistMutation itemId={item.id}>
                    {(removeItem, {data,loading,error})=>{
						return(
                            <TouchableOpacity onPress={()=> !loading && removeItem()} underlayColor={'#ddd'} style={styles.categoryProductWishlist} hitSlop={{top: 20, right: 10, bottom: 20, left: 20}}>
                                {!loading ? <Icon name='delete' style={styles.categoryProductIcon}/> : <Loader loading={true} transparent={true} />}
                            </TouchableOpacity>
						)}
				    }
                </RemoveWishlistMutation>
                */}
            </View>
        );
    }
}
