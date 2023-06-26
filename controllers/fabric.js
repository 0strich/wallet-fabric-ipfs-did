const { Wallets, Gateway } = require("fabric-network");
const FabricCAServices = require("fabric-ca-client");
const fs = require("fs");
const cwr = require("utils/createWebResp");
// models
const UserCredentials = require("models/userCredentials");
// services
const service = require("services/index");
const { ccpPath, walletPath } = require("../utils/fabric");
// errors
const { errors } = require("utils/errors/index");

// 관리자 생성
const enrollAdmin = async (req, res, next) => {
  try {
    let ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));

    const caURL = ccp.certificateAuthorities["ca.org1.example.com"].url;
    const ca = new FabricCAServices(caURL);

    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const adminExists = await wallet.get("admin");
    if (adminExists) {
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
    return cwr.createWebResp(res, 200, { success: true });
  } catch (error) {
    return cwr.errorWebResp(res, 403, errors.E00009, error.message);
  }
};

// 사용자 생성
const registerUser = async (req, res, next) => {
  try {
    const { enrollmentID } = req.body;
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    const caURL = ccp.certificateAuthorities["ca.org1.example.com"].url;
    const ca = new FabricCAServices(caURL);
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    const userExists = await wallet.get(enrollmentID);

    if (userExists) {
      return;
    }

    const adminIdentity = await wallet.get("admin");
    if (!adminIdentity) {
      return;
    }

    const provider = wallet
      .getProviderRegistry()
      .getProvider(adminIdentity.type);
    const adminUser = await provider.getUserContext(adminIdentity, "admin");

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
    return cwr.createWebResp(res, 200, { success: true });
  } catch (error) {
    return cwr.errorWebResp(res, 403, errors.E00009, error.message);
  }
};

// 조회
const getQuery = async (req, res, next) => {
  try {
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log("wallet: ", wallet);
    const identity = await wallet.get("User1");
    console.log("identity: ", identity);
    if (!identity) {
      console.log("identity: ", identity);
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

    const result = await contract.submitTransaction(
      "QueryAssets",
      '{"selector":{"docType":"employee"}}'
    );
    console.log("result: ", result);

    return cwr.createWebResp(res, 200, JSON.parse(result.toString()));
  } catch (error) {
    return cwr.errorWebResp(res, 403, errors.E00009, error.message);
  }
};

// 사원증 조회
const getInfo = async (req, res, next) => {
  try {
    const { id } = req.decoded;
    const docs = await service.readById(UserCredentials, id);
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const identity = await wallet.get("User1");
    if (!identity) {
      return;
    }
    console.log("identity: ", identity);

    const gateway = new Gateway();

    await gateway.connect(ccp, {
      wallet,
      identity: "User1",
      discovery: { enabled: true, asLocalhost: true },
    });

    const network = await gateway.getNetwork("mychannel");

    const contract = network.getContract("basic");

    const didDocument = await contract.submitTransaction(
      "GetDIDDocument",
      docs?.name
    );
    console.log("didDocument: ", didDocument);

    const employeeInfo = await contract.submitTransaction(
      "QueryAssets",
      `{"selector":{"id":"${docs?.name}"}}`
    );
    console.log("employeeInfo: ", employeeInfo);

    const response = {
      employeeInfo: JSON.parse(employeeInfo.toString())[0],
      didDocument: JSON.parse(didDocument.toString()),
    };

    return cwr.createWebResp(res, 200, response);
  } catch (error) {
    return cwr.errorWebResp(res, 403, errors.E00009, error.message);
  }
};

// 사원증 검증
const postVerify = async (req, res, next) => {
  try {
    const { id } = req.body;
    console.log("id: ", id);
    const ccp = JSON.parse(fs.readFileSync(ccpPath, "utf8"));
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const identity = await wallet.get("User1");
    if (!identity) {
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

    const verifyResult = await contract.submitTransaction("verifyEmployee", id);

    const response = JSON.parse(verifyResult.toString());

    return cwr.createWebResp(res, 200, response);
  } catch (error) {
    return cwr.errorWebResp(res, 403, errors.E00009, error.message);
  }
};

module.exports = { enrollAdmin, registerUser, getQuery, getInfo, postVerify };
