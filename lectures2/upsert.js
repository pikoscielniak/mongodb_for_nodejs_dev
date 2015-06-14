var MongoClient = require("mongodb").MongoClient;

function doUpsert(db) {
    var query = {student: 'Frank', assignment: 'hw1'};
    //var operator = {student: 'Frank', assignment: 'hw1', grade: 100};
    var operator = {$set: {date_returned: new Date(), grade: 100}};
    var options = {upsert: true};

    db.collection('grades').update(query, operator, options, function (err, update) {
        if (err) throw err;
        console.dir("Successfully upserted " + update);
        return db.close();
    });
}
MongoClient.connect('mongodb://192.168.56.102:27017/course', function (err, db) {
    if (err) throw err;

    var query = {assignment: 'hw2'};

    db.collection('grades').findOne(function (err, doc) {
        if (err) throw err;
        doc.date_returned = new Date();

        db.collection('grades').save(doc, function (err, saved) {
            if (err) throw err;
            console.dir("successfully saved " + saved);
            return db.close();
        });
    });

    //doUpsert(db);
});