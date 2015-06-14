var MongoClient = require("mongodb").MongoClient;

MongoClient.connect('mongodb://192.168.56.102:27017/course', function (err, db) {
    if (err) throw err;

    var doc = {_id: 'Calvin', age: 6};
    var docs = [{student: 'Calvin', age: 6},
        {student: 'Susie', age: 7}];


    function insertCallback(err, inserted) {
        if (err) throw  err;

        console.dir("Success")
        console.dir(inserted.toJSON());
        return db.close();
    }

    //db.collection('students').insert(doc, insertCallback);
    db.collection('students').insert(docs, insertCallback);
});