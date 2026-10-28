
const express = require('express');
const axios = require('axios');
const books = require('./booksdb.js');
const { isValid, users } = require('./auth_users.js');

const public_users = express.Router();

public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      message: "Username and password are required"
    });
  }

  if (isValid(username)) {
    return res.status(409).json({
      message: "User already exists"
    });
  }

  users.push({ username, password });

  return res.status(200).json({
    message: "User successfully registered"
  });
});

public_users.get('/', (req, res) => {
  return res.status(200).json(books);
});

public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn]);
  }

  return res.status(404).json({
    message: "Book not found"
  });
});

public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  const result = {};

  for (const isbn in books) {
    if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
      result[isbn] = books[isbn];
    }
  }

  return res.status(200).json(result);
});

public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  const result = {};

  for (const isbn in books) {
    if (books[isbn].title.toLowerCase() === title.toLowerCase()) {
      result[isbn] = books[isbn];
    }
  }

  return res.status(200).json(result);
});

public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;

  if (books[isbn]) {
    return res.status(200).json(books[isbn].reviews);
  }

  return res.status(404).json({
    message: "Book not found"
  });
});

const BASE_URL = 'http://localhost:5000';

const getAllBooks = async () => {
  const response = await axios.get(`${BASE_URL}/`);
  return response.data;
};

const getBookByISBN = async (isbn) => {
  const response = await axios.get(
    `${BASE_URL}/isbn/${encodeURIComponent(isbn)}`
  );
  return response.data;
};

const getBooksByAuthor = async (author) => {
  const response = await axios.get(
    `${BASE_URL}/author/${encodeURIComponent(author)}`
  );
  return response.data;
};

const getBooksByTitle = async (title) => {
  const response = await axios.get(
    `${BASE_URL}/title/${encodeURIComponent(title)}`
  );
  return response.data;
};

module.exports.general = public_users;

const bookAxios = require('axios');
const bookURL = 'http://127.0.0.1:5000';

module.exports.getAllBooks = async () => {
  const response = await bookAxios.get(bookURL + '/');
  return response.data;
};

module.exports.getBookByISBN = async (isbn) => {
  const response = await bookAxios.get(bookURL + '/isbn/' + isbn);
  return response.data;
};

module.exports.getBooksByAuthor = async (author) => {
  const response = await bookAxios.get(
    bookURL + '/author/' + encodeURIComponent(author)
  );
  return response.data;
};

module.exports.getBooksByTitle = async (title) => {
  const response = await bookAxios.get(
    bookURL + '/title/' + encodeURIComponent(title)
  );
  return response.data;
};
