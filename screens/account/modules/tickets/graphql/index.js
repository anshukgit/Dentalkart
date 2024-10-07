import gql from "graphql-tag";

export const FETCH_TICKETS = gql`
	{
	  fetchtickets{
	    code
	    order_id
	    status
	    subject
	    created_at
	    last_reply_at
	    last_reply_name
	  }
	}
`;

export const FETCH_TICKET_DETAILS = gql`
	query($id: String!){
	  fetchticketdetail(id: $id) {
	    code
		subject
	    order_id
	    status
	    last_reply_name
	    last_reply_at
	    created_at
	    last_message_is_read
		messages{
	      created_at
	      body
	      attachments
	      is_read
	      username
	    }
	  }
	}
`;

export const ADD_TICKET_MESSAGE = gql`
	mutation($id: String!, $message: String!, $attachments: [String]){
	  addmessage(input: {
		code: $id
		message: $message
		attachments: $attachments
	  }){
	  	  created_at
	      body
	      attachments
	      is_read
	      username
	  }
	}
`;

export const CREATE_TICKET = gql`
	mutation($subject: String!, $message: String!, $attachments: [String], $order_id: String){
	  submitticket(input: {
		subject: $subject
		message: $message
		attachment: $attachments
		order_id: $order_id
	  }){
	    code
	    order_id
	    status
	    subject
	    created_at
	    last_reply_at
	    last_reply_name
	  }
	}
`;