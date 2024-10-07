import {ApolloClient} from 'apollo-client';
import {createHttpLink} from 'apollo-link-http';
import {setContext} from 'apollo-link-context';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import {persistCache} from 'apollo-cache-persist';
import tokenClass from '@helpers/token';
import AsyncStorage from '@react-native-community/async-storage';
import {Platform} from 'react-native';
import {Version} from '@config/environment';
import {getCountry} from '@helpers/country';
import {onError} from 'apollo-link-error';
import {from} from 'apollo-link';
import SyncStorage from '@helpers/async_storage';
import {clientError} from '../helpers/sendData';
const introspectionQueryResultData = {
  __schema: {
    types: [],
  },
};

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
});

const errorInterceptor = onError(data => {
  const {response} = data;
  console.log('errorInterceptor data=======', data);
  try {
    console.log(
      'errorInterceptor === JSON.stringify(response)=====',
      JSON.stringify(response),
    );
    if (response?.data) {
      console.log(
        'errorInterceptor ==== JSON.stringify(response?.errors)=====',
        JSON.stringify(response?.errors),
      );
      const responseOptions = {
        query: Object.keys(response.data).join(','),
        created_at: new Date(),
        error: response?.errors ? JSON.stringify(response?.errors) : 'success',
        platform: Platform.OS,
        page: '',
      };
      manageErrorData(responseOptions);
    }
  } catch (e) {
    console.log(e);
  }
});

const manageErrorData = async responseOptions => {
  const userInfo = await SyncStorage.get('userInfoData');
  (responseOptions.customer_id = userInfo?.customer?.email
    ? userInfo?.customer?.email
    : null),
    clientError(responseOptions);
};

const httpLink = createHttpLink({
  uri: 'https://api-apollo.dentalkart.com/graphql', // magento
  // uri: 'https://apollo-staging.dentalkart.com/graphql', // magento
  credentials: 'same-origin',
});

const production = createHttpLink({
  uri: 'https://api-apollo.dentalkart.com/graphql', //appsync
  // uri: 'https://apollo-staging.dentalkart.com/graphql', //appsync

  credentials: 'same-origin',
});

/* This is being used for staging don't use it anywhere for production usage */
const staging = createHttpLink({
  // uri:'https://5eoji3llvzewthaknptjmttzwu.appsync-api.ap-south-1.amazonaws.com/graphql',
  // uri: 'https://73glivzbzjcx5p6i2frbyk3vqu.appsync-api.ap-south-1.amazonaws.com/graphql',
  uri: 'https://api-apollo.dentalkart.com/graphql',
  // uri: 'https://apollo-staging.dentalkart.com/graphql',
  credentials: 'same-origin',
});

/* This is being used for staging don't use it anywhere for production usage */
const forNewCart = createHttpLink({
  // uri:'https://5eoji3llvzewthaknptjmttzwu.appsync-api.ap-south-1.amazonaws.com/graphql',
  uri: 'https://api-apollo.dentalkart.com/graphql', // common endpoint
  // uri: 'http://gq-cart.dentalkart.com/graphql', // for cart
  // uri: 'https://a08e-2405-201-6009-9e93-edef-4f0e-2a2f-4bca.ngrok-free.app/graphql',
  // uri: 'https://9621-2405-201-6009-9e93-edef-4f0e-2a2f-4bca.ngrok-free.app/graphql',
  // uri: 'https://apollo-staging.dentalkart.com/graphql', // for cart
  credentials: 'same-origin',
});

const forFaq = createHttpLink({
  // uri:'https://5eoji3llvzewthaknptjmttzwu.appsync-api.ap-south-1.amazonaws.com/graphql',
  uri: 'https://api-apollo.dentalkart.com/graphql', // common endpoint
  // uri: 'https://dental-admin.dentalkart.com/react-admin/gql',
  credentials: 'same-origin',
});

const customer = createHttpLink({
  uri: 'https://api-apollo.dentalkart.com/graphql',
  // uri: 'https://customer-staging.dentalkart.com/graphql',
  credentials: 'same-origin',
});

const promotionBySku = createHttpLink({
  uri: 'https://api-apollo.dentalkart.com/graphql',
  // uri: 'http://gq-cart.dentalkart.com/graphql',
  // uri: 'https://apollo-staging.dentalkart.com/graphql',
  credentials: 'same-origin',
});

