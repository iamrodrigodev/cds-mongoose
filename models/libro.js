const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  authors: {
    type: [String],
    required: true,
  },
  genres: {
    type: [String],
    required: true,
  },
  pages: {
    type: Number,
    required: true,
    min: [1, 'El número de páginas debe ser mayor que 0'],
  },
  publicationDate: {
    type: Date,
    required: true,
  },
});

const Book = mongoose.model("Book", BookSchema);

module.exports = { Book };