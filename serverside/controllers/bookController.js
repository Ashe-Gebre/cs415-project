/* eslint-disable strict */
/* eslint-disable require-jsdoc */


const Book = require('../models/book');



exports.getAllBook = async(req, res, next) => {

    const books = await Book.findAll();
    res.status(200).json(books);


}



exports.save = async(req, res, next) => {

    try {
        const book = req.body;
        const newBook = await new Book(null, book.ISBN, book.bookTitle, book.overdueFee, book.publisher, book.datePublished).save()

        res.status(201).json(newBook.ops);
    } catch (err) {
        next(err)
    }

}



exports.update = async(req, res, next) => {
    try {
        const id = req.params.id;
        const book = req.body;
        const updateBook = new Book(id, book.ISBN, book.bookTitle, book.overdueFee, book.publisher, book.datePublished);
        await updateBook.update()
        res.status(200).json(updateBook)
    } catch (err) {
        next(err)
    }
}



exports.delete = async(req, res, next) => {
    try {
        await Book.deleteById(req.params.id)
        res.status(200).json({ deleted: "Book successfully deleted!!" })
    } catch (err) {
        next(err)
    }
}



exports.getById = async(req, res, next) => {
    try {
        const book = await Book.findById(req.params.id)
        res.status(200).json(book);
    } catch (err) {
        next(err);
    }
}