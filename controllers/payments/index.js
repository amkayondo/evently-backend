import random from 'lodash.random';
import axios from 'axios';

import { v4 as uuidv4 } from 'uuid';
import models from '../../models';

const { Event, PaymentEvents, PaymentRequests, Ticket } = models;
const { PUBLIC_SECRET, enckey } = process.env;

let TICKET_NO, EVENT_SLUG, ORGANIZER;

const verifyPayment = async payload => {
  const { verificationId } = payload;
  console.log('verificationId', verificationId);
  console.log(
    'TICKET_NO, EVENT_SLUG, ORGINIZER',
    TICKET_NO,
    EVENT_SLUG,
    ORGANIZER
  );

  const organizer = ORGANIZER;
  const ticketNo = TICKET_NO;
  const event = EVENT_SLUG;

  const results = await axios({
    url: `https://api.flutterwave.com/v3/transactions/${verificationId}/verify`,
    method: 'GET',
    headers: { Authorization: `Bearer ${PUBLIC_SECRET}` }
  });

  const { data } = results.data;
  if (results.status === 200) {
    const paidPayload = {
      paymentID: uuidv4(),
      ticketNo,
      amount: data.amount,
      organizer,
      event,
      transactionID: data.id,
      attendanceStatus: true,
      customer: data.customer,
      paymentMethod: data.payment_type,
      refID: data.tx_ref
    };
    const { dataValues } = await PaymentEvents.create(paidPayload);
    await Ticket.update(
      { status: 'booked' },
      {
        ticketNumber: ticketNo,
        event
      }
    );
  } else {
    throw new Error(results);
  }
};

export const webhookPath = async (req, res) => {
  const requestJson = req.body;
  const { data } = requestJson;

  const newRequest = {
    verificationId: data.id,
    refId: data.tx_ref,
    status: data.status,
    amount: data.charged_amount,
    createdAt: data.created_at,
    eventStatus: requestJson.event,
    customer: data.customer,
    paymentType: data.payment_type
  };

  const { dataValues } = await PaymentRequests.create(newRequest);
  await verifyPayment(dataValues);

  res.sendStatus(200);
};

export const standardPayment = async (req, res) => {
  const tx_ref = `GAT-${random(100000000, 200000000)}`;
  const redirect_url = 'https://google.com';
  const { slug } = req.params;
  const { dataValues } = await Event.findOne({
    where: { slug }
  });

  ORGANIZER = dataValues.organizer;
  EVENT_SLUG = slug;

  const {
    currency,
    amount,
    fullname,
    email,
    phone_number,
    ticket_id
  } = req.body;

  TICKET_NO = ticket_id;

  const payload = {
    currency,
    amount,
    payment_options: 'card',
    customer: {
      email,
      phone_number,
      name: fullname
    },
    customizations: {
      title: 'Get A Plot',
      description: 'awesome app',
      logo: 'https://assets.piedpiper.com/logo.png'
    },
    tx_ref,
    redirect_url,
    enckey
  };
  const hostedLink = await axios({
    url: 'https://api.flutterwave.com/v3/payments',
    method: 'post',
    data: payload,
    headers: { Authorization: `Bearer ${PUBLIC_SECRET}` }
  });
  const { data } = hostedLink;
  return res.status(200).send(data);
};

export const usersPaidForEvent = async (req, res) => {
  const { slug } = req.params;
  const { email } = req.organizer;

  const { count, rows: data } = await PaymentEvents.findAndCountAll({
    where: {
      event: slug
    }
  });

  const { organizer } = data[0];

  if (email !== organizer) {
    return res.status(403).send({
      status: 403,
      message: 'Unauthorized to perform this action'
    });
  }

  return res.send({
    message: 'success',
    count,
    data
  });
};

export const eventAttendees = async (req, res) => {
  const { slug } = req.params;
  const { email } = req.organizer;
  const { count, rows: data } = await PaymentEvents.findAndCountAll({
    where: {
      event: slug,
      attendanceStatus: 'true'
    }
  });

  const { organizer } = data[0];

  if (email !== organizer) {
    return res.status(403).send({
      status: 403,
      message: 'Unauthorized to perform this action'
    });
  }

  return res.send({
    message: 'success',
    count,
    data
  });
};

export const attendFree = async (req, res) => {
  const { username, phone_number, email, ticket_id } = req.body;
  const { event, organizerEmail } = req;

  const freePayload = {
    paymentID: uuidv4(),
    amount: 0,
    organizer: organizerEmail,
    event,
    transactionID: null,
    attendanceStatus: true,
    paymentMethod: 'free',
    refID: 'free',
    ticketNo: ticket_id,
    customer: {
      name: username,
      phone_number,
      email
    }
  };

  const { dataValues } = await PaymentEvents.create(freePayload);
  await Ticket.update(
    { status: 'booked' },
    {
      where: { ticketNumber: ticket_id, event }
    }
  );
  res.send(dataValues);
};

export const cancelFreeAttendance = async (req, res) => {
  const { event } = req;
  const { ticketId } = req.params;

  const { dataValues } = await PaymentEvents.update(
    { attendanceStatus: false },
    {
      where: {
        ticketNo: ticketId,
        event
      }
    }
  );
  await Ticket.update(
    { status: 'available' },
    {
      where: { ticketNumber: ticketId, event }
    }
  );
  res.send({
    status: 200,
    message: 'Attendance has been cancelled.'
  });
};
