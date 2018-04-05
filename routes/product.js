const express = require('express');
const app = express();

const Product = require('../models/product');

//===========================
//GET ALL PRODUCTS
//===========================

app.get('/', (req, res) => {
  Product.find({})
    .populate('user', 'name email')
    .populate('category')
    .exec(
      (err, product) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            msg: 'Error loading product',
            errors: err
          });
        }
        res.status(200).json({
          ok: true,
          product: product
        })
      }
    );

});


//===========================
//GET PRODUCT
//===========================

app.get('/:id', (req, res) => {
  const id = req.params.id;

  Product.findById(id)
    .populate('user', 'name email img')
    .populate('category')
    .exec(
      (err, product) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            msg: 'Error loading product',
            errors: err
          });
        }
        if (!product) {
          return res.status(400).json({
            ok: false,
            message: 'product doesnt exits with this id' + id,
            errors: { message: 'product doesnt exits with this id' + id }
          })
        }
        res.status(200).json({
          ok: true,
          product: product
        })
      }
    );

});

//===========================
//CREATE NEW product
//===========================

app.post('/', (req, res) => {
  var body = req.body;

  let product = new Product({
    sku: body.sku,
    name: body.name,
    description: body.description,
    image: body.image,
    price: body.price,
    available: body.available,
    user: body.user,
    category: body.category
  });

  product.save((err, productSaved) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        msg: 'Failed to add product',
        errors: err
      });
    }
    else {
      res.status(201).json({
        ok: true,
        product: productSaved
      })
    }
  });
});

//===========================
//UPDATE Product
//===========================

app.put('/:id', (req, res) => {
  const id = req.params.id;
  const body = req.body;

  Product.findById(id, (err, product) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: 'Error in searching user',
        errors: err
      });
    }

    if (!product) {
      return res.status(400).json({
        ok: false,
        message: 'product doesnt exits with this id' + id,
        errors: { message: 'product doesnt exits with this id' + id }
      })
    }


    product.name = body.name;
    product.description = body.description;
    product.image = body.image;
    product.price = body.price;
    product.available = body.available;

    product.save((err, productSaved) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: 'error when updating product',
          errors: err

        });
      }

      res.status(201).json({
        ok: true,
        product: productSaved
      });

    });


  });

});


//===========================
//Delete product
//===========================

app.delete('/:id', (req, res) => {
  const id = req.params.id;
  Product.findByIdAndRemove(id, (err, productDeleted) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: 'error erasing product',
        errors: err
      })
    }

    if (!productDeleted) {
      return res.status(400).json({
        ok: false,
        message: 'doesnt exists this product with this id:' + id,
        errors: { message: 'doesnt exists this product with this id:' + id }
      })
    }

    res.status(200).json({
      ok: true,
      product: productDeleted
    });
  })
})

module.exports = app;
