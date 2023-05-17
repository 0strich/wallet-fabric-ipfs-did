const express = require("express");
const router = express.Router();
const FabricCAServices = require("fabric-ca-client");
const { Wallets, Gateway } = require("fabric-network");
const path = require("path");
const fs = require("fs");

// const HOME = "/home/hyper/fabric-samples";
const HOME = "/Users/patric/fabric-samples";

router.get("/get/:enrollmentID", async (req, res, next) => {
  try {
    const { enrollmentID } = req.params;
    console.log("enrollmentID: ", enrollmentID);

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log("wallet: ", await wallet.list());
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const identity = await wallet.get(enrollmentID);
    if (!identity) {
      console.log(`"${enrollmentID}" does not exist`);
      return;
    }

    // Create a new gateway for connecting to our peer node.
    const gateway = new Gateway();
    const connectionProfilePath = path.resolve(
      HOME,
      "test-network",
      "organizations",
      "peerOrganizations",
      "org1.example.com",
      "connection-org1.json"
    );

    const connectionProfile = JSON.parse(
      fs.readFileSync(connectionProfilePath, "utf8")
    );
    const connectionOptions = {
      identity: enrollmentID,
      wallet: wallet,
      discovery: { enabled: true, asLocalhost: true },
    };
    await gateway.connect(connectionProfile, connectionOptions);

    // Get the network (channel) our contract is deployed to.
    const network = await gateway.getNetwork("mychannel");

    // Get the contract from the network.
    const contract = network.getContract("basic");

    // Query the ledger
    // const result = await contract.evaluateTransaction("GetAllAssets");
    const result = await contract.evaluateTransaction(
      "QueryAssets",
      '{"selector":{"docType":"asset"}, "use_index":["_design/indexOwnerDoc", "indexOwner"]}'
    );

    await gateway.disconnect();

    res.json(JSON.parse(result.toString()));
  } catch (error) {
    console.log("error: ", error);
  }
});

router.post("/post", async (req, res, next) => {
  try {
    // // Submit a transaction
    // await contract.submitTransaction(
    //   "createCar",
    //   "CAR12",
    //   "Honda",
    //   "Accord",
    //   "Black",
    //   "Tom"
    // );
    // console.log("Transaction has been submitted");

    // // Disconnect from the gateway.
    // await gateway.disconnect();

    res.json({});
  } catch (error) {
    console.log("error: ", error);
  }
});

// 관리자 계정 생성
router.post("/enrollAdmin", async (req, res, next) => {
  try {
    // load the network configuration
    const ccpPath = path.resolve(
      HOME,
      "test-network",
      "organizations",
      "peerOrganizations",
      "org1.example.com",
      "connection-org1.json"
    );
    let ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    // Create a new CA client for interacting with the CA.
    const caURL = ccp.certificateAuthorities["ca.org1.example.com"].url;
    const ca = new FabricCAServices(caURL);

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the admin user.
    const adminExists = await wallet.get("admin");
    if (adminExists) {
      console.log('"admin" already exists');
      return;
    }

    // Enroll the admin user, and import the new identity into the wallet.
    const enrollment = await ca.enroll({
      enrollmentID: "admin",
      enrollmentSecret: "adminpw",
    });
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: "Org1MSP",
      type: "X.509",
    };
    await wallet.put("admin", x509Identity);
    console.log(' "admin" and imported it into the wallet');
    res.json({});
  } catch (error) {
    console.log("error: ", error);
  }
});

router.post("/registerUser", async (req, res, next) => {
  try {
    const { enrollmentID } = req.body;

    // load the network configuration
    const ccpPath = path.resolve(
      HOME,
      "test-network",
      "organizations",
      "peerOrganizations",
      "org1.example.com",
      "connection-org1.json"
    );
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    // Create a new CA client for interacting with the CA.
    const caURL = ccp.certificateAuthorities["ca.org1.example.com"].url;
    const ca = new FabricCAServices(caURL);

    // Create a new file system based wallet for managing identities.
    const walletPath = path.join(process.cwd(), "wallet");
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check to see if we've already enrolled the user.
    const userExists = await wallet.get(enrollmentID);
    if (userExists) {
      console.log(`"${enrollmentID}" already exists`);
      return;
    }

    // Check to see if we've already enrolled the admin user.
    const adminIdentity = await wallet.get("admin");
    if (!adminIdentity) {
      console.log('user "admin" does not exist');
      return;
    }

    // build a user object for authenticating with the CA
    const provider = wallet
      .getProviderRegistry()
      .getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, "admin");

    // Register the user, enroll the user, and import the new identity into the wallet.
    const secret = await ca.register(
      {
        affiliation: "org1.department1",
        enrollmentID,
        role: "client",
      },
      adminUser
    );
    const enrollment = await ca.enroll({
      enrollmentID,
      enrollmentSecret: secret,
    });
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: "Org1MSP",
      type: "X.509",
    };
    await wallet.put(enrollmentID, x509Identity);
    console.log(`admin user "${enrollmentID}" and imported`);

    res.json({});
  } catch (error) {
    console.log("error: ", error);
  }
});

module.exports = router;
