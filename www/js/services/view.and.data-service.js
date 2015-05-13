///////////////////////////////////////////////////////////////////////////////
// Copyright (c) Autodesk, Inc. All rights reserved
// Written by Philippe Leefsma 2015 - ADN/Developer Technical Services
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
///////////////////////////////////////////////////////////////////////////////
'use strict';

var config = require("../config-client");

angular.module('Autodesk.ADN.Toolkit.ViewData.Service.ViewAndData', []).

    provider('ViewAndData', {

        tokenUrl: "",

        setTokenUrl: function(url) {

            this.tokenUrl = url
        },

        $get: function() {

            return {

                client: new Autodesk.ADN.Toolkit.ViewData.AdnViewDataClient(
                    config.viewAndDataUrl,
                    this.tokenUrl)
            }
        }
    });
