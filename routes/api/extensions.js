/////////////////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Philippe Leefsma 2014 - ADN/Developer Technical Services
//
// Permission to use, copy, modify, and distribute this software in
// object code form for any purpose and without fee is hereby granted,
// provided that the above copyright notice appears in all copies and
// that both that copyright notice and the limited warranty and
// restricted rights notice below appear in all supporting
// documentation.
//
// AUTODESK PROVIDES THIS PROGRAM "AS IS" AND WITH ALL FAULTS.
// AUTODESK SPECIFICALLY DISCLAIMS ANY IMPLIED WARRANTY OF
// MERCHANTABILITY OR FITNESS FOR A PARTICULAR USE.  AUTODESK, INC.
// DOES NOT WARRANT THAT THE OPERATION OF THE PROGRAM WILL BE
// UNINTERRUPTED OR ERROR FREE.
/////////////////////////////////////////////////////////////////////////////////
var dbConnector = require('../dbConnector');
var config = require('../../config/config-server');
var express = require('express');
var request = require('request');

var router = express.Router();

///////////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////////
var db = null;

dbConnector.initializeDb(config,
  
  function(databse){
    db = databse;
  },
  
  function(error){
    console.log(error);
  });


///////////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////////
router.get('/', function (req, res) {

  getExtensionsAsync(function(arg, items) {

    res.json(items);
  });
});

function getExtensionsAsync(callback) {

  db.collection('gallery.extensions', function (err, collection) {

    collection.find().sort({ name: 1 }).toArray(

      function (err, items) {

        callback(null, items);
      });
  });
}

///////////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////////
router.get('/:extensionId', function (req, res) {

  var extensionId = req.params.extensionId;

  var query = new Object();

  query['id'] = extensionId;

  db.collection('gallery.extensions',
    function (err, collection) {
      collection.find(query).toArray(
        function (err, items) {

          var response = {
            extensions: items
          };

          res.status((items ? 200 : 404));
          res.jsonp(response);
        });
    });
});

///////////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////////
router.post('/', function (req, res) {

  function getFileExt(file) {

    var res = file.name.split('.');

    return res[res.length - 1];
  }

  var error = null;

  var form = new formidable.IncomingForm();

  form.on('field', function(field, value) {

  })

  form.on('file', function(field, file) {

    var ext = getFileExt(file);

    if(ext === 'js' || ext === 'css') {

      var filePath = file.path;

      var uploadPath = path.join(
        __dirname,
        '../www/uploads/extensions/', file.name);

      fs.readFile(filePath, function (err, data) {

        var extensions = findExtensions(data.toString('utf8'));

        if(extensions.length > 0) {

          extensions.forEach(function(id) {

            var idComponents = id.split('.');

            var nameComponents =
              UpperCaseArray(idComponents[idComponents.length - 1]);

            var name = '';

            nameComponents.forEach(function(nameComp){
              name += nameComp + ' ';
            });

            var extension = {
              id: id,
              name: name,
              file: file.name
            };

            getExtensionsByIdAsync(id, function(items) {

              if(items.length === 0) {

                addExtension(extension);
              }
            });
          });

          fs.writeFile(uploadPath, data, function (err) {

            fs.unlink(filePath, function (err) {

              error = err;
            });
          });
        }
      });
    }
  });

  form.on('end', function() {

    if (error) {
      res.status(500);
      res.json({'success': false});

    } else {
      res.status(200);
      res.json({'success': true});
    }
  });

  form.parse(req);
});

//converts extension name in readable format: CustomExt -> Cust Ext
// SGPTest -> SGPTest
function UpperCaseArray(input) {
  var result = input.replace(/([A-Z]+)/g, ",$1").replace(/^,/, "");
  return result.split(",");
}

function addExtension(extension) {

  db.collection('gallery.extensions', function (err, collection) {

    collection.insert(
      extension,
      { safe: true },

      function (err, result) {

      });
  });
}

function getExtensionsByIdAsync(id, callback) {

  var query = new Object();

  query['id'] = id;

  db.collection('gallery.extensions',
    function (err, collection) {
      collection.find(query).toArray(
        function (err, items) {
          callback(items);
        });
    });
}

function findExtensions(str) {

  String.prototype.replaceAll = function (find, replace) {
    var str = this;
    return str.replace(new RegExp(
        find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'),
      replace);
  };

  String.prototype.trim = function () {
    return this.replace(/^\s+/, '').replace(/\s+$/, '');
  };

  var extensions = [];

  var start = 0;

  while(true) {

    start = str.indexOf(
      'theExtensionManager.registerExtension',
      start);

    if(start < 0) {

      return extensions;
    }

    var end = str.indexOf(',', start);

    var substr = str.substring(start, end);

    var ext = substr.replaceAll('theExtensionManager.registerExtension', '').
      replaceAll('\n', '').
      replaceAll('(', '').
      replaceAll('\'', '').
      replaceAll('"', '');

    extensions.push(ext.trim());

    start = end;
  }
}

module.exports = router;