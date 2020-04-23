const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
 
// Connection URL
const url = process.env.DB_URL;

// Database Name
const dbName = 'gear_closet';
const collName = 'gear';

// database settings
const settings = { useUnifiedTopology: true };

//valid item check
const invalidItem = (item) => {
    let result;
    if(!item.name){
        result = "Item must have a name";
    } else if(!item.brand){
        result = "Item must have a brand. Enter 'unknown' is brand is not known.";
    };
};

const getGear = () => {
    const promise = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function(err, client){
            if(err){
                reject(err);
            } else {
                console.log("Successfully connect to server.")
                const db = client.db(dbName);
                const collection = db.collection(collName);
                collection.find({}).toArray(function(err,docs){
                    if(err){
                        reject(err);
                    } else {
                        console.log("Found the following data:");
                        console.log(docs);
                        resolve(docs);
                        client.close();
                    }
                });
            };
        });
    })
    return promise;
}

const addGear = (items) => {
    const promise = new Promise((resolve, reject) => {
        if(!Array.isArray(items)){
            reject({error: "Need to send an array of item/s"});
        } else {
            const invalidItems = items.filter((item) => {
                const check = invalidItem(item);
                if(check){
                    item.invalid = check;
                }
                return item.invalid
            });
            if(invalidItems.length > 0){
                reject({
                    error: "Some item/s were invalid",
                    data: invalidItems
                })
            } else {
                MongoClient.connect(url, settings, async function(err, client){
                    if(err){
                        reject(err);
                    } else {
                        console.log("Successfully connected to server.");
                        const db = client.db("gear_closet");
                        const collection = db.collection('gear');
                        const results = await collection.insertMany(items);
                        resolve(results.ops);
                    }
                    
                })
            }
        };
    });
    return promise;
};

const removeGear = (id) => {
    const iou = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function (err, client) {
            if (err) {
                reject(err);
            } else {
                console.log('Connected to DB Server for DELETE');
                const db = client.db(dbName);
                const collection = db.collection(collName);
                collection.deleteOne({ _id: ObjectID(id) }, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve({ deleted_id: id });
                        client.close();
                    }
                })
            }
        })
    })
    return iou;
};

const updateGear = (id, item) => {
    const promise = new Promise((resolve, reject) => {
        MongoClient.connect(url, settings, function(err, client){
            if(err){
                reject(err);
            } else {
                console.log("Successfully connected to DB for PUT.");
                const db = client.db(dbName);
                const collection = db.collection(collName);
                collection.replaceOne({_id:ObjectID(id)},
                item,
                {upsert: true},
                (err, result) => {
                    if(err){
                        reject(err);
                    } else {
                        resolve({updated_id: id});
                        client.close();
                    }
                } )
            }
        })
    });
    return promise;
};




module.exports = {
    getGear,
    addGear,
    removeGear,
    updateGear
}