const express = require('express');
var app = express();

const fs = require('fs');



app.get('/:type/:img', (req, res, next) => {
  let type = req.params.type;
  let img = req.params.img;

  let path = `./uploads/${type}/${img}`;

  fs.exists(path, exist => {
    if (!exist) {
      path = './assets/no-image.jpg';
    }

    res.sendfile(path);
  });


});

module.exports = app;