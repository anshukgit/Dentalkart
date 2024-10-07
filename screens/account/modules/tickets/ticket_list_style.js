import {StyleSheet, Platform} from 'react-native';
import {
  SecondaryColor,
  DeviceHeight,
  PrimaryColor,
  HeaderHeight,
  StatusBarHeight,
} from '@config/environment';

export const TicketsStyle = StyleSheet.create({
  ticketCardContainer: {
    paddingHorizontal: 10,
  },
  ticketCardWrapper: {
    backgroundColor: '#fff',
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 3,
    elevation: 1,
    shadowColor: '#bfbfbf',
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 2,
  },
  ticketSubject: {
    color: '#282828',
    fontSize: 14,
    marginVertical: 5,
  },
  ticketStatusWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 5,
  },
  ticketDetail: {
    color: '#28282880',
    fontSize: 12,
  },
  ticketStatus: {
    color: '#28282880',
    fontSize: 12,
    fontWeight: 'bold',
  },
  inputField: {
    borderWidth: 1,
    borderColor: '#efefef',
    paddingHorizontal: 10,
    paddingVertical: Platform.OS == 'ios' ? 10 : 5,
    marginVertical: 10,
    color: SecondaryColor,
    fontSize: 16,
  },
  inputTextArea: {
    borderWidth: 1,
    borderColor: '#efefef',
    padding: 10,
    color: '#282828',
    marginBottom: 10,
    textAlignVertical: 'top',
    fontSize: 16,
    height: 150,
  },
  sendButton: {
    backgroundColor: PrimaryColor,
    paddingVertical: 10,
    borderRadius: 3,
    alignSelf: 'flex-end',
    paddingHorizontal: 40,
    marginBottom: 20,
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  messageWrapper: {
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
    marginBottom: 10,
    borderColor: '#cccccc',
  },
  messageText: {
    color: '#282828',
  },
  customerName: {
    fontWeight: 'bold',
    color: '#282828',
  },
  messageDate: {
    color: '#282828',
    fontSize: 12,
  },
  noTicketsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: DeviceHeight - HeaderHeight - StatusBarHeight,
  },
  noTicketsText: {
    color: '#282828',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 20,
  },
  attachedImageWrapper: {
    paddingRight: 5,
    paddingTop: 5,
  },
  attachedImage: {
    width: 100,
    height: 100,
  },
  modalHeader: {
    backgroundColor: SecondaryColor,
    height: 55,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backIconWrapper: {
    margin: 20,
    paddingTop: 2,
    paddingHorizontal: 5,
  },
  headerHeading: {
    color: '#fff',
    fontSize: 20,
  },
});
