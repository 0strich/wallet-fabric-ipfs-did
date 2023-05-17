const mongoose = require("mongoose");
const cwr = require("./createWebResp");
const { errors } = require("./errors/index");
const config = require("config/dbConfig");

const connect = async (DB_URI) => {
  console.log("DB_URI: ", DB_URI);
  try {
    if (mongoose.connection.readyState) {
      return mongoose.connection;
    } else {
      const connection = await mongoose.connect(DB_URI, {
        user: config.mongodbUser,
        pass: config.mongodbPassword,
        dbName: config.mongodbDBname,
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        socketTimeoutMS: 5 * 60 * 1000, // socket timeout 5 minutes
      });
      console.log("Success DB Connection");
      return connection;
    }
  } catch (error) {
    console.log("connection error : ", error);
    throw error;
  }
};

// DB 연동
const connectDB = async () => {
  const DB_URI = `mongodb://${config.mongodbUrl}/${config.mongodbName}`;
  console.log("DB URI : ", DB_URI);
  try {
    await connect(DB_URI);
  } catch (error) {
    console.log("DB 연결 오류 : ", error);
    cwr.errorWebResp(res, 500, errors.E91000, error);
  }
};

// 모든 DB 컬렉션 제거
const clearDB = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
};

// DB 연결 해재
const closeDB = () => {
  mongoose.connection.close();
};

module.exports = {
  connectDB,
  clearDB,
  closeDB,
};
