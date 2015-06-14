var MongoClient = require("mongodb").MongoClient;

MongoClient.connect('mongodb://192.168.56.102:27017/course', function (err, db) {
    if (err) throw err;

    var query = {name: 'comments'};
    var sort = {};
    var operator = {$inc: {counter: 1}};
    var options = {'new': true};

    db.collection('counters').findAndModify(query, sort, operator, options,
        function (err, doc) {
            if (err) throw err;

            if (!doc) {
                console.log('No counter');
            } else {
                console.dir(doc);
                console.log("number: " + doc.counter);
            }
            return db.close();
        });
});