import {StyleSheet} from 'react-native';
import {SecondaryColor, DeviceWidth, DeviceHeight} from '@config/environment';

export default styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2',
  },
  mainContainer: {
    flex: 1,
  },
  noPlanView: {
    flex: 1,
  },
  enrollButton: {
    marginVertical: 15,
    alignSelf: 'center',
    borderRadius: 10,
    paddingHorizontal: 5,
    width: 100,
    paddingVertical: 5,
    backgroundColor: '#f3943d',
    alignItems: 'center',
  },
  scrollView: {
    backgroundColor: '#f2f2f2',
    // height: '100%',
  },
  planCard: {
    backgroundColor: '#ffe9d4',
    borderRadius: 5,
    padding: 15,
    margin: 5,
    elevation: 5,
    shadowColor: '#e4dede',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  totalSavingCard: {
    backgroundColor: '#ffffff',
    padding: 15,
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: DeviceWidth,
  },
  membershipOrdersCard: {
    backgroundColor: '#fff7f0',
    padding: 15,
    flex: 1,
    width: DeviceWidth,
    marginBottom: 5,
  },
  itemDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
  },

  cardContainer: {
    marginTop: 15,
    backgroundColor: '#f2f2f2',
    flex: 1,
    width: DeviceWidth,
  },

  textGroup: {
    alignItems: 'center',
    marginVertical: 15,
  },
  textYay: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
  },
  beforeMembershipText: {
    fontWeight: '300',
    fontSize: 20,
    color: '#000000',
  },
  noPlanBanner: {
    width: DeviceWidth,

    resizeMode: 'contain',
    height: DeviceHeight / 2.6,
  },
  renewBanner: {
    height: 120,
    width: 120,
    justifyContent: 'center',
    resizeMode: 'contain',
  },
  benefitsBanner: {
    height: 150,
    width: 150,
    justifyContent: 'center',
  },
  savingsBanner: {
    height: 120,
    width: 120,
    justifyContent: 'center',
  },
  cardContent: {
    alignItems: 'center',
    flex: 1,
  },
  cardContentLeft: {
    alignItems: 'flex-start',
    alignSelf: 'flex-end',
    flex: 1,
  },
  cardHeading: {
    alignItems: 'flex-start',
    paddingLeft: 15,
    paddingBottom: 5,
    paddingTop: 5,
    flex: 1,
    backgroundColor: '#fff',
  },
  cardContentRight: {
    alignItems: 'flex-end',
    flex: 1,
  },
  currentPlan: {
    fontSize: 22,
    fontWeight: '900',
    color: '#5a5959',
  },
  renewTextDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: '#414141',
  },
  renewTextHeading: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  planDuration: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#f3943d',
  },
  daysLeft: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  labelLeft: {
    fontSize: 14,
    fontWeight: '300',
    color: '#000000',
  },
  labelActive: {
    fontSize: 12,
    fontWeight: '700',
    color: '#fff7f0',
    alignSelf: 'center',
  },
  renew: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  renewIcon: {
    paddingRight: 5,
  },
  labelActiveView: {
    backgroundColor: '#007c00',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-end',
    marginBottom: 5,
  },
  labelExpiredView: {
    backgroundColor: '#ff1d1d',
    borderRadius: 15,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-end',
    marginBottom: 5,
  },
  headingText: {
    fontSize: 16,
    fontWeight: '300',
    color: '#000000',
  },
  totalSavingTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2db12d',
    flexWrap: 'wrap',
  },
  savingDescription: {
    fontSize: 12,
    color: '#414141',
    flexWrap: 'wrap',
    padding: 10,
  },
  viewDetails: {
    fontSize: 12,
    color: '#00f',
  },
});
