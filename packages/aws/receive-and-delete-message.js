// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import { fileURLToPath } from "url";

// snippet-start:[sqs.JavaScript.messages.receiveMessageV3]
import {
  ReceiveMessageCommand,
  DeleteMessageCommand,
  SQSClient,
  DeleteMessageBatchCommand,
} from "@aws-sdk/client-sqs";

const client = new SQSClient({});
const SQS_QUEUE_URL = "https://sqs.eu-north-1.amazonaws.com/183295451162/q_std_evaluate_agreed_price_auction";

const receiveMessage = (queueUrl) =>
  client.send(
    new ReceiveMessageCommand({
      MessageSystemAttributeNames: ['All'],
      MaxNumberOfMessages: 10,
      MessageAttributeNames: ['All'],
      QueueUrl: queueUrl,
      //WaitTimeSeconds: 0.5,
      VisibilityTimeout: 20,
    }),
  );

export const main = async (queueUrl = SQS_QUEUE_URL) => {

  const t0 = Date.now();
  const response  = await receiveMessage(queueUrl);
  const t1 = Date.now();
  console.log('delay:', Number((t1-t0)/1000).toFixed(3));

  const { Messages } = response;
  console.log(response.$metadata)
  if (!Messages) {
    return;
  }

  for (const msg of Messages) {
     console.log('body', msg.Body);
     console.log('MessageAttributes', msg.MessageAttributes);
     await client.send(
      new DeleteMessageCommand({
        QueueUrl: queueUrl,
        ReceiptHandle: msg.ReceiptHandle,
      })
    );
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
  main();
}