var MongoClient = require("mongodb").MongoClient;
var request = require("request");

function redditInsertCallback(err, db) {
    if (err) throw err;

    request('http://www.reddit.com/r/technology/.json', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var obj = JSON.parse(body);

            var stories = obj.data.children.map(function (story) {
                return story.data;
            });

            db.collection('reddit').insert(stories, function (err, data) {
                if (err) throw err;
                console.dir(data);
                db.close();
            })
        }

    });
}

function queryCallback(err, db) {
    //var query = {title: {$regex: 'NSA'}};
    var query = {"media.oembed.type": 'video'};

    //var projection = {title: 1, _id: 0};
    var projection = {"media.oembed.url": 1, _id: 0};

    function eachCallback(err, doc) {
        if (err) throw  err;
        if (doc == null) {
            return db.close();
        }
        console.dir(doc.title);
    }

    db.collection('reddit').find(query, projection).each(eachCallback);
}


//MongoClient.connect('mongodb://192.168.56.102:27017/course', redditInsertCallback);
MongoClient.connect('mongodb://192.168.56.102:27017/course', queryCallback);