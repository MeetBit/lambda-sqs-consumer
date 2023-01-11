const AWS = require('aws-sdk');
const axios = require('axios')
require('dotenv').config()

// sqs client
const sqs = new AWS.SQS();

exports.handler = async (e) => {
  try {

    /* INITIALIZE SQS EVENT DATA */
    console.log('received', JSON.stringify(e))

    // Get the receipt handle of the message from the event object
    const receiptHandle = e.Records[0].receiptHandle;

    // Get the SQS event data from the input parameter
    const sqsEvent = e.Records[0];

    // Extract the message data from the SQS event
    const data = JSON.parse(sqsEvent.body);

    /* APPLICATION LOGIc */
    //add your code here


    /* DELETE SQS MESSAGE */
    // Delete the message if successful, otherwise return error
    await sqs.deleteMessage({
      QueueUrl: process.env.QUEUE_URL,
      ReceiptHandle: receiptHandle
    }).promise();

    /* RETURN SUCCESSFUL RESPONSE */
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Webhook sent successfully'
      })
    };

  } catch (e) {
    console.log('error', e)
    return {
      statusCode: 500,
      body: JSON.stringify({ message: `${JSON.stringify(e)}` })
    };
  }
};