const { MongoClient, ServerApiVersion } = require("mongodb");

const uri ='mongodb+srv://arpit:YRROKS89QWbHULpv@cluster0.lvujxxc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let _db;

const MongoConnect = async () => {
  try {
    const clientInstance = await client.connect();
    _db = clientInstance.db("Expense");
    console.log("Successfully connected to MongoDB!");
  } catch (error) {
    console.error(error);
    throw new Error("Error connecting to MongoDB");
  }
};

const getDb = () => {
  if (_db) {
    return _db;
  } else {
    throw new Error("No Database Connection");
  }
};

exports.MongoConnect = MongoConnect;
exports.getDb = getDb;
