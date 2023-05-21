const path = require("path");

const ccpPath = path.resolve(
  __dirname,
  "..",
  "..",
  "fabric-samples",
  "test-network",
  "organizations",
  "peerOrganizations",
  "org1.example.com",
  "connection-org1.json"
);

const walletPath = path.join(process.cwd(), "wallet");

module.exports = { ccpPath, walletPath };
