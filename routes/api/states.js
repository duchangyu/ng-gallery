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
var dbConnector = require('../../dbConnector');
var config = require('../../config-server');
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

//////////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////////
router.get('/:modelId', function (req, res) {

  var modelId = req.params.modelId;

  if (modelId.length !== 24) {
    res.status(404);
    res.send(null);
    return;
  }

  db.collection('gallery.models', function (err, collection) {

    collection.findOne(
      { '_id': new mongo.ObjectId(modelId) },
      { states: 1},
      function (err, model) {

        res.status((model ? 200 : 404));
        res.json(model.states);
      });
  });
});

///////////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////////
router.put('/:modelId', function (req, res) {

  var modelId = req.params.modelId;

  var data = req.body;

  db.collection('gallery.models', function (err, collection) {

    collection.findOne(
      { '_id': new mongo.ObjectId(modelId) },
      { states: 1},
      function (err1, model) {

        model.states.push(data.state);

        collection.update(
          { '_id': new mongo.ObjectID(modelId) },
          { $set: {"states": model.states}},
          { safe: true },
          function (err2, cmdResult) {

            res.json(model.states);
          });
      });
  });
});

///////////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////////
router.delete('/:modelId/:guid', function (req, res) {

  var modelId = req.params.modelId;

  var guid = req.params.guid;

  db.collection('gallery.models', function (err, collection) {

    collection.findOne(
      { '_id': new mongo.ObjectId(modelId) },
      { states: 1},
      function (err1, model) {

        //removes states from item.states
        for(var i=0; i<model.states.length; ++i) {

          var stateObj = JSON.parse(model.states[i]);

          if(guid === stateObj.guid){
            model.states.splice(i, 1);
            break;
          }
        };

        collection.update(
          { '_id': new mongo.ObjectID(modelId) },
          { $set: {"states": model.states}},
          { safe: true },
          function (err2, cmdResult) {

            res.json(model.states);
          });
      });
  });
});

module.exports = router;
