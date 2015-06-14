var MongoClient = require("mongodb").MongoClient;

MongoClient.connect('mongodb://192.168.56.102:27017/course', function (err, db) {
    if (err) throw err;

    var query = {assignment: 'hw3'};

    db.collection('grades').remove(query, function (err, removed) {
        if (err) throw err;
        console.dir("removed " + removed);
        return db.close();
    });
});