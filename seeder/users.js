const bcrypt = require("bcryptjs")
// const ObjectId = require("mongodb").ObjectId;
const {ObjectId} = require('mongodb');
const objectId = new ObjectId('625add3d78fb449f9d9fe2ee');

const users = [
      {
    name: 'admin',
    lastName: 'admin',
    email: 'admin@admin.com',
    password: bcrypt.hashSync('admin@admin.com', 10),
          role: 'user',
  },
  {
      _id: objectId,
    name: 'John',
    lastName: 'Doe',
    email: 'john@doe.com',
    password: bcrypt.hashSync('john@doe.com', 10),
  },
]

module.exports = users