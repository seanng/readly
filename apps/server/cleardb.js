const MongoClient = require("mongodb").MongoClient;

const DB_URL =
  "mongodb+srv://admin:collaboration@cluster0.21krn.mongodb.net/development?retryWrites=true&w=majority";
const DB_NAME = "development";

const collections = ["User", "Link", "Collection", "UsersOnCollection"];

async function dropCollections(db) {
  // console.log('Dropping collections.')
  for (const name of collections) {
    const collection = db.collection(name);
    await collection.drop().catch((error) => {
      if (error.codeName === "NamespaceNotFound") {
        console.log("Collection not found: ", name);
      }
    });
  }
}

async function clear() {
  const client = new MongoClient(DB_URL, {
    useNewUrlParser: true,
    // useUnifiedTopology: true,
  });

  try {
    await client.connect();
    console.log("Connected correctly to server");
    const db = client.db(DB_NAME);
    await dropCollections(db);
    console.log("Success! :)");
    client.close();
  } catch (err) {
    console.log("err: ", err);
    console.log(err.stack);
  }
}

clear();
