import {MongoClient} from 'mongodb';
import _ from 'lodash';

function getImagesColl(db) {
    return db.collection('images');
}


function getAlbumsColl(db) {
    return db.collection('albums');
}

function fetchAllAlbums(db) {
    return new Promise(function (resolve, reject) {
        getAlbumsColl(db).find({}).toArray(function (err, images) {
            if (err) return reject(err);

            return resolve(images);
        });
    });
}

function fetchAllImages(db) {
    return new Promise(function (resolve, reject) {
        getImagesColl(db).find({}).toArray(function (err, images) {
            if (err) return reject(err);

            return resolve(images);
        });
    });
}

function removeImage(db, image) {
    return new Promise(function (resolve, reject) {
        getImagesColl(db).remove({_id: image._id},
            function (err, result) {
                if (err) return reject(err);
                resolve(result);
            });
    });
}

function connectedToDb() {
    return new Promise(function (resolve, reject) {
        MongoClient.connect('mongodb://192.168.1.21/final7', function (err, db) {
            "use strict";
            if (err) return reject(err);
            resolve(db);
        });
    });
}

function getOrphanImages(images, albums) {
    var toRemove = [];
    images.forEach(image => {
        var isOrphan = true;
        for (let i = 0; i < albums.length; i++) {
            var contains = _.contains(albums[i].images, image._id);
            if (contains) {
                isOrphan = false;
                break;
            }
        }
        if (isOrphan) {
            toRemove.push(image);
        }
    });
    return toRemove;
}

async function removeImages(db, imagesToRemove) {
    var removals = [];

    imagesToRemove.forEach(image => {
        removals.push(removeImage(db, image));
    });
    await removals;
}


async function startApp() {
    var db = await connectedToDb();
    var images = await fetchAllImages(db);
    var albums = await fetchAllAlbums(db);
    var imagesToRemove = getOrphanImages(images, albums);
    await removeImages(db, imagesToRemove);
    console.log('ok')
}

startApp();

