import React, { useState, useEffect } from 'react';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import { View, Text, TouchableOpacity, StatusBar, Image, ActivityIndicator } from 'react-native';
import { FlatList, SafeAreaView, ScrollView } from 'react-navigation';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontistoIcon from 'react-native-vector-icons/Fontisto';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import { WebView } from 'react-native-webview';
import Modal from 'react-native-modal';
import { SAVED_NEWS, LIKE_NEWS, ADD_TO_NEWS_HISTORY } from '../graphql'
import { Query } from 'react-apollo';
import { newclient, client2 } from '@apolloClient';
import styles from '../news.style';
import HeaderComponent from "@components/HeaderComponent";
import Loader from '../../../components/loader';
import { NavigationEvents } from "react-navigation";

export default SavedNews = ({ navigation }) => {
    const [likedNewsId, setLikedNewsId] = useState([])
    const [showNews, setShowNews] = useState(false)
    const [showNewsLink, setShowNewsLink] = useState("")
    const [loadData, setLoadData] = useState(false)

    const navigateToNewsDetails = async (news) => {
        navigation.push('NewsDetails', { "data": news })
        await newclient.mutate({
            mutation: ADD_TO_NEWS_HISTORY,
            variables: { id: news.id },
        });
    }

    const openLink = (link) => {
        setShowNews(true)
        setShowNewsLink(link)
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#FFFFFF" }}>
            <StatusBar barStyle="default" />
            <HeaderComponent navigation={navigation} label={'Saved News'} isempty={true} style={{ height: 40 }} />
            <NavigationEvents
                onWillFocus={async () => {
                    setLoadData(true)
                }}
                onWillBlur={async () => {
                    setLoadData(false)
                }}
            />
            {
                loadData &&
                <ScrollView
                    style={{
                        flex: 1
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    <Query
                        query={SAVED_NEWS}
                        fetchPolicy="network-only"
                        client={newclient}
                    >
                        {({ loading, error, data }) => {
                            if (loading) {
                                return <View style={styles.loaderContainer}>
                                    <ActivityIndicator size={"small"} color={colors.blueColor} />
                                </View>
                            }
                            if (data && data?.savedNews?.length) {
                                return (
                                    data?.savedNews.map((news) => {
                                        return (
                                            <TouchableOpacity
                                                activeOpacity={0.5}
                                                onPress={() => navigateToNewsDetails(news)}
                                                style={[styles.cardContainer, styles.directionRow]}>
                                                <View style={styles.cardTitleContentContainer}>
                                                    <View>
                                                        <Text
                                                            numberOfLines={2}
                                                            style={styles.cardTitle}>{news.title}</Text>
                                                        <Text
                                                            numberOfLines={2}
                                                            style={styles.cardContent}>{news.content}</Text>
                                                        <Text
                                                            onPress={() => openLink(news.source_link)}
                                                            numberOfLines={1}
                                                            style={styles.cardLink}>{news.source_link}</Text>
                                                    </View>
                                                    <View style={{
                                                        flexDirection: "row",
                                                    }}>
                                                        <TouchableOpacity
                                                            activeOpacity={0.5}
                                                            onPress={async () => {
                                                                let a = await newclient.mutate({
                                                                    mutation: LIKE_NEWS,
                                                                    variables: { id: news.id },
                                                                });
                                                                setLikedNewsId([...likedNewsId, news.id])
                                                            }
                                                            }
                                                            style={styles.cardBottomIconContainer}>
                                                            {
                                                                likedNewsId.includes(news?.id) ?
                                                                    <AntDesignIcon name={"like1"} size={22} />
                                                                    :
                                                                    <AntDesignIcon name={"like2"} size={22} />
                                                            }
                                                            <Text style={styles.cardBottomIconText} >Like</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            activeOpacity={0.5}
                                                            onPress={() => null}
                                                            style={styles.cardBottomIconContainer}>
                                                            <Ionicons name={"share-social-outline"} size={22} />
                                                            {/* <Ionicons name={"share-social"} size={22} /> */}
                                                            <Text style={styles.cardBottomIconText} >Share</Text>
                                                        </TouchableOpacity>
                                                        <TouchableOpacity
                                                            activeOpacity={0.5}
                                                            onPress={null}
                                                            style={styles.cardBottomIconContainer}>
                                                            <FontistoIcon name={"bookmark-alt"} size={22} />
                                                            <Text style={styles.cardBottomIconText} >Save</Text>
                                                        </TouchableOpacity>
                                                    </View>
                                                </View>
                                                <View style={styles.cardRightImageContainer}>
                                                    <Image
                                                        style={styles.cardRightImageStyle}
                                                        source={{ uri: news.image }} />
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    })
                                );
                            }
                            return null
                        }}
                    </Query>
                    <Modal
                        animationIn="slideInRight"
                        animationOut="slideOutRight"
                        deviceWidth={1}
                        deviceHeight={1}
                        isVisible={showNews}
                    >
                        <SafeAreaView style={{ flex: 1 }}>
                            <View style={styles.container}>
                                <TouchableOpacity onPress={() => { setShowNews(false), setShowNewsLink(null) }} style={styles.header}>
                                    <Ionicons name="ios-close-circle-outline" size={25} />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1 }}>
                                <WebView
                                    source={{ uri: showNewsLink }}
                                    startInLoadingState={true}
                                />
                            </View>
                        </SafeAreaView>
                    </Modal>
                </ScrollView>
            }
        </SafeAreaView>
    )
}