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

//This sample is using a sample mongodb hosted on mongolab.com
//You can change to your own mongo database

var configMongoLabs = {

  user: 'user',
  pass: 'pass',
  host: 'host',
  port: 30607,
  db:   'db-name'
}

var configLocalhost = {

  user: '',
  pass: '',
  host: 'localhost',
  port: 27017,
  db:   'NodeViewDb'
}

module.exports = configMongoLabs;
//module.exports = configLocalhost;