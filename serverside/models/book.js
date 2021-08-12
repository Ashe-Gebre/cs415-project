/* eslint-disable id-length */
/* eslint-disable strict */
/* eslint-disable require-jsdoc */

const getDb = require("../util/database").getDB;
const { ObjectID } = require("mongodb");
//id,title,ISBN,publishDate,author


module.exports = class Book {
    constructor(_id, ISBN, bookTitle, overdueFee, publisher, datePublished) {
        this._id = _id;
        this.ISBN = ISBN;
        this.bookTitle = bookTitle;
        this.overdueFee = overdueFee;
        this.publisher = publisher;
        this.datePublished = datePublished;

    }
    save() {
        return getDb().collection("books").insertOne(this);
    }
    static findAll() {
        return getDb().collection("books").find().toArray();
    }
    static findById(id) {
        return getDb()
            .collection("books")
            .findOne({ _id: new ObjectID(id) });
    }
    update() {
        return getDb()
            .collection("books")
            .updateOne({ _id: new ObjectID(this._id) }, {
                $set: {
                    ISBN: this.ISBN,
                    bookTitle: this.bookTitle,
                    overdueFee: this.overdueFee,
                    publisher: this.publisher,
                    datePublished: this.datePublished
                },
            });
    }
    static deleteById(id) {
        return getDb()
            .collection("books")
            .deleteOne({ _id: new ObjectID(id) });
    }
};