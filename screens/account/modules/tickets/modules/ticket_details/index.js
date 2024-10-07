import React, {Component} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  FlatList,
  ActivityIndicator,
  InteractionManager,
  Image,
  Platform,
  Keyboard,
  ToastAndroid,
  Alert,
} from 'react-native';
import {FETCH_TICKET_DETAILS, ADD_TICKET_MESSAGE} from '../../graphql';
import {Query, Mutation} from 'react-apollo';
import Header from '@components/header';
import {TicketsStyle} from '../../ticket_list_style';
import {AttachmentBlock} from '../attachments';
import Loader from '@components/loader';
import {fireAnalyticsEvent} from '@helpers/firebase_analytics';
import {DentalkartContext} from '@dentalkartContext';
import {
  showErrorMessage,
  showSuccessMessage,
} from '../../../../../../helpers/show_messages';
import HeaderComponent from '@components/HeaderComponent';

const TicketDetailsCard = ({instance}) => {
  const {params} = instance.props.navigation.state;
  return (
    <View
      style={[
        TicketsStyle.ticketCardWrapper,
        {marginTop: 10, marginHorizontal: 2},
      ]}>
      <Text allowFontScaling={false} style={TicketsStyle.ticketSubject}>
        {params.item.subject}
      </Text>
      <View style={TicketsStyle.ticketStatusWrapper}>
        <Text allowFontScaling={false} style={TicketsStyle.ticketDetail}>
          {params.item.created_at}
        </Text>
        <Text allowFontScaling={false} style={TicketsStyle.ticketStatus}>
          {params.item.status}
        </Text>
      </View>
    </View>
  );
};

const TicketSubmitForm = ({instance}) => {
  return (
    <View style={[TicketsStyle.ticketCardWrapper, {marginHorizontal: 2}]}>
      <TextInput
        style={TicketsStyle.inputTextArea}
        multiline={true}
        numberOfLines={6}
        value={instance.state.message}
        placeholder="Message"
        onChangeText={value => instance.setState({message: value})}
        underlineColorAndroid="transparent"
      />
      <AttachmentBlock instance={instance} />
      <Mutation mutation={ADD_TICKET_MESSAGE}>
        {(addTicketMessage, {loading, error, data}) => (
          <TouchableCustom
            onPress={() => instance.submitForm(addTicketMessage)}
            underlayColor="#ffffff10"
            disabled={loading}>
            <View style={TicketsStyle.sendButton}>
              <Text
                allowFontScaling={false}
                style={TicketsStyle.sendButtonText}>
                {loading ? 'Sending... ' : 'Send'}
              </Text>
              {loading ? (
                <ActivityIndicator
                  size="small"
                  color="#ffffff"
                  animating={loading}
                  hidesWhenStopped={true}
                />
              ) : null}
            </View>
          </TouchableCustom>
        )}
      </Mutation>
    </View>
  );
};

const Conversation = ({instance, data}) => {
  return (
    <View style={{marginHorizontal: 2}}>
      <FlatList
        data={data}
        renderItem={({item, index}) => <MessageBox data={item} />}
        keyExtractor={(item, index) => index.toString()}
        style={TicketsStyle.ticketCardWrapper}
      />
    </View>
  );
};

const MessageBox = ({data}) => {
  return (
    <View>
      <Text allowFontScaling={false} style={TicketsStyle.customerName}>
        {data.userame}
      </Text>
      <Text allowFontScaling={false} style={TicketsStyle.messageDate}>
        {data.created_at}
      </Text>
      <View
        style={[
          TicketsStyle.messageWrapper,
          {
            backgroundColor:
              (data.username === 'Dentalkart Support Team') == 1
                ? '#f3f3f3'
                : '#f1f9ff',
          },
        ]}>
        <Text allowFontScaling={false} style={TicketsStyle.messageText}>
          {data.body}
        </Text>
        <FlatList
          data={data.attachments}
          renderItem={({item, index}) => <MessageAttachments item={item} />}
          keyExtractor={(item, index) => index.toString()}
          numColumns={Platform.OS === 'ios' ? 2 : 3}
        />
      </View>
    </View>
  );
};

const MessageAttachments = ({item}) => {
  return (
    <View style={TicketsStyle.attachedImageWrapper}>
      <Image source={{uri: item}} style={TicketsStyle.attachedImage} />
    </View>
  );
};

class TicketDetail extends Component {
  static contextType = DentalkartContext;
  constructor(props) {
    super(props);
    const {item} = props.navigation.state.params;
    this.state = {
      attachments: [],
      sendMessage: false,
      message: '',
      ticketId: item.code,
      newTicketMessage: '',
    };
  }
  submitForm(addTicketMessage) {
    const {ticketId, message, attachments} = this.state;
    const variables = {
      id: ticketId.toString(),
      message: message,
      attachments: attachments,
    };
    InteractionManager.runAfterInteractions(() => {
      if (message) {
        Keyboard.dismiss();
        addTicketMessage({
          variables: variables,
          update: (store, {data: {addmessage}}) => {
            const data = store.readQuery({
              query: FETCH_TICKET_DETAILS,
              variables: {id: ticketId},
            });
            data.fetchticketdetail.messages.unshift(addmessage);
            store.writeQuery({
              query: FETCH_TICKET_DETAILS,
              variables: {id: ticketId},
              data: data.fetchticketdetail,
            });
            Platform.OS === 'ios'
              ? Alert.alert('Ticket Updated Successfully')
              : showSuccessMessage('Ticket Updated Successfully');
          },
        });
      } else {
        Platform.OS === 'ios'
          ? Alert.alert('Please enter message.')
          : showErrorMessage('Please enter message.');
      }
    });
  }
  triggerScreenEvent = _ => {
    const {userInfo} = this.context;
    fireAnalyticsEvent({
      eventname: 'screenname',
      screenName: 'Ticket Detail',
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
          label={`Ticket Id: ${this.props.navigation.state.params.item.code}`}
          navigation={this.props.navigation}
          style={{height: 40}}
        />
        <Query
          query={FETCH_TICKET_DETAILS}
          variables={{id: this.props.navigation.state.params.item.code}}
          fetchPolicy="cache-and-network">
          {({loading, error, data}) => {
            if (loading) {
              return <Loader loading={true} transparent={true} />;
            }
            if (error) {
              return showErrorMessage(`${error.message}. Please try again.`);
            }
            if (data.fetchticketdetail) {
              const {fetchticketdetail} = data;
              return (
                <ScrollView
                  style={TicketsStyle.ticketCardContainer}
                  keyboardShouldPersistTaps={'always'}
                  keyboardDismissMode={
                    Platform.OS === 'ios' ? 'interactive' : 'none'
                  }>
                  <TicketDetailsCard instance={this} />
                  <TicketSubmitForm instance={this} />
                  {fetchticketdetail.messages.length > 0 && (
                    <Conversation
                      instance={this}
                      data={fetchticketdetail.messages}
                    />
                  )}
                </ScrollView>
              );
            }
          }}
        </Query>
      </View>
    );
  }
}

export default TicketDetail;
