const express = require('express');

const fileUpload = require('express-fileupload');
const fs = require('fs');

const app = express();

let Product = require('../models/product');
let User = require('../models/user');
let Category = require('../models/category');

//default options
app.use(fileUpload());

app.put('/:type/:id', (req, res, next) => {

  let type = req.params.type;
  let id = req.params.id;

  //types of collection
  const typesValids = ['categories', 'products', 'users'];
  if (typesValids.indexOf(type) < 0) {
    return res.status(400).json({
      ok: false,
      message: 'Is not collection type valid',
      errors: { message: 'Must select a type valid' }
    });
  }

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      message: 'Dont select anything',
      errors: { message: 'Must to select a image' }
    });
  }

  // Get name of the file
  let file = req.files.image;
  let nameShort = file.name.split('.');
  let extensionFile = nameShort[nameShort.length - 1];

  //Valid extensions : png,jpg,gif,jpeg
  const extensionsValids = ['png', 'jpg', 'gif', 'jpeg'];

  if (extensionsValids.indexOf(extensionFile) < 0) {
    return res.status(400).json({
      ok: false,
      message: 'Extension not valid',
      errors: { message: 'Select a valid extension : ' + extensionsValids.join(', ') }
    });
  }

  //Custom File Name
  //1231231231-123.png
  let nameFile = `${id}-${new Date().getMilliseconds()}.${extensionFile}`

  //Move to path
  let path = `./uploads/${type}/${nameFile}`;

  file.mv(path, err => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: 'Error moving file',
        errors: err
      });
    }

  })

  uploadForType(type, id, nameFile, res);


});

uploadForType = (type, id, nameFile, res) => {
  if (type === 'users') {
    User.findById(id, (err, user) => {
      let pathOld = './uploads/users/' + user.img;

      //If exist, delete the previous img
      if (fs.existsSync(pathOld)) {
        fs.unlink(pathOld);
      }

      user.img = nameFile;
      user.save((err, userUpdated) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            message: 'error when updating user',
            errors: err
          });
        }

        return res.status(200).json({
          ok: true,
          message: 'Image of User updated!',
          user: userUpdated
        });
      })

    })
  }

  if (type === 'categories') {
    Category.findById(id, (err, category) => {
      let pathOld = './uploads/categories/' + category.img;

      //If exist, delete the previous img
      if (fs.existsSync(pathOld)) {
        fs.unlink(pathOld);
      }

      category.img = nameFile;
      category.save((err, categoryUpdated) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            message: 'error when updating user',
            errors: err
          });
        }

        return res.status(200).json({
          ok: true,
          message: 'Image of Category updated!',
          category: categoryUpdated
        });
      })

    })
  }

  if (type === 'products') {
    Product.findById(id, (err, product) => {
      if (!product) {
        return res.status(400).json({
          ok: false,
          message: 'Product doesnt exist',
          err: { message: 'Product not exists' }
        })
      }

      let pathOld = './uploads/products/' + product.image;
      if (fs.existsSync(pathOld)) {
        fs.unlink(pathOld);
      }

      product.image = nameFile;
      product.save((err, productUpdated) => {
        if (err) {
          return res.status(400).json({
            ok: false,
            message: 'error when updating product',
            errors: err
          });
        }

        return res.status(200).json({
          ok: true,
          message: 'Image of Product updated!',
          product: productUpdated
        });
      })

    })
  }
}

module.exports = app;