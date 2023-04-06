
const schema =
{
  //doc: 'limit orders of pair bitcoin/US Dollar',
  fields: [
    {
      //doc: 'meta information',
      name: 'tag',
      type: 'string'
    },
    {
      //doc: 'the id of the limit-order',
      name: 'id',
      type: 'long'
    },
    {
      //doc: 'Amount of the limit order.',
      name: 'amount',
      type: 'float'
    },
    {
      //doc: 'The bid (>0) or ask(<0) of the limit order.',
      name: 'price',
      type: 'float'
    },
    {
      //doc: 'the timestamp (milliseconds sinds the epoch) of receipt',
      name: 'timestamp',
      type: 'int'
    }
  ],
  name: 'usd',
  namespace: 'excomb',
  type: 'record'
};

export default schema
