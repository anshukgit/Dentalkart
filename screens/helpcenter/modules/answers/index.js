import React, {Component} from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  Platform,
  TouchableHighlight,
  ToastAndroid,
  InteractionManager,
  ScrollView,
  Linking,
} from 'react-native';
import {WebView} from 'react-native-webview';
import Icon from 'react-native-vector-icons/Ionicons';
import {GET_ANSWER_QUERY, UPDATE_LIKE_QUERY} from './graphql';
import {Query} from 'react-apollo';
import Header from '@components/header';
import {client} from '@apolloClient';
import tokenClass from '@helpers/token';
import styles from './answers.style';
import HTML from 'react-native-render-html';
import {DeviceHeight, DeviceWidth, PrimaryColor} from '@config/environment';
import {
  showErrorMessage,
  showSuccessMessage,
} from '../../../../helpers/show_messages';
import {newclient} from '@apolloClient';
import HeaderComponent from '@components/HeaderComponent';

const script = `
    <script>
    	window.location.hash = 1;
        var calculator = document.createElement("div");
        calculator.id = "height-calculator";
        while (document.body.firstChild) {
            calculator.appendChild(document.body.firstChild);
        }
    	document.body.appendChild(calculator);
        document.title = calculator.scrollHeight;
    </script>
`;
const style = `
    <style>
    body, html, #height-calculator {
        margin: 0;
        padding: 0;
        padding-left: 10px;
        padding-right: 10px;
    }
    #height-calculator {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
    }
    </style>
`;

export default class FaqAnswers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      webviewHeight: 0,
      sendOpinion: false,
      openModal: false,
      formType: '',
      closedAfterSentComplaint: false,
      sendComplaint: false,
    };
  }
  async onNavigationChange(event) {
    if (event.title) {
      const htmlHeight = Number(event.title); //convert to number
      this.setState({webviewHeight: htmlHeight});
    }
  }
  submitOpinion = async (value, qid) => {
    try {
      const {data} = await client.mutate({
        mutation: UPDATE_LIKE_QUERY,
        variables: {qid: parseInt(qid), type: value},
      });
      this.setState({sendOpinion: true});
      showSuccessMessage('Response Noted!');
    } catch (err) {
      console.log(err);
      showErrorMessage('Error in recording the response');
    }
  };
  async openForm(type) {
    const {navigate, state} = this.props.navigation;
    let isLoggedIn = await tokenClass.loginStatus();
    InteractionManager.runAfterInteractions(() => {
      if (isLoggedIn) {
        this.setState({
          openModal: true,
          formType: type,
          closedAfterSentComplaint: false,
          sendComplaint: false,
        });
      } else {
        navigate(state.routeName, {params: this.state.stateParams});
      }
    });
  }
  render() {
    const {navigation} = this.props;
    const item = navigation.getParam('item', 'NO-NAME');
    return (
      <View>
        <HeaderComponent
          navigation={this.props.navigation}
          label={'Help Center'}
          style={{height: 40}}
        />
        <Query
          query={GET_ANSWER_QUERY}
          variables={{id: parseInt(item.id)}}
          client={newclient}
          fetchPolicy="cache-and-network">
          {({loading, error, data}) => {
            if (loading) {
              return <ActivityIndicator size="large" color="#343434" />;
            }
            if (error) {
              return showErrorMessage(`${error.message}. Please try again.`);
            }
            if (data.faqitem) {
              return (
                <ScrollView style={{height: DeviceHeight - 75}}>
                  <View style={styles.questionWrapper}>
                    <Text allowFontScaling={false} style={styles.questionText}>
                      {item.question}
                    </Text>
                  </View>
                  <Solution data={data.faqitem} _this={this} />
                  <Contact _this={this} />
                </ScrollView>
              );
            }
          }}
        </Query>
      </View>
    );
  }
}

const Solution = ({data, _this}) => {
  return (
    <View style={{paddingHorizontal: 16}}>
      <HTML
        containerStyle={styles.solutionTextView}
        // html={data.answer}
        source={{html: data.answer}}
        imagesMaxWidth={DeviceWidth - 20}
      />
    </View>
  );
};

const Helpful = ({_this, qid}) => {
  return (
    <View style={styles.solutionHelpfulWrapper}>
      <Text allowFontScaling={false} style={styles.solutionHelpfulText}>
        Was this helpful -{' '}
      </Text>
      <TouchableHighlight
        onPress={() => _this.submitOpinion(0, qid)}
        underlayColor="#ffffff10">
        <View style={styles.solutionHelpfulYesWrapper}>
          <Text allowFontScaling={false} style={styles.solutionHelpfulYes}>
            Yes
          </Text>
        </View>
      </TouchableHighlight>
      <TouchableHighlight
        onPress={() => _this.submitOpinion(1, qid)}
        underlayColor="#dddddd10">
        <View>
          <Text allowFontScaling={false} style={styles.solutionHelpfulNo}>
            No
          </Text>
        </View>
      </TouchableHighlight>
    </View>
  );
};

const Contact = ({_this}) => {
  return (
    <View style={styles.contactWrapper}>
      <Text allowFontScaling={false} style={styles.contactInfo}>
        Still unsatisfied, mail us at
      </Text>
      <Text
        allowFontScaling={false}
        style={{textAlign: 'center', color: PrimaryColor}}
        onPress={() => Linking.openURL('mailto:support@dentalkart.com')}>
        support@dentalkart.com
      </Text>
      {/*<View style={styles.contactInfoButtonWrapper}>
				<TouchableCustom onPress={()=> loginStatus() ? _this.props.navigation.navigate('TicketList') : _this.props.navigation.navigate('Login', {screen: 'HelpCenter'})} underlayColor='#ffffff10'>
					<Text allowFontScaling={false} style={styles.contactInfoButtonText}>Raise a Ticket</Text>
				</TouchableCustom>
			</View>*/}
    </View>
  );
};
