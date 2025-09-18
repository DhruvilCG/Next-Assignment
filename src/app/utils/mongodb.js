import { MongoClient } from "mongodb";

// Hardcoded URI (not using env here)
const uri = "mongodb+srv://dhruvilpatelm_db_user:dhruvil2207@cluster0.o9t8z5a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let client;
let clientPromise;

if (!uri) {
  throw new Error("MongoDB URI is missing!");
}

if (process.env.NODE_ENV === "development") {
  // Use global in dev to avoid creating multiple connections on hot reload
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, create new client
  client = new MongoClient(uri);
  clientPromise = client.connect();
}

// ✅ Always return the "test" database
export default async function getDb() {
  const client = await clientPromise;
  return client.db("test"); // directly returns test DB
}
    