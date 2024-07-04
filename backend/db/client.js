import { MongoClient, ServerApiVersion } from "mongodb";
import URI from "./uri.js";

const client = new MongoClient(URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

export default client;
