const { MongoClient, ObjectID } = require("mongodb");
const Express = require("express");
const Cors = require("cors");
const BodyParser = require("body-parser");
const { request } = require("express");

// no idea why it keeps giving 'URI malformed' when calling the uri from the .env file, its the same in the env file as it is here
// const client = new MongoClient(process.env["uri"]);

const uri = "mongodb+srv://arran:arranharding@practicecluster.zftt1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const client = new MongoClient(uri)

const server = Express();

server.use(BodyParser.json());
server.use(BodyParser.urlencoded({ extended: true }));
server.use(Cors());

var collection;

server.get("/search", async (request, response) => { try {
    let result = await collection.aggregate([
        {
            "$search": {
                "autocomplete": {
                    "query": `${request.query.query}`,
                    "path": "title",
                    "fuzzy": {
                        "maxEdits": 2,
                        "prefixLength": 3
                    }
                }
            }
        }
    ]).toArray();
    response.send(result);
} catch (e) {
    response.status(500).send({ message: e.message });
}});
server.get("/get/:id", async (request, response) => {  try {
    let result = await collection.findOne({ "_id": ObjectID(request.params.id) });
    response.send(result);
} catch (e) {
    response.status(500).send({ message: e.message });
}});

server.listen("3000", async () => {
    try {
        await client.connect();
        collection = client.db("sample_mflix").collection("movies");
    } catch (e) {
        console.error(e);
    }
});