'use strict';
const path =require('path')

var self = module.exports = {
    uploadSingleFile: (req, res) => {
          res.json(req.file)
        // res.sendFile(path.join(`${__dirname}/uploads/${req.file.filename}`));
        // return req.file;
    },
}