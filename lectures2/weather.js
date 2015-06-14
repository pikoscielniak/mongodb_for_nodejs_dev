var MongoClient = require("mongodb").MongoClient;

console.log('--------------------------------');

MongoClient.connect('mongodb://192.168.56.102:27017/weather', function (err, db) {
    if (err) throw err;

    var query = {};

    var lastState = '';

    var itemsToUpdate = [];

    function callback(err, doc) {
        if (err) throw err;

        if (!doc) {
            console.dir(itemsToUpdate);
            return db.close();
        }

        if (doc.State != lastState) {
            lastState = doc.State;
            itemsToUpdate.push(doc._id.toString());
        }
    }

    var cursor = db.collection('data').find(query);
    cursor.sort([{"State": 1}, {"Temperature": -1}]);

    cursor.each(callback);
});