const freeGift = createHttpLink({
  uri: 'https://api-apollo.dentalkart.com/graphql',
  // uri: 'https://apollo-staging.dentalkart.com/graphql',
  // uri: 'http://gq-cart.dentalkart.com/graphql',
  credentials: 'same-origin',
});

const orderReturnStaging = createHttpLink({
  uri: 'https://api-apollo.dentalkart.com/graphql',
  // uri: 'https://apollo-staging.dentalkart.com/graphql',
  // uri: 'http://gq-cart.dentalkart.com/graphql',
  credentials: 'same-origin',
});

const authLink = setContext(async (_, {headers}) => {
  const token = await tokenClass.getToken();
  const country = await getCountry();

  return {
    headers: {
      ...headers,
      'x-api-key': 'da2-b7vqajjrfbgbvjf4fbesbavuhq',
      authorization: token ? `Bearer ${token}` : '',
      platform: Platform.OS,
      version: Version,
      currency: country?.currency_code,
    },
  };
});
/* This is being used for staging don't use it anywhere for staging usage */
const authLink2 = setContext(async (_, {headers}) => {
  const token = await tokenClass.getToken();
  const country = await getCountry();
  return {
    headers: {
      ...headers,
      // 'x-api-key': `da2-yv4hgpt67jaghhnbtmqp3jly44`,
      'x-api-key': 'da2-b7vqajjrfbgbvjf4fbesbavuhq',
      authorization: token ? `Bearer ${token}` : '',
      platform: Platform.OS,
      version: Version,
      currency: country?.currency_code,
    },
  };
});

/* This is being used for production usage */
const authLink3 = setContext(async (_, {headers}) => {
  const token = await tokenClass.getToken();
  const country = await getCountry();
  return {
    headers: {
      ...headers,
      'x-api-key': 'da2-b7vqajjrfbgbvjf4fbesbavuhq',
      authorization: token ? `Bearer ${token}` : '',
      platform: Platform.OS,
      version: Version,
      currency: country?.currency_code,
    },
  };
});

const authLink4 = setContext(async (_, {headers}) => {
  const token = await tokenClass.getToken();
  // const token = '5v1o090h1sa32o3nxgvnm887mrrzodkh';
  const country = await getCountry();
  console.log('Bearer ${token}', `Bearer ${token}`);
  return {
    headers: {
      ...headers,
      'x-api-key': 'da2-b7vqajjrfbgbvjf4fbesbavuhq',
      authorization: token ? `Bearer ${token}` : '',
      platform: Platform.OS,
      version: Version,
      currency: country?.currency_code,
    },
  };
});

const cache = new InMemoryCache({
  dataIdFromObject: o => (o._id ? `${o.__typename}:${o._id}` : null),
  fragmentMatcher,
});

persistCache({
  cache,
  storage: AsyncStorage,
  trigger: 'background',
});

export const client = new ApolloClient({
  // link: authLink.concat(httpLink),
  link: from([authLink, errorInterceptor, httpLink]),
  cache,
});

/* This is being used for production usage */
export const newclient = new ApolloClient({
  // link: authLink3.concat(production),
  link: from([authLink3, errorInterceptor, production]),
  cache,
});

/* This is being used for staging don't use it anywhere for production usage */
export const client2 = new ApolloClient({
  // link: authLink2.concat(staging),
  link: from([authLink, errorInterceptor, staging]),
  cache,
});

/* new cart apis */
export const cartClient = new ApolloClient({
  // link: authLink2.concat(staging),
  link: from([authLink4, errorInterceptor, forNewCart]),
  cache,
});

// FAQ apis
export const faqClient = new ApolloClient({
  // link: authLink2.concat(staging),
  link: from([authLink4, errorInterceptor, forFaq]),
  /* This is being used for customer don't use it anywhere for production usage */
  cache,
});

export const customerClient = new ApolloClient({
  // link: authLink2.concat(staging),
  link: from([authLink, errorInterceptor, customer]),
  cache,
});

export const promotionBySkuClient = new ApolloClient({
  // link: authLink2.concat(staging),
  link: from([authLink, errorInterceptor, promotionBySku]),
  cache,
});
export const freeGiftClient = new ApolloClient({
  // link: authLink2.concat(staging),
  link: from([authLink, errorInterceptor, freeGift]),
  cache,
});

export const orderReturnStagingClient = new ApolloClient({
  // link: authLink2.concat(staging),
  link: from([authLink, errorInterceptor, orderReturnStaging]),
  cache,
});
