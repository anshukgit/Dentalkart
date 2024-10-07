
import React, {Component} from 'react';
import {ScrollView, View, Text, TouchableOpacity, Image, Dimensions, TextInput,Platform, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard} from 'react-native';
import {DentalkartContext} from '@dentalkartContext';
import {client, newclient} from '@apolloClient';
import {Query} from 'react-apollo';
import GET_BRANDS from '../graphql/get_brand.gql.js';
import styles from './style.js';
import AnalyticsEvents from "../../../components/Analytics/AnalyticsEvents";
class BrandList extends Component{
    constructor(props){
        super(props);
        this.state={
            brandslist: props.value,
            searchKey:'',
            arraylength: props.value.length,
            letterWiseList: '',
            activeKey:''
        };
    }

    componentDidMount(){
        AnalyticsEvents("BRAN_PAGE_VIEWED", "Brand Page Viewed", {})
        this.generateLetterWiseList(this.state.brandslist);
    }

    generateLetterWiseList = (arr) => {
        const letterWiseList = {
            '#': [],
            'A': [],
            'B': [],
            'C': [],
            'D': [],
            'E': [],
            'F': [],
            'G': [],
            'H': [],
            'I': [],
            'J': [],
            'K': [],
            'L': [],
            'M': [],
            'N': [],
            'O': [],
            'P': [],
            'Q': [],
            'R': [],
            'S': [],
            'T': [],
            'U': [],
            'V': [],
            'W': [],
            'X': [],
            'Y': [],
            'Z': []
        };

        const sortedBrandList = arr.sort((a,b) => {
            if (a.name.toUpperCase() > b.name.toUpperCase()) return 1
            else  return -1
        });

        sortedBrandList.map(item => {
            const key = item.name.charAt(0).toUpperCase();
            if(letterWiseList.hasOwnProperty(key)) letterWiseList[key].push(item)
            else letterWiseList['#'].push(item)
            return null;
        })


        this.setState({
            letterWiseList,
        })
    }

    getSearchValues = (key) => {
        const {value} = this.props;
        const filteredSearch = value.filter((item) => item.name.toLowerCase().includes(key.toLowerCase()));
        this.generateLetterWiseList(filteredSearch);
        const filterarraylength=filteredSearch.length;
        this.setState({
            brandslist:filteredSearch,
            arraylength:filterarraylength
        })
    }

    handlesearch(value){
        this.setState({searchKey:value, activeKey:''});
        this.getSearchValues(value)
    }


    listContent = () => {
        const {letterWiseList, arraylength, searchKey} = this.state;
        return(
            <View style={styles.allListWarpper}>
                {arraylength > 0 ?
                    <View>
                        {Object.keys(letterWiseList).map(key =>
                            <View key={key}>
                                {letterWiseList[key].length > 0 &&
                                    <View style={{flexDirection:'row'}}>
                                        <View style={styles.KeyWrapper}>
                                            <Text allowFontScaling={false} style={styles.keyText}>{key}</Text>
                                        </View>
                                        <View style={styles.brandContainer}>
                                            {letterWiseList[key].map((value, index) =>
                                                value.is_active &&
                                                    <TouchableOpacity key={index.toString()} style={styles.brandImageWrapper} activeOpacity={0.4} onPress={() => this.props.navigation.navigate('UrlResolver', { url_key: `/${value.url_path}.html`})}>
                                                        <View  style={styles.brandImageBox}>
                                                            <Image
                                                                source={{
                                                                  uri: value.logo ? `${value.logo}` : 'https://s3.ap-south-1.amazonaws.com/dentalkart-media/React/Web+Icon+%26+Skeleton+Gif/Default-Product-Image-Place-Holder.png'
                                                                }}
                                                                style={styles.brandImage}
                                                            >
                                                          </Image>
                                                        </View>
                                                        <Text allowFontScaling={false} style={styles.brandText}>{value.name}</Text>
                                                    </TouchableOpacity>

                                            )}
                                        </View>
                                    </View>
                                }

                            </View>
                        )}
                    </View>:
                    <Text allowFontScaling={false}>No Brands found for the keywords</Text>
                }
            </View>
        )
    }


    render(){
        const {searchKey, arraylength, letterWiseList} = this.state;
        return(
            <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : "height"}

            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View>
                        <View style={styles.brandListTopWrapper}>
                            <Text allowFontScaling={false} style={styles.brandTopText}>All Brands Catalogue</Text>
                            <TextInput
                                onFocus={this.props.scrollIntoView}
                                style={styles.inputStyle}
                                onChangeText={(value)=>this.handlesearch(value)}
                                value={searchKey}
                                underlineColorAndroid={'transparent'}
                                selectTextOnFocus={true}
                                placeholder={'"Search for your favourite brands."'}
                            />
                        </View>
                        {this.listContent()}
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        )
    }
}

class AllBrands extends Component{

    render(){
        return (
            <View style={styles.BrandWrapper}>
                <Query
                    query={GET_BRANDS}
                    fetchPolicy="cache-and-network"
                    client={newclient} 
                    >
                    {({data,loading,error})=>{
                        if(data && data.getBrand){
                            return(
                                <BrandList value= {data.getBrand} navigation={this.props.navigation} scrollIntoView={this.props.scrollIntoView}/>
                            )
                        }
                        else if (error) {return <Text allowFontScaling={false}>{JSON.stringify(error)}</Text> }
                            else if (loading) {return <Text allowFontScaling={false}> Loading...</Text>}
                                else return null
                    }}
                </Query>
            </View>
        )
    }
}

export default AllBrands;
