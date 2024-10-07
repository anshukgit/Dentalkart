// import React, { useEffect, useRef } from 'react';
// // We need to add the connectSearchBox to our import
// import { connectSearchBox } from 'react-instantsearch/connectors';
// // We need to add the TextInput to our import
// import { TextInput, View, TouchableOpacity, Text, FlatList, TouchableHighlight, Image, Platform } from 'react-native';
// import Icon from 'react-native-vector-icons/Ionicons';
// import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { SearchPageStyle } from './searchPageStyle';
// import ProductListingStyle from '@screens/category/modules/product_listing/product_listing.style';
// import Header from '@components/header';
// import HeaderComponent from "@components/HeaderComponent";

// function handlePress(item, _this) {
//     this.requestAnimationFrame(() => {
//         _this.setState({
//             isSearched: false,
//             productClicked: true,
//             productClickedId: item.objectID
//         });
//         if (Platform.OS === 'android')
//             _this.navigateToDetail(item);
//     });
// }

// export const SearchBox = connectSearchBox(({ _this, refine, currentRefinement }) => {
//     const { goBack } = _this.props.navigation;
//     const inputRef = useRef(null)

//     useEffect(() => {
//         inputRef.current.focus()
//     }, [])

//     return (
//         <View style={SearchPageStyle.searchBoxWrapper}>
//             <TouchableOpacity onPress={() => goBack()} style={SearchPageStyle.backIconWrapper}>
//                 <Icon name='md-arrow-back' size={23} color={'#000'} />
//             </TouchableOpacity>
//             <TextInput
//                 ref={inputRef}
//                 style={SearchPageStyle.inputField}
//                 onChangeText={text => refine(text)}
//                 value={currentRefinement}
//                 placeholder={'Search for products, brands...'}
//                 clearButtonMode={'always'}
//                 spellCheck={false}
//                 autoCorrect={false}
//                 autoCapitalize={'none'}
//                 autoFocus={true}
//                 underlineColorAndroid={'transparent'}
//                 selectionColor={'#000'}
//                 returnKeyType="search"
//             // onSubmitEditing={()=> _this.searchResult(currentRefinement)}
//             />
//         </View>
//     );
// });

// export const SearchPage = ({ hits, _this, currency = '' }) => {
//     return (
//         <View>
//             <HeaderComponent navigation={this.props.navigation} label={`Results for ${_this.state.searchTerm}`} style={{ height: 40 }} />
//             <FlatList
//                 data={hits}
//                 keyExtractor={(item, index) => item.objectID}
//                 style={{ marginBottom: 50 }}
//                 renderItem={({ item, index }) => {
//                     return (
//                         <View>
//                             <TouchableHighlight underlayColor={'#efefef50'} onPress={() => handlePress(item, _this)} style={ProductListingStyle.categoryProductWrapper}>
//                                 <View style={ProductListingStyle.categoryProduct}>
//                                     <View style={ProductListingStyle.productImageWrapper}>
//                                         <Image source={{ uri: 'https:' + item.thumbnail_url }} style={{ width: 80, height: 80 }} />
//                                         {(item.in_stock === 0) ? <Text allowFontScaling={false} style={ProductListingStyle.soldOut}>Sold Out</Text> : false}
//                                     </View>
//                                     <View style={ProductListingStyle.productDetailsWrapper}>
//                                         <Text allowFontScaling={false} style={ProductListingStyle.productItemName} numberOfLines={2}>{item.name}</Text>
//                                         {item.price[currency] ?
//                                             <View style={ProductListingStyle.productItemPriceWrapper}>
//                                                 <Text allowFontScaling={false} style={ProductListingStyle.productItemNewPrice}>{item.price[currency].default_formated}</Text>
//                                                 <Text allowFontScaling={false} style={ProductListingStyle.productItemOldPrice}>{item.price[currency].default_original_formated}</Text>
//                                             </View>
//                                             : null}
//                                         {(item.qtyLeft) ? <Text allowFontScaling={false} style={ProductListingStyle.qtyLeft}>Only {item.qtyLeft} left in stock.</Text> : false}
//                                     </View>
//                                 </View>
//                             </TouchableHighlight>
//                             {(item.in_stock !== 0) ?
//                                 <TouchableOpacity onPress={() => _this.addToCart(item)} underlayColor={'#ddd'} style={ProductListingStyle.categoryProductCart} hitSlop={{ top: 20, right: 20, bottom: 5, left: 20 }}>
//                                     <MIcon name='cart' style={ProductListingStyle.categoryProductIcon} />
//                                 </TouchableOpacity>
//                                 : false
//                             }
//                             <TouchableOpacity onPress={() => _this.addToWishList(item)} underlayColor={'#ddd'} style={ProductListingStyle.categoryProductWishlist} hitSlop={{ top: 5, right: 20, bottom: 20, left: 20 }}>
//                                 <MIcon name='heart' style={ProductListingStyle.categoryProductIcon} />
//                             </TouchableOpacity>
//                         </View>
//                     );
//                 }}
//             />
//         </View>
//     );
// }