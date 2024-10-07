import {View, Text, StyleSheet, ScrollView} from 'react-native';
import React, {useEffect, useState} from 'react';
import {SafeAreaView} from 'react-navigation';
import HeaderComponent from '@components/HeaderComponent';
import {WEIGHT_SLAB_FOR_COUNTRIES} from '../../graphql';
import {client, newclient} from '@apolloClient';
import Loader from '@components/loader';
import SyncStorage from '@helpers/async_storage';

export default function DeliveryCharges(props) {
  const [showLoader, setShowLoader] = useState(true);
  const [weightData, setWeightData] = useState([]);
  useEffect(() => {
    getWeight();
  }, []);

  const getWeight = async () => {
    let shippingAddress = await SyncStorage.get('delivery_address');
    try {
      const {data} = await client.query({
        query: WEIGHT_SLAB_FOR_COUNTRIES,
        variables: {country_id: shippingAddress?.country_code || 'IN'},
        fetchPolicy: 'cache-first',
      });
      if (data) {
        setShowLoader(false);
        setWeightData(data?.WeightSlabsForCountries);
      }
      console.log('data', data);
    } catch (e) {
      setShowLoader(false);
      console.log('e', e);
    }
  };

  return (
    <SafeAreaView>
      <HeaderComponent
        navigation={props.navigation}
        label={'Weight Range'}
        style={{height: 40}}
        hideCart={true}
      />
      <Loader loading={showLoader} transparent={true} />
      <ScrollView>
        <View style={styles.noteContainer}>
          <Text style={styles.noteText}>
            Note! Overall shipping charge depends on the total items weight in
            the cart.
          </Text>
        </View>
        <View style={styles.headerRowContainer}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Weight-Range (in grams)</Text>
          </View>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Shipping Price</Text>
          </View>
        </View>
        {weightData && weightData?.length
          ? weightData.map((item, index) => (
              <View
                style={[
                  styles.headerRowContainer,
                  {backgroundColor: '#dddddd'},
                ]}>
                <View
                  style={[
                    styles.headerContainer,
                    {backgroundColor: index % 2 === 0 ? '#FFF' : '#e9e9e9'},
                  ]}>
                  <Text style={styles.bodyText}>{item?.weight_range}</Text>
                </View>
                <View
                  style={[
                    styles.headerContainer,
                    {backgroundColor: index % 2 === 0 ? '#FFF' : '#e9e9e9'},
                  ]}>
                  <Text style={styles.bodyText}>
                    {item?.currency}
                    {item?.price.toFixed(2)}
                  </Text>
                </View>
              </View>
            ))
          : null}
        <View style={{height: 100}} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  noteContainer: {
    marginHorizontal: 10,
    marginVertical: 20,
  },
  noteText: {
    textAlign: 'center',
    color: '#b95e5e',
  },
  headerRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  headerContainer: {
    flex: 0.499,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3933e',
    paddingVertical: 12,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#FFF',
  },
  bodyText: {
    fontSize: 14,
  },
});
