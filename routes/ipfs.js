const express = require("express");
const router = express.Router();
const { create } = require("ipfs-http-client");

// connect to the default API address http://localhost:5001
// const client = create();

// connect to a different API
const client = create({ url: "http://127.0.0.1:5001/api/v0" });

// connect using a URL
// const client = create(new URL("http://127.0.0.1:5002"));

router.get("/add", async (req, res, next) => {
  try {
    const { cid } = await client.add("Hello world!");
    console.log("cid: ", cid);

    res.json({ success: true });
  } catch (error) {
    console.log("error: ", error);
  }
});

router.get("/read", async (req, res, next) => {
  try {
    res.json({ success: true });
  } catch (error) {
    console.log("error: ", error);
  }
});

router.get("/write", async (req, res, next) => {
  try {
  } catch (error) {
    console.log("error: ", error);
  }
});

module.exports = router;
