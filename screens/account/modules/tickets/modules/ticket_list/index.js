import React, {Component, Fragment} from 'react';
import {
  View,
  Text,
  FlatList,
  InteractionManager,
  Modal,
  Platform,
  Alert,
  ToastAndroid,
  Keyboard,
} from 'react-native';
import {FETCH_TICKETS} from '../../graphql';
import {Query} from 'react-apollo';
import Header from '@components/header';
import {TicketCard, NoTickets, CreateTicketForm} from './modules/ticket_card';
import AddBottomButton from './modules/add_bottom_button';
import Loader from '@components/loader';
import {DentalkartContext} from '@dentalkartContext';
import {fireAnalyticsEvent} from '@helpers/firebase_analytics';
import {showErrorMessage} from '../../../../../../helpers/show_messages';
import HeaderComponent from '@components/HeaderComponent';

class TicketList extends Component {
  static contextType = DentalkartContext;
  constructor(props) {
    super(props);
    this.state = {
      isCreateNewTicketModal: false,
      subject: '',
      message: '',
      sendNewTicket: false,
      attachments: [],
    };
  }
  submitForm(createTicket) {
    const {message, subject, attachments} = this.state;
    InteractionManager.runAfterInteractions(() => {
      const variables = {
        attachments: attachments.map(image => image.uri),
        message: message,
        subject,
      };
      if (message && subject) {
        Keyboard.dismiss();
        createTicket({
          variables: variables,
          update: (store, {data: {submitticket}}) => {
            const data = store.readQuery({query: FETCH_TICKETS});
            data.fetchtickets.unshift(submitticket);
            store.writeQuery({query: FETCH_TICKETS, data: data.fetchtickets});
            this.setState({isCreateNewTicketModal: false, sendNewTicket: true});
          },
        });
      } else {
        Platform.OS === 'ios'
          ? Alert.alert('Subject and Issue are mandatory fields.')
          : showErrorMessage('Subject and Issue are mandatory fields.');
      }
    });
  }
  onAddButtonClick() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        attachments: [],
        message: '',
        subject: '',
        isCreateNewTicketModal: true,
      });
    });
  }
  onTicketCardPress(item) {
    InteractionManager.runAfterInteractions(() => {
      this.props.navigation.navigate('TicketDetails', {item});
    });
  }
  triggerScreenEvent = _ => {
    const {userInfo} = this.context;
    fireAnalyticsEvent({
      eventname: 'screenname',
      screenName: 'Ticket List',
      userId: userInfo && userInfo.getCustomer ? userInfo.getCustomer.id : '',
    });
  };
  componentDidMount() {
    this.triggerScreenEvent();
  }
  render() {
    return (
      <View style={{flex: 1}}>
        <HeaderComponent
          navigation={this.props.navigation}
          label={'My Tickets'}
          style={{height: 40}}
        />
        <Query query={FETCH_TICKETS} fetchPolicy="cache-and-network">
          {({loading, error, data}) => {
            if (loading) {
              return <Loader loading={true} transparent={true} />;
            }
            if (error) {
              return showErrorMessage(`${error.message}. Please try again.`);
            }
            if (data.fetchtickets) {
              const {fetchtickets} = data;
              return (
                <Fragment>
                  <FlatList
                    data={data.fetchtickets}
                    renderItem={({item, index}) => (
                      <TicketCard
                        item={item}
                        onPress={() => this.onTicketCardPress(item)}
                        index={index}
                      />
                    )}
                    keyExtractor={(item, index) => item.code}
                    ListEmptyComponent={<NoTickets />}
                  />
                  <Modal
                    visible={this.state.isCreateNewTicketModal}
                    transparent={false}
                    animationType="slide"
                    onRequestClose={() =>
                      this.setState({isCreateNewTicketModal: false})
                    }>
                    <CreateTicketForm instance={this} />
                  </Modal>
                  {/*<AddBottomButton onPress={()=> this.onAddButtonClick()}/>*/}
                </Fragment>
              );
            }
          }}
        </Query>
      </View>
    );
  }
}

export default TicketList;
