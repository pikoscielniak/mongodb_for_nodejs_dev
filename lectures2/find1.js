var MongoClient = require("mongodb").MongoClient;

MongoClient.connect('mongodb://192.168.56.102:27017/course', function (err, db) {
    if (err) throw err;

    var query = {student: "Joe", grade: {$gt: 80, $lt: 95}};
    var projection = {student: 1, _id: 0};

    function printDoc(doc) {
        console.dir(doc);
        console.log(doc.student + " got a good grade!");
    }

    function arrayCallback(err, docs) {
        if (err) throw err;

        docs.forEach(function (doc) {
            printDoc(doc);
        });

        db.close();
    }

    function eachCallback(err, doc) {
        if (err) throw err;

        if (doc == null) {
            return db.close();
        }

        printDoc(doc);
    }

    function eachCursor(cursor) {
        cursor.each(eachCallback);
    }

    db.collection('grades').find(query).each(eachCallback);
});