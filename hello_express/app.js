var express = require('express');
var cons = require('consolidate');
var MongoClient = require('mongodb').MongoClient;
var Server = require('mongodb').Server;

var app = express();

app.engine('html', cons.swig);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');

var mongoclient = new MongoClient(new Server('192.168.56.102', 27017, {
    native_parser: true
}));
var db = mongoclient.db('course');

app.get('/', function (req, res) {
    db.collection('hello_mongo_express').findOne({}, function (err, doc) {
        if (err) throw  err;
        res.render('hello', doc);
    });
});

app.get('*', function (req, res) {
    res.send("Page not found!", 404);
});

mongoclient.open(function (err, mongoclient) {
    if (err) throw  err;
    app.listen(8080);
    console.log("Express server started on port 8080");
});

