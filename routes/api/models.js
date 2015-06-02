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

  if (modelId.length !== 24) {
    res.status(404);
    res.send(null);
    return;
  }

  db.collection('gallery.models', function (err, collection) {

    collection.findOne(

      { '_id': new mongo.ObjectId(modelId) },
      { name: 1, urn: 1},

      function (err, model) {

        res.status((model ? 200 : 404));
        res.json(model);
      });
  });
});

///////////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////////
router.get('/', function (req, res) {

  var pageQuery = {
    name:1,
    urn:1
  };

  var fieldQuery = {};

  if (typeof req.query.skip !== 'undefined')
    pageQuery.skip = req.query.skip;

  if (typeof req.query.limit !== 'undefined')
    pageQuery.limit = req.query.limit;

  if (typeof req.query.field !== 'undefined' &&
    typeof req.query.value !== 'undefined') {

    var field = req.query.field;

    var value = req.query.value;

    //case insensitive search
    var exp = ["^", value, "$"].join("");

    fieldQuery[field] = new RegExp(exp, "i");
  }

  db.collection('gallery.models', function (err, collection) {
    collection.find(fieldQuery, pageQuery)
      .sort({ name: 1 }).toArray(

      function (err, items) {

        var response = items;

        if(err) {
          res.status(204); //HTTP 204: NO CONTENT
          res.err = err;
        }

        res.json(response);
      });
  });
});

/*//////////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////////
router.param('modelId', function(req, res, next, modelId) {

  var modelId = req.params.modelId;

  if (modelId.length !== 24) {
    res.status(404);
    res.send(null);
    return;
  }

  db.collection('gallery.models', function (err, collection) {

    collection.findOne(

      { '_id': new mongo.ObjectId(modelId) },
      { },

      function (err, item) {

        if (err)
          return next(err);

        req.model = item;
        next();
      });
  });
});


///////////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////////
router.get('/:modelId/states', function (req, res) {

  res.json(req.model.states);
});

///////////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////////
router.put('/:modelId/states', function (req, res) {

  var data = req.body;

  var model = req.model;

  model.states.push(data.state);

  db.collection('gallery.models', function (err, collection) {

    collection.update(
      { '_id': model._id },
      { $set: {"states": model.states}},
      { safe: true },
      function (err, cmdResult) {

        res.json(model.states);
      });
  });
});

///////////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////////
router.delete('/:modelId/states/:guid', function (req, res) {

  var model = req.model;

  var guid = req.params.guid;

  //removes states from model.states
  for(var i=0; i<model.states.length; ++i) {

    var stateObj = JSON.parse(model.states[i]);

    if(guid === stateObj.guid){
      model.states.splice(i, 1);
      break;
    }
  };

  db.collection('gallery.models', function (err, collection) {

    collection.update(
      { '_id': model._id },
      { $set: {"states": model.states}},
      { safe: true },
      function (err, cmdResult) {

        res.json(model.states);
      });
  });
});

///////////////////////////////////////////////////////////////////////////////
// Used to migrate the data model
//
///////////////////////////////////////////////////////////////////////////////
router.get('/migrate', function (req, res) {

  db.collection('gallery.models', function (err, collection) {
    collection.find().toArray(

      function (err, items) {

        items.forEach(function(item){

          item.states = [];

          collection.update(
            { '_id': item._id },
            item,
            { safe: true },
            function (err2, result) {

            });
        });

        res.send('ok');
      });
  });
});*/

module.exports = router;
