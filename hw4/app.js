import {MongoClient} from 'mongodb';
import _ from 'lodash';

function getStudentsColl(db) {
    return db.collection('students');
}

function fetchAllStudents(db) {
    return new Promise(function (resolve, reject) {
        getStudentsColl(db).find({}).toArray(function (err, students) {
            if (err) return reject(err);

            return resolve(students);
        });
    });
}

function updateScores(db, id, newScore) {
    return new Promise(function (resolve, reject) {
        getStudentsColl(db).update({_id: id}, {$set: {scores: newScore}},
            function (err, result) {
                if (err) return reject(err);
                resolve(result);
            });
    });
}

function connectedToDb() {
    return new Promise(function (resolve, reject) {
        MongoClient.connect('mongodb://192.168.56.102:27017/school', function (err, db) {
            "use strict";
            if (err) return reject(err);
            resolve(db);
        });
    });
}

function isHomework(score) {
    return score.type === 'homework';
}

async function doUpdateScoresParallel(db, students) {
    console.time("parallel");
    var scoreUpdates = [];

    students.forEach(student => {
        var allScores = student.scores;
        var minHomework = _.chain(allScores).filter(isHomework).min(s=>s.score);
        if (minHomework) {
            _.remove(allScores, s => _.isEqual(s, minHomework));
            scoreUpdates.push(updateScores(db, student._id, allScores));
        }
    });
    await scoreUpdates;

    //await Promise.all(scoreUpdates);
    console.log('updated done');
    console.timeEnd("parallel");
}

async function doUpdateScoresSeries(db, students) {
    console.time("series");
    await students.forEach(async (student) => {
        var allScores = student.scores;
        var minHomework = _.chain(allScores).filter(isHomework).min(s=>s.score);
        if (minHomework) {
            _.remove(allScores, s => _.isEqual(s, minHomework));
            await updateScores(db, student._id, allScores);
        }
    });
    console.log('updated done');
    console.timeEnd("series");
}

async function startApp() {
    var db = await connectedToDb();
    var students = await fetchAllStudents(db);
    await doUpdateScoresParallel(db, students);
    //await doUpdateScoresSeries(db, students);
}

startApp();

