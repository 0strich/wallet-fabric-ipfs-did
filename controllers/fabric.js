const { Wallets, Gateway } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const fs = require("fs");
const path = require("path");
const { ccpPath, walletPath } = require("../utils");

// 관리자 생성
const enrollAdmin = async (req, res, next) => {
  try {
    let ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    const caURL = ccp.certificateAuthorities["ca.org1.example.com"].url;
    const ca = new FabricCAServices(caURL);

    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const adminExists = await wallet.get("admin");
    if (adminExists) {
      console.log('"admin" already exists in the wallet');
      return;
    }

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
    console.log(
      'Successfully enrolled admin user "admin" and imported it into the wallet'
    );
  } catch (error) {
    process.exit(1);
  }
};

// 사용자 생성
const registerUser = async (req, res, next) => {
  try {
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    const caURL = ccp.certificateAuthorities["ca.org1.example.com"].url;
    const ca = new FabricCAServices(caURL);

    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const userExists = await wallet.get("User1");
    if (userExists) {
      console.log('"User1" already exists');
      return;
    }

    const adminIdentity = await wallet.get("admin");
    if (!adminIdentity) {
      console.log('"admin"');
      return;
    }

    const provider = wallet
      .getProviderRegistry()
      .getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, "admin");

    const secret = await ca.register(
      {
        affiliation: "org1.department1",
        enrollmentID: "User1",
        role: "client",
      },
      adminUser
    );
    const enrollment = await ca.enroll({
      enrollmentID: "User1",
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
    await wallet.put("User1", x509Identity);
    console.log('"User1" and imported it into the wallet');
  } catch (error) {
    process.exit(1);
  }
};

// 조회
const getQuery = async () => {
  try {
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const identity = await wallet.get("User1");
    if (!identity) {
      console.log('"User1"');
      return;
    }

    const gateway = new Gateway();

    await gateway.connect(ccp, {
      wallet,
      identity: "User1",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("mychannel");

    const contract = network.getContract("basic");

    const result = await contract.evaluateTransaction(
      "QueryAssets",
      '{"selector":{"docType":"employee"}}'
    );
    console.log(`result is: ${result.toString()}`);
  } catch (error) {
    process.exit(1);
  }
};

module.exports = { enrollAdmin, registerUser, getQuery };
