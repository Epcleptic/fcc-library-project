/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";

const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Book(title, comments, commentcount)

const Book = mongoose.model(
  "Book",
  new mongoose.Schema({
    title: {
      type: String,
      requiredd: true,
    },
    comments: [String],
    commentcount: Number,
  })
);

module.exports = function (app) {
  app
    .route("/api/books")
    .get(async function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      const books = await Book.find({});
      res.status(200);
      res.json(books);
    })

    .post(async function (req, res) {
      let title = req.body.title;
      //response will contain new book object including atleast _id and title
      if (!title) {
        res.status(404);
        res.send("missing required field title");
      } else {
        const book = await Book.create({
          title: title,
          comments: [],
          commentcount: 0,
        });
        res.json(book);
      }
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
    });

  app
    .route("/api/books/:id")
    .get(async function (req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      const book = await Book.findById(bookid);
      if (!book) {
        res.status(404);
        res.send("no book exists");
      } else {
        res.status(200);
        res.json(book);
      }
    })

    .post(async function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
      const book = await Book.findById(bookid);
      if (!book) {
        res.status(404);
        res.send("no book exists");
      } else if (!comment) {
        res.status(404);
        res.send("missing required field comment");
      } else {
        book.comments.push(comment);
        book.commentcount += 1;
        await book.save();
        res.status(200);
        res.json(book);
      }
    })

    .delete(async function (req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      const book = await Book.findById(bookid);
      if (!book) {
        res.status(404);
        res.send("no book exists");
      } else {
        await book.delete();
        res.status(200);
        res.send("delete successful");
      }
    });
};
