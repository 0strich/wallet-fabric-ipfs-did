const connectFabric = async () => {
  try {
    // Connect to MongoDB
    const client = await MongoClient.connect("mongodb://localhost:27017", {
      useUnifiedTopology: true,
    });
    const db = client.db("mydb");

    // Connect to Fabric Network
    const ccpPath = path.resolve(__dirname, "..", "connection.json");
    const ccpJSON = fs.readFileSync(ccpPath, "utf8");
    const ccp = JSON.parse(ccpJSON);
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const gateway = new Gateway();
    await gateway.connect(ccp, {
      wallet,
      identity: "user1",
      discovery: { enabled: true, asLocalhost: true },
    });
    const network = await gateway.getNetwork("mychannel");
    const contract = network.getContract("mycontract");

    // Query MongoDB
    const queryResult = await contract.evaluateTransaction("QueryMongoDB");
    const assets = JSON.parse(queryResult.toString());
    const collection = db.collection("mycollection");
    const insertResult = await collection.insertMany(assets);
    console.log("Inserted documents:", insertResult.insertedCount);

    // Disconnect from Fabric Network and MongoDB
    await gateway.disconnect();
    await client.close();
  } catch (error) {
    console.error(`Failed to execute transaction: ${error}`);
    process.exit(1);
  }
};

module.exports = { connectFabric };
