var MongoClient = require("mongodb").MongoClient;

function wholeObjectUpdate(db) {
    var query = {assignment: 'hw1'};
    db.collection('grades').findOne(query, function (err, doc) {
        if (err) throw err;
        if (!doc) {
            console.log("No document");
            return db.close();
        }
        query['_id'] = doc['_id'];
        doc['date_returned'] = new Date();
        db.collection('grades').update(query, doc, function (err, update) {
            if (err) throw err;
            console.dir("Successfully updated " + update);
            return db.close();
        });
    });
}

MongoClient.connect('mongodb://192.168.56.102:27017/course', function (err, db) {
    if (err) throw err;

    //var query = {assignment: 'hw1'};
    var query = {};
    //var operator = {$set: {date_returned: new Date()}};
    var operator = {$unset: {date_returned: ''}};
    var options = {multi: true};

    db.collection('grades').update(query, operator, options, function (err, update) {
        if (err) throw err;
        console.dir("Successfully updated " + update);
        return db.close();
    });

    //wholeObjectUpdate(db);
});