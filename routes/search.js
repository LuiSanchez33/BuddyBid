const express = require('express');
var app = express();

const Product = require('../models/product');
const Category = require('../models/category');
const User = require('../models/user');

app.get('/collection/:source/:search', (req, res) => {

  const search = req.params.search;
  const source = req.params.source;
  const regex = new RegExp(search, 'i');

  let promise;

  switch (source) {
    case 'user':


      promise = searchUser(search, regex);
      break;
    case 'product':
      promise = searchProduct(search, regex);
      break;
    case 'category':
      promise = searchCategory(search, regex);
      break;

    default:
      res.status(400).json({
        ok: false,
        message: 'The search types are: users,product,category',
        error: { message: 'Type of search/collection invalid!' }
      });
  }

  promise.then(data => {
    res.status(200).json({
      ok: true,
      [source]: data
    })
  })

});

let searchUser = (search, regex) => {

  return new Promise((resolve, reject) => {
    User.find({ name: regex }, (err, users) => {
      if (err) {
        reject('Error loading users', err);
      } else {
        resolve(users);
      }
    })
  })

}

let searchProduct = (search, regex) => {

  return new Promise((resolve, reject) => {
    //{ name: regex }
    Product.find()
      .or([{ 'name': regex }, { 'sku': regex }])
      .populate('user', 'name email')
      .populate('category')
      .exec(
        (err, products) => {
          if (err) {
            reject('Error loading users', err);
          } else {
            resolve(products);
          }
        })
  })

}

let searchCategory = (search, regex) => {

  return new Promise((resolve, reject) => {
    Category.find({ type: regex })
      .populate('user', 'name email')
      .exec(
        (err, categories) => {
          if (err) {
            reject('Error loading users', err);
          } else {
            resolve(categories);
          }
        })
  })

}

module.exports = app;