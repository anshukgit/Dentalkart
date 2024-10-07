import React, {Component} from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ToastAndroid,
  ScrollView,
  KeyboardAvoidingView,
  Linking,
  CheckBox,
  Button,
  TextField,
  Image,
} from 'react-native';
import RmaDetails from './RmaDetailsStyle';
import {Query, Mutation} from 'react-apollo';
import Icon from 'react-native-vector-icons/Ionicons';
import {AttachmentBlock} from '../tickets/modules/attachments';
import {GET_RETURN_ITEMS_QUERY} from './graphql';
import {ADD_RETURN_ATTACHMENTS} from './graphql';
import AddReturnComment from './modules/add_return_comment';
import {client} from '@apolloClient';
import Header from '@components/header';
import {NavigationActions} from 'react-navigation';
import Loader from '@components/loader';
import {fireAnalyticsEvent} from '@helpers/firebase_analytics';
import {DentalkartContext} from '@dentalkartContext';
import {
  showErrorMessage,
  showSuccessMessage,
} from '../../../../helpers/show_messages';
import HeaderComponent from '@components/HeaderComponent';

const ReturnTopDetails = ({returnDetail}) => {
  return (
    <View style={RmaDetails.cardWrapper}>
      <View style={RmaDetails.leftSection}>
        <View style={RmaDetails.contentContainer}>
          <Text allowFontScaling={false} style={RmaDetails.valueHeader}>
            Return id :
          </Text>
          <Text allowFontScaling={false} style={RmaDetails.valueText}>
            {returnDetail.return_id ? returnDetail.return_id : `-`}
          </Text>
        </View>
        <View style={RmaDetails.contentContainer}>
          <Text allowFontScaling={false} style={RmaDetails.valueHeader}>
            Order id :
          </Text>
          <Text allowFontScaling={false} style={RmaDetails.valueText}>
            {returnDetail.order_id ? returnDetail.order_id : `-`}
          </Text>
        </View>
        <View style={RmaDetails.contentContainer}>
          <Text allowFontScaling={false} style={RmaDetails.valueHeader}>
            Created at :
          </Text>
          <Text allowFontScaling={false} style={RmaDetails.valueText}>
            {returnDetail.created_at ? returnDetail.created_at : `-`}
          </Text>
        </View>
        <View style={RmaDetails.contentContainer}>
          <Text allowFontScaling={false} style={RmaDetails.valueHeader}>
            Status :
          </Text>
          <Text allowFontScaling={false} style={RmaDetails.valueText}>
            {returnDetail.status ? returnDetail.status : `-`}
          </Text>
        </View>
        <View style={RmaDetails.contentContainer}>
          <Text allowFontScaling={false} style={RmaDetails.valueHeader}>
            Shipment Status :
          </Text>
          <Text allowFontScaling={false} style={RmaDetails.valueText}>
            {returnDetail.shipment_status ? returnDetail.shipment_status : `-`}
          </Text>
        </View>
        <View style={RmaDetails.contentContainer}>
          <Text allowFontScaling={false} style={RmaDetails.valueHeader}>
            Shipment amount :
          </Text>
          <Text allowFontScaling={false} style={RmaDetails.valueText}>
            {returnDetail.shipping_amount ? returnDetail.shipping_amount : `-`}
          </Text>
        </View>
        <View style={RmaDetails.contentContainer}>
          <Text allowFontScaling={false} style={RmaDetails.valueHeader}>
            Total Repair Charge :
          </Text>
          <Text allowFontScaling={false} style={RmaDetails.valueText}>
            {returnDetail.total_repair_charge
              ? returnDetail.total_repair_charge
              : `-`}
          </Text>
        </View>
        <View style={RmaDetails.contentContainer}>
          <Text allowFontScaling={false} style={RmaDetails.valueHeader}>
            Description:{' '}
          </Text>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: 10,
              paddingLeft: 2,
              width: '90%',
              textAlignVertical: 'center',
              flex: 1,
            }}>
            {returnDetail.description ? returnDetail.description : `-`}
          </Text>
        </View>
      </View>
    </View>
  );
};

