import React, {Component} from 'react';
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
} from 'react-native';
import {TicketsStyle} from '../../../ticket_list_style';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {AttachmentBlock} from '../../attachments';
import TouchableCustom from '@helpers/touchable_custom';
import AIcon from 'react-native-vector-icons/Ionicons';
import {Mutation} from 'react-apollo';
import {CREATE_TICKET} from '../../../graphql';

export class TicketCard extends Component {
  render() {
    const {item, onPress, index} = this.props;
    return (
      <View
        style={[
          TicketsStyle.ticketCardContainer,
          {paddingTop: index == 0 ? 10 : 0},
        ]}>
        <TouchableOpacity onPress={() => onPress()}>
          <View style={TicketsStyle.ticketCardWrapper}>
            <Text allowFontScaling={false} style={TicketsStyle.ticketDetail}>
              Ticket Id: {item.code}
            </Text>
            <Text allowFontScaling={false} style={TicketsStyle.ticketSubject}>
              {item.subject}
            </Text>
            <View style={TicketsStyle.ticketStatusWrapper}>
              <Text allowFontScaling={false} style={TicketsStyle.ticketDetail}>
                {item.created_at}
              </Text>
              <Text allowFontScaling={false} style={TicketsStyle.ticketStatus}>
                {item.status}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

export const NoTickets = () => {
  return (
    <View style={TicketsStyle.noTicketsContainer}>
      <Icon name="inbox" size={70} color="#28282880" />
      <Text allowFontScaling={false} style={TicketsStyle.noTicketsText}>
        Have an issue? We got you, tap on "+" icon to raise your querry.
      </Text>
    </View>
  );
};

export const CreateTicketForm = ({instance}) => {
  const {message, subject, sendNewTicket} = instance.state;
  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View>
        <View style={TicketsStyle.modalHeader}>
          <TouchableOpacity
            style={TicketsStyle.backIconWrapper}
            onPress={() => instance.setState({isCreateNewTicketModal: false})}
            hitSlop={{top: 20, right: 10, bottom: 20, left: 20}}>
            <AIcon name="md-arrow-back" size={23} color="#ffffff" />
          </TouchableOpacity>
          <Text allowFontScaling={false} style={TicketsStyle.headerHeading}>
            Create New Ticket
          </Text>
        </View>
        <ScrollView
          style={TicketsStyle.ticketCardContainer}
          keyboardShouldPersistTaps={'handled'}
          keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'none'}>
          <TextInput
            style={TicketsStyle.inputField}
            value={subject}
            onChangeText={value => instance.setState({subject: value})}
            placeholder="Subject"
            underlineColorAndroid="transparent"
          />
          <TextInput
            style={TicketsStyle.inputTextArea}
            multiline={true}
            numberOfLines={6}
            value={message}
            placeholder="Message ...."
            onChangeText={value => instance.setState({message: value})}
            underlineColorAndroid="transparent"
          />
          <AttachmentBlock instance={instance} />
          <Mutation mutation={CREATE_TICKET}>
            {(createTicket, {loading, error, data}) => (
              <TouchableCustom
                onPress={() => instance.submitForm(createTicket)}
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
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
};
