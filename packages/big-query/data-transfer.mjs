import bigqueryDataTransfer from "@google-cloud/bigquery-data-transfer";
const client = new bigqueryDataTransfer.DataTransferServiceClient({ projectId: "causal-lattice-391918" });
async function quickstart() {
  const projectId = await client.getProjectId();
  console.log(`projectId: ${projectId}`);
  const formattedParent = client.projectPath(projectId);
  console.log(`formattedParent: ${formattedParent}`);
  let nextRequest = { parent: formattedParent };
  const options = { autoPaginate: false };
  console.log("Data sources:");
  const responses = await client.listDataSources(nextRequest, options);
  console.log("responses", responses.length);
  console.log("responses[0]", responses[0].map((res) => res.name).sort());
  console.log("responses[1]", responses[1]);
  console.log("responses[2]", responses[2].dataSources?.map((ds) => ds.name).sort());
  console.log("\n\n");
  console.log("Sources via stream:");
  const collected = [];
  client.listDataSourcesStream({ parent: formattedParent }).on("data", (element) => {
    collected.push(element.name);
  }).on("end", () => {
    console.log("resources", collected.sort());
  });
}
quickstart();
