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
var mongo = require('mongodb');

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
router.get('/:modelId', function (req, res) {

  var modelId = req.params.modelId;

  db.collection('gallery.thumbnails',

    function (err, collection) {

      collection.findOne(

        { 'modelId': new mongo.ObjectID(modelId) },

        function (err, item) {

          var response = {
            thumbnail: item
          };

          res.status((item ? 200 : 404));
          res.jsonp(response);
        });
    });
});

///////////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////////
router.get('/', function (req, res) {

  db.collection('gallery.thumbnails',

    function (err, collection) {

      collection.find().toArray(

        function (err, items) {

          var response = (items ? items : []);

          res.jsonp(response);
        });
    });
});

///////////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////////
router.post('/', function (req, res) {

  var item = req.body;

  db.collection('gallery.thumbnails', function (err, collection) {
    collection.insert(
      item,
      { safe: true },
      function (err, result) {

      });
  });
});

module.exports = router;