class ItemBody extends Component {
  constructor() {
    super();
    this.state = {
      attachments: [],
    };
  }
  getAttachmentsImages = images => {
    if (images) {
      this.setState({attachments: images, attachmentError: ''});
    }
  };
  postAddingAttachments = (cache, {data}) => {
    const {returnId} = this.props;
    try {
      client.writeQuery({
        query: GET_RETURN_ITEMS_QUERY,
        variables: {return_id: returnId},
        data: {Returns: data.AddReturnAttachments},
      });
      showSuccessMessage(`Attachment added successfully`);
    } catch (e) {
      console.log(e);
    }
  };
  render() {
    const {value, key, returnDetail} = this.props;
    const {attachments} = this.state;
    var baseImage = [];
    attachments.map(data => baseImage.push(data.uri));
    return (
      <View key={key}>
        <View style={{flexDirection: 'row'}}>
          <View style={RmaDetails.imageWrapper}>
            <Image
              style={RmaDetails.image}
              source={{
                uri: `https://www.dentalkart.com/media/catalog/product${value.thumbnail}`,
              }}
            />
          </View>
          <View>
            <Text
              allowFontScaling={false}
              style={RmaDetails.itemName}
              ellipsizeMode="tail"
              numberOfLines={3}>
              {value.name}
            </Text>
            <View style={RmaDetails.contentContainer}>
              <Text allowFontScaling={false} style={RmaDetails.valueHeader}>
                Quantity :
              </Text>
              <Text allowFontScaling={false}>{value.qty}</Text>
            </View>
            <View style={RmaDetails.contentContainer}>
              <Text allowFontScaling={false} style={RmaDetails.valueHeader}>
                Reason:
              </Text>
              <Text allowFontScaling={false}>
                {value.reason ? value.reason : `-`}
              </Text>
            </View>
            <View style={RmaDetails.contentContainer}>
              <Text allowFontScaling={false} style={RmaDetails.valueHeader}>
                Condition :
              </Text>
              <Text allowFontScaling={false}>
                {value.condition ? value.condition : '-'}
              </Text>
            </View>
            <View style={RmaDetails.contentContainer}>
              <Text allowFontScaling={false} style={RmaDetails.valueHeader}>
                Resolution :{' '}
              </Text>
              <Text allowFontScaling={false}>
                {value.exchange_type ? value.exchange_type : '-'}
              </Text>
            </View>
            <View style={RmaDetails.contentContainer}>
              <Text allowFontScaling={false} style={RmaDetails.valueHeader}>
                Repair Charge :
              </Text>
              <Text allowFontScaling={false}>
                {value.repair_charge ? value.repair_charge : '-'}
              </Text>
            </View>
            <View style={RmaDetails.contentContainer}>
              <Text allowFontScaling={false} style={RmaDetails.valueHeader}>
                status:
              </Text>
              <Text allowFontScaling={false}>
                {value.status ? value.status : `-`}
              </Text>
            </View>
          </View>
        </View>
        <View style={RmaDetails.contentContainer}>
          <Text allowFontScaling={false} style={RmaDetails.valueHeader}>
            Description:
          </Text>
          <Text
            allowFontScaling={false}
            style={{
              fontSize: 10,
              paddingLeft: 2,
              flex: 1,
              width: '90%',
              textAlignVertical: 'center',
            }}>
            {value.description ? value.description : `-`}
          </Text>
        </View>
        {value.attachments_data.length > 0 && (
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            <Text allowFontScaling={false}>Attachments: </Text>
            {value.attachments_data.map((data, index) => (
              <Text
                allowFontScaling={false}
                style={RmaDetails.attachmentsText}
                onPress={() => Linking.openURL(data.url)}>
                Attachment {index + 1},{' '}
              </Text>
            ))}
          </View>
        )}
        <View style={RmaDetails.attachButtons}>
          <AttachmentBlock instance={this} />
        </View>
        {attachments.length > 0 && (
          <Mutation
            mutation={ADD_RETURN_ATTACHMENTS}
            variables={{
              returnId: returnDetail.return_id,
              sku: value.sku,
              attachments: baseImage,
            }}
            update={this.postAddingAttachments}
            onError={error => console.log(error)}>
            {(upload, {data, loading, error}) => {
              if (error) return <Text allowFontScaling={false}>error</Text>;
              if (loading) return <Loader loading={true} transparent={true} />;
              else
                return (
                  <View style={{alignItems: 'flex-end'}}>
                    <Button
                      style={{
                        color: 'blue',
                        borderRadius: 6,
                        padding: 5,
                        height: 40,
                      }}
                      title="send"
                      onPress={() => upload()}
                    />
                  </View>
                );
            }}
          </Mutation>
        )}
      </View>
    );
  }
}

const ItemsView = ({returnDetail}) => {
  return (
    <View style={RmaDetails.cardWrapper}>
      {returnDetail.items.map((value, key) => (
        <ItemBody
          returnId={returnDetail.return_id}
          value={value}
          returnDetail={returnDetail}
          key={key}
        />
      ))}
    </View>
  );
};

const CommentHistory = ({returnDetail}) => {
  return (
    returnDetail.comment_history.length > 0 && (
      <View>
        <Text allowFontScaling={false} style={RmaDetails.commentHistoryText}>
          Comment History
        </Text>
        {returnDetail.comment_history.map((value, key) => (
          <View
            key={key}
            style={
              value.is_customer
                ? RmaDetails.customerContainer
                : RmaDetails.executiveContainer
            }>
            <Text allowFontScaling={false} style={RmaDetails.commentText}>
              {value.comment}
            </Text>
            <View style={RmaDetails.commentBottomText}>
              <Text allowFontScaling={false} style={RmaDetails.createdText}>
                {value.created_at}
              </Text>
              <Text allowFontScaling={false} style={RmaDetails.createdText}>
                {!value.is_customer && value.executive_name}
              </Text>
            </View>
          </View>
        ))}
      </View>
    )
  );
};

