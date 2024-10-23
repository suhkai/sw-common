import  bigqueryDataTransfer from '@google-cloud/bigquery-data-transfer';
const client = new bigqueryDataTransfer.DataTransferServiceClient({ projectId: 'causal-lattice-391918'});

async function quickstart() {
  const projectId = await client.getProjectId();

  console.log(`projectId: ${projectId}`);

  // Iterate over all elements.
  const formattedParent = client.projectPath(projectId);
  console.log(`formattedParent: ${formattedParent}`)
  let nextRequest = { parent: formattedParent };
  const options = {autoPaginate: false};
  console.log('Data sources:');
  // do {
    // Fetch the next page.
    const responses = await client.listDataSources(nextRequest, options);
    // The actual resources in a response.
    console.log('responses', responses.length); // I have 3
  
    console.log('responses[0]', responses[0].map(res => res.name).sort());
    

    console.log('responses[1]', responses[1]);

    console.log('responses[2]', responses[2].dataSources?.map(ds => ds.name).sort());
    
/*
    // The actual response object, if necessary.
    // const rawResponse = responses[2];
    resources.forEach(resource => {
      console.log(`  ${resource.name}`);
    });
  } while (nextRequest);
  */
  console.log('\n\n');
  console.log('Sources via stream:');
  const collected: any[] = [];
  client
    .listDataSourcesStream({parent: formattedParent})
    .on('data', (element: any) => {
        collected.push(element.name);
      //  console.log(`  ${element.name}`);
    })
    .on('end', () => {
        console.log('resources', collected.sort() )
    })
}
quickstart();