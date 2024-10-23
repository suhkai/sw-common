import { BigQuery } from "@google-cloud/bigquery";
const bqc = new BigQuery();
async function listDataSets() {
  const [a, b, c] = await bqc.getDatasets({ projectId: "bigquery-public-data" });
  console.log("from 1st", a.map((x) => x.metadata.datasetReference));
}
async function runQuery() {
  const query = `
    WITH 
        bind_vars as (
          SELECT '2024-10-31' as bind_to, '2024-10-01' as bind_from, ARRAY(SELECT 'XGUT1514700') as shipper_ids
        ),
        normalize as (
          SELECT 
            CASE WHEN bind_to = '' OR bind_to IS NULL THEN FORMAT_DATE('%Y-%m-%d', CURRENT_DATE()) ELSE bind_to END as to_datum,
            bind_from as from_datum,
            shipper_ids
          from 
            bind_vars
        ),
        enhanced as (
          SELECT 
              parse_date('%Y-%m-%d',from_datum) as from_datum,
              parse_date('%Y-%m-%d',to_datum) as to_datum,
              date_diff(parse_date('%Y-%m-%d',to_datum), parse_date('%Y-%m-%d',from_datum), DAY) as nr_days,
              shipper_ids
          from
            normalize    
        ),
        gen_stat as (
        SELECT
          count(OrderId) as shipmentPerformed,
          sum(DistanceSold) as kilometerDriven,
          count(Orderid) as nr_orders,
          sum(Revenue) as turnover
        from 
          \`central-data-platform-221212.Redspher_DWH.OrderDetails\`
          CROSS JOIN enhanced as enh
          WHERE date between enh.from_datum and enh.to_datum
          AND customerid in UNNEST(enh.shipper_ids)
      )
      select 
         s.turnover,
         s.shipmentPerformed,
         s.kilometerDriven,
         s.nr_orders/enh.nr_days/24 as shipmentPerHour,
         s.nr_orders/enh.nr_days as shipmentPerDay
      from 
        gen_stat as s
        CROSS JOIN enhanced as enh
    `;
  const options = {
    query,
    params: {
     from: '2014-10-01',
     to: '2014-10-31',
     shipper_ids: ['a','b']
    }
  };
  try {
    const response = await bqc.query(options);
    console.log(response);
  } catch (err) {
    console.log("there was an error", err.errors);
  }
}
runQuery();