const AddComment = ({
  ProceedAddComment,
  setErrorMsg,
  comment,
  errorMessage,
  postAddingComment,
  returnDetail,
  handleChange,
}) => {
  return (
    <KeyboardAvoidingView bahaviour="padding" enabled>
      <View>
        <TextInput
          style={RmaDetails.inputTextArea}
          multiline={true}
          value={comment}
          numberOfLines={6}
          onChangeText={text => handleChange(text)}
          placeholder=" Add Message ...."
          underlineColorAndroid="transparent"
        />
      </View>
      <Text
        allowFontScaling={false}
        style={{fontSize: 12, color: 'red', paddingLeft: 5}}>
        {errorMessage}
      </Text>
      <AddReturnComment
        returnId={returnDetail.return_id}
        comment={comment}
        postAddingComment={postAddingComment}>
        {(addComment, {data, loading, error}) => {
          if (loading) return <Loader loading={true} transparent={true} />;
          return (
            <TouchableOpacity
              onPress={() => {
                comment ? ProceedAddComment(addComment) : setErrorMsg();
              }}
              style={RmaDetails.button}>
              <Text allowFontScaling={false} style={RmaDetails.text}>
                Submit
              </Text>
            </TouchableOpacity>
          );
        }}
      </AddReturnComment>
    </KeyboardAvoidingView>
  );
};

class RmaHistory extends Component {
  static contextType = DentalkartContext;
  constructor() {
    super();
    this.state = {
      comment: '',
      errorMessage: '',
      attachments: [],
      title: 'Return Details',
    };
  }
  postAddingComment = (cache, {data}) => {
    const {navigation, dispatch} = this.props;
    const return_id = navigation.getParam('return_id', 'NO-ID');
    try {
      client.writeQuery({
        query: GET_RETURN_ITEMS_QUERY,
        variables: {return_id: return_id},
        data: {Returns: data.AddReturnComment},
      });
      showSuccessMessage(`comment added successfully`);
    } catch (e) {
      console.log(e);
    }
  };
  setErrorMsg = () => {
    this.setState({
      comment: '',
      errorMessage: `Please enter message`,
    });
  };
  handleChange = text => {
    if (text) {
      this.setState({
        comment: text,
        errorMessage: '',
      });
    } else {
      this.setErrorMsg();
    }
  };
  ProceedAddComment = addComment => {
    addComment();
    this.setState({
      comment: '',
    });
  };
  triggerScreenEvent = _ => {
    const {userInfo} = this.context;
    fireAnalyticsEvent({
      eventname: 'screenname',
      screenName: 'Return History',
      userId: userInfo && userInfo.getCustomer ? userInfo.getCustomer.id : '',
    });
  };
  componentDidMount() {
    this.triggerScreenEvent();
  }
  render() {
    const {navigation} = this.props;
    const return_id = navigation.getParam('return_id', 'NO-ID');
    return (
      <Query
        query={GET_RETURN_ITEMS_QUERY}
        variables={{return_id: return_id}}
        fetchPolicy="cache-and-network"
        onError={error => {
          showErrorMessage(`${error.message}. Please try again.`);
        }}>
        {({loading, error, data}) => {
          if (error) {
            return null;
          }
          if (loading) return <Loader loading={true} transparent={true} />;
          if (data.Returns) {
            const returnDetail = data.Returns[0];
            return (
              <View style={{backgroundColor: '#fff'}}>
                <HeaderComponent
                  navigation={this.props.navigation}
                  label={'Return Details'}
                  style={{height: 40}}
                />
                <ScrollView keyboardShouldPersistTaps="handled">
                  <KeyboardAvoidingView
                    style={RmaDetails.keyboardAvoid}
                    behaviour="padding"
                    enable>
                    <View style={{flex: 1}}>
                      <ReturnTopDetails returnDetail={returnDetail} />
                      <ItemsView returnDetail={returnDetail} />
                      <CommentHistory returnDetail={returnDetail} />
                      <AddComment
                        returnDetail={returnDetail}
                        ProceedAddComment={this.ProceedAddComment}
                        postAddingComment={this.postAddingComment}
                        handleChange={this.handleChange}
                        comment={this.state.comment}
                        errorMessage={this.state.errorMessage}
                        setErrorMsg={this.setErrorMsg}
                      />
                    </View>
                  </KeyboardAvoidingView>
                </ScrollView>
              </View>
            );
          } else {
            return <Loader loading={true} transparent={true} />;
          }
        }}
      </Query>
    );
  }
}
export default RmaHistory;
