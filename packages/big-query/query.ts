// Imports the Google Cloud client library
import { BigQuery, JobOptions, Query, SimpleQueryRowsResponse } from '@google-cloud/bigquery';

const bqc = new BigQuery();

async function listDataSets() {
    // PagedResponse<Dataset, GetDatasetsOptions, bigquery.IDatasetList>;
    // either returned  an arry of 2 or 3
    const [a,b,c] = await bqc.getDatasets({ projectId: 'bigquery-public-data'});
    //const idsFromA = a.map(ds => ds.id);
    //const { datasets } = c!;
    //const idsFromC = datasets!.map(ds => ds.id).sort();
    console.log('from 1st', a.map(x => x.metadata.datasetReference));
    // console.log('from 3rd', idsFromC.join('\n'));
}

async function runQuery() {
    const query = `
    SELECT IFNULL(country_name, 'some-country') AS cm, IFNULL(@fakenull, 'some-country') AS cm2
    FROM \`bigquery-public-data.utility_us.country_code_iso\` 
    LIMIT @LIMITLENGTH
    `;

    const options: Query = {
        query,
        params: {
            fakenull: null,
            LIMITLENGTH: 5,
        },
    };

    try {
        const response: SimpleQueryRowsResponse = await bqc.query(options);
        console.log(response);
    }
    catch (err){
        console.log('there was an error', err.errors);
    }
}

/*
async function doQuery() {
    // Creates a client
    const bigqueryClient = new BigQuery();
  
    const result = await bigqueryClient.query('SELECT id, title FROM `bigquery-public-data.stackoverflow.posts_questions` LIMIT 10');
    console.log('result returned:', result);
    
  }
  doQuery();

  // test-project (my workspace?)
  // projectnum: 636034023356
  // projectId: causal-lattice-391918

  // datasetId: "causal-lattice-391918.locality_data_set"

  //"causal-lattice-391918.locality_data_set"

  //"causal-lattice-391918.locality_data_set.table123"
  */

  runQuery()