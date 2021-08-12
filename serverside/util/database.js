/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable strict */


const MongoClient = require('mongodb').MongoClient;
//mongo deriver 

let __db;
const mongoConnect = function(callBack) {
    MongoClient.connect('mongodb://localhost:27017', { useUnifiedTopology: true })
        .then(client => {
            __db = client.db('bookDb');
            callBack();
        }).catch(error => {
            throw new Error('DB connection failed');
        });
}
const getDb = () => {
    if (__db)
        return __db;
    throw new Error('DB connection failed');
};


exports.mongoConnect = mongoConnect;
exports.getDB = getDb;