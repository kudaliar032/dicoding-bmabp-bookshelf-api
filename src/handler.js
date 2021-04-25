/* eslint-disable max-len */
const {nanoid} = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher,
    pageCount, readPage, reading,
  } = request.payload;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;
  const newBook = {
    id, name, year, author, summary,
    publisher, pageCount, readPage, finished, reading,
    insertedAt, updatedAt,
  };

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  } else {
    books.push(newBook);
    const isSuccess = books.filter((book) => book.id === id).length > 0;

    if (isSuccess) {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
          bookId: id,
        },
      });
      response.code(201);
      return response;
    }
  }

  const response = h.response({
    status: 'error',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);
  return response;
};

const getAllBooksHandler = (request, h) => {
  const {name, reading, finished} = request.query;
  let filteredBooks;

  if (name) {
    filteredBooks = books.filter(({name}) => /dicoding/gi.test(name));
  } else if (reading) {
    if (reading === '1') {
      filteredBooks = books.filter(({reading}) => reading);
    } else {
      filteredBooks = books.filter(({reading}) => !reading);
    }
  } else if (finished) {
    if (finished === '1') {
      filteredBooks = books.filter(({finished}) => finished);
    } else {
      filteredBooks = books.filter(({finished}) => !finished);
    }
  } else {
    filteredBooks = books;
  }

  return {
    status: 'success',
    data: {
      books: filteredBooks.map(({id, name, publisher}) => ({id, name, publisher})),
    },
  };
};

const getBookByIdHander = (request, h) => {
  const {bookId: id} = request.params;

  const book = books.filter((book) => book.id === id)[0];

  if (book) {
    return {
      status: 'success',
      data: {
        book,
      },
    };
  };

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });
  response.code(404);
  return response;
};

const editBookByIdHander = (request, h) => {
  const {bookId: id} = request.params;
  const {
    name, year, author, summary, publisher,
    pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  } else if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  } else {
    const index = books.findIndex((book) => book.id == id);
    if (index !== -1) {
      books[index] = {
        ...books[index],
        name, year, author, summary, publisher,
        pageCount, readPage, reading, updatedAt,
      };

      return {
        status: 'success',
        message: 'Buku berhasil diperbarui',
      };
    }

    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
    response.code(404);
    return response;
  }
};

const deleteBookByIdHandler = (request, h) => {
  const {bookId: id} = request.params;

  const index = books.findIndex((book) => book.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    return {
      status: 'success',
      message: 'Buku berhasil dihapus',
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHander,
  editBookByIdHander,
  deleteBookByIdHandler,
};
