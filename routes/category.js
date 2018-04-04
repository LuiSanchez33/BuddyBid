const express = require('express');
var app = express();

const Category = require('../models/category');

//===========================
//GET CATEGORIES
//===========================

app.get('/', (req, res) => {
  Category.find({})
    .populate('user', 'name email')
    .exec(
      (err, category) => {
        if (err) {
          return res.status(500).json({
            ok: false,
            msg: 'Error loading category',
            errors: err
          });
        }
        res.status(200).json({
          ok: true,
          category: category
        })
      }
    );

});

//===========================
//CREATE NEW CATEGORY
//===========================

app.post('/', (req, res) => {
  let category = new Category({
    type: req.body.type,
    user: req.body.user
  });

  category.save((err, categorySaved) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        msg: 'Failed to add category',
        errors: err
      });
    }
    else {
      res.status(201).json({
        ok: true,
        category: categorySaved
      })
    }
  });
});

//===========================
//UPDATE Categories
//===========================

app.put('/:id', (req, res) => {
  const id = req.params.id;
  const body = req.body;

  Category.findById(id, (err, category) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: 'Error in searching user',
        errors: err
      });
    }

    if (!category) {
      return res.status(400).json({
        ok: false,
        message: 'Category doesnt exits with this id' + id,
        errors: { message: 'Category doesnt exits with this id' + id }
      })
    }

    category.type = body.type;
    category.user = body.user;

    category.save((err, categorySaved) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          message: 'error when updating category',
          errors: err

        });
      }

      res.status(201).json({
        ok: true,
        category: categorySaved
      });

    });


  });

});


//===========================
//Delete Category
//===========================

app.delete('/:id', (req, res) => {
  const id = req.params.id;
  Category.findByIdAndRemove(id, (err, categoryDeleted) => {
    if (err) {
      return res.status(500).json({
        ok: false,
        message: 'error erasing category',
        errors: err
      })
    }

    if (!categoryDeleted) {
      return res.status(400).json({
        ok: false,
        message: 'doesnt exists this category with this id:' + id,
        errors: { message: 'doesnt exists this category with this id:' + id }
      })
    }

    res.status(200).json({
      ok: true,
      category: categoryDeleted
    });
  })
})

module.exports = app;
