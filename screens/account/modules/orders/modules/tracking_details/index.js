import React, {Component} from 'react';
import {Text, View, FlatList} from 'react-native';
import Header from '@components/header';
import {Query} from 'react-apollo';
import {TRACK_SHIPMENT_QUERY} from '../../graphql';
import styles from './tracking_details.style';
import Loader from '@components/loader';
import {showErrorMessage} from '../../../../../../helpers/show_messages';
import HeaderComponent from "@components/HeaderComponent";

export default class TrackingDetails extends Component {
  render() {
    const {navigation} = this.props;
    const params = navigation.getParam('params', 'NO-ID');
    return (
      <View>
        <HeaderComponent navigation={this.props.navigation} label={'Track Your Order'} style={{ height: 40 }} />
        <TrackOrder params={params} />
      </View>
    );
  }
}

const TrackOrder = ({params}) => {
  return (
    <View>
      <Query
        query={TRACK_SHIPMENT_QUERY}
        fetchPolicy="network-only"
        variables={{shipment_id: params.order_id}}>
        {({data, loading, error}) => {
          if (error) {
            return showErrorMessage(`${error.message}. Please try again.`);
          }
          if (data?.track) {
            if (data.track.response) {
              return (
                <View>
                  <Text allowFontScaling={false} style={styles.orderId}>
                    {params.order_id
                      ? `Order Id #${params.order_id}`
                      : params.shipment_id
                      ? `Shipment Id #${params.shipment_id}`
                      : ''}
                  </Text>
                  <View style={styles.container}>
                      {data.track.response.scan === null ?
                          <Text allowFontScaling={false} style={{padding:5}}>Tracking Information Not yet available.</Text> :
                          <FlatList
                            data={data.track.response.scan}
                            renderItem={({item, index}) =>
                              _renderItem(item, index, data.track.response.scan)
                            }
                            keyExtractor={(item, index) => index}
                          />
                      }
                  </View>
                </View>
              );
            } else {
              return <Text allowFontScaling={false}>Tracking Information Not yet available.</Text>;
            }
          } else {
            return <Loader loading={loading} transparent={true} />;
          }
        }}
      </Query>
    </View>
  );
};

const _renderItem = (item, index, data) => {
  return (
    <View style={styles.statusBlock}>
      <View style={styles.statusTimeWrapper}>
        <Text allowFontScaling={false} style={styles.statusTime}>{item.time}</Text>
        <Text allowFontScaling={false} style={styles.statusTime}>{item.location}</Text>
      </View>
      <View style={styles.pipeContainer}>
        <Text allowFontScaling={false}
          style={[
            styles.statusDot,
            item.time
              ? item.status_detail == 'Canceled'
                ? styles.canceled
                : styles.completed
              : null,
          ]}
        />
        {index < data.length - 1 ? (
          <Text allowFontScaling={false} style={[styles.pipe, item.time ? styles.completed : null]} />
        ) : null}
      </View>
      <Text allowFontScaling={false} style={styles.statusDetail}>{item.status_detail}</Text>
    </View>
  );
};
