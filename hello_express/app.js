var express = require('express');
var app = express();

app.get('/', function (req, res) {
    res.send("Hello, World!");
});

app.get('*', function (req, res) {
    res.send("Page not found!", 404);
});

app.listen(8080);
console.log("Express server started on port 8080");