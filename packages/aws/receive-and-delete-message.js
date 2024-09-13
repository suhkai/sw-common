// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { fileURLToPath } from "url";

// snippet-start:[sqs.JavaScript.messages.receiveMessageV3]

import awsSdkSQS, { SQSServiceException } from '@aws-sdk/client-sqs';

async function delay(ts) {
  return new Promise(resolve => setTimeout(resolve, ts));
}

async function doWork(){
  console.log('create client');
  const client = new awsSdkSQS.SQSClient({});
  console.log('client created');
  const SQS_QUEUE_URL = "https://sqs.eu-north-1.amazonaws.com/183295451162/q_std_evaluate_agreed_price_auction";
  console.log(await client.config.credentials());
  const receiveMessage = async () =>
    client.send(
      new awsSdkSQS.ReceiveMessageCommand({
        MessageSystemAttributeNames: ['All'],
        MaxNumberOfMessages: 1,
        MessageAttributeNames: ['All'],
        QueueUrl: SQS_QUEUE_URL,
        WaitTimeSeconds: 10,
        VisibilityTimeout: 0,
      }),
    );
   
  const t0 = Date.now();
  let response;
  try {
    response = await receiveMessage();
    console.log(Object.keys(response));
    console.log(response.$metadata, response.Messages)
  }
  catch(err) {
    const isInstanceof = err instanceof SQSServiceException;
    console.log('isINtsance: [%s], happened:[%o]', isInstanceof, err.$fault, err.$metadata, err.name);
    return;
  }
  const t1 = Date.now();
  console.log('delay:', Number((t1-t0)/1000).toFixed(3));

  const { Messages } = response;
  console.log(response.$metadata)
  if (!Messages) {
    console.log('stop');
    return;
  }

  for (const msg of Messages) {
    console.log('body', msg.Body);
    console.log('MessageAttributes', msg.MessageAttributes);
    const response = await client.send(
      new awsSdkSQS.DeleteMessageCommand({
        QueueUrl: SQS_QUEUE_URL,
        ReceiptHandle: msg.ReceiptHandle,
      })
    );
    console.log('deleted response', response);
  }
  /*
    await client.send(
      new DeleteMessageBatchCommand({
        QueueUrl: queueUrl,
        Entries: Messages.map((message) => ({
          Id: message.MessageId,
          ReceiptHandle: message.ReceiptHandle,
        })),
      }),
    );
  */
};

// Invoke main function if this file was run directly.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  doWork();
}