var MongoClient = require("mongodb").MongoClient;

MongoClient.connect('mongodb://192.168.56.102:27017/course', function (err, db) {
    if (err) throw err;

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

    var grades = db.collection('grades');
    var cursor = grades.find({});
    cursor.skip(1);
    cursor.limit(4);
    //cursor.sort({grade: 1});
    cursor.sort([{grade: 1}, {student: -1}]);

    eachCursor(cursor);
});