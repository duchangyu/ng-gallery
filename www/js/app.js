///////////////////////////////////////////////////////////////////////////////
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
///////////////////////////////////////////////////////////////////////////////
'use strict';

//config
var config = require("./config-client");

// UI
require("./ui/views/home/home");
require("./ui/dialogs/about/about");
require("./ui/dialogs/embed/embed");
require("./ui/dialogs/models/models");
require("./ui/views/upload/upload");
require("./ui/views/viewer/viewer");
require("./ui/views/extensions/extensions");
require("./ui/navbars/app-navbar/app-navbar");
require("./ui/views/extension-editor/extension-editor");

// Directives
require("./directives/spinning-img-directive");

// Services
require("./services/view.and.data-service");
require("./services/extension-service");
require("./services/thumbnail-service");
require("./services/toolkit-service");
require("./services/model-service");

///////////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////////
angular.module('Autodesk.ADN.AngularView.Main',
    [
        // Angular
        'ngRoute',

        // Libs
        'ui.layout',
        'ngMdIcons',
        'ngResource',
        'ui.bootstrap',
        'mgcrea.ngStrap',

        // Views
        'Autodesk.ADN.AngularView.View.Home',
        'Autodesk.ADN.AngularView.View.Viewer',
        'Autodesk.ADN.AngularView.View.Upload',
        'Autodesk.ADN.AngularView.View.Extensions',
        'Autodesk.ADN.AngularView.View.ExtensionEditor',

        // UI
        'Autodesk.ADN.AngularView.Navbar.AppNavbar',
        'Autodesk.ADN.AngularView.Dialog.Models',
        'Autodesk.ADN.AngularView.Dialog.Embed',

        // Directives
        'Autodesk.ADN.Toolkit.UI.Directive.SpinningImg',

        //Services
        'Autodesk.ADN.AngularView.Service.Toolkit',
        'Autodesk.ADN.Toolkit.ViewData.Service.ViewAndData',
        'Autodesk.ADN.AngularView.Service.Resource.Extension',
    ])

    ///////////////////////////////////////////////////////////////////////////
    //
    //
    ///////////////////////////////////////////////////////////////////////////
    .controller('Autodesk.ADN.AngularView.Main.Controller',
        ['$scope', function($scope) {

        $scope.activeView = '';

        $scope.staging = false;

        $scope.showNavbar = true;

        $scope.API_URL =  "http://" +
            window.location.host +
            config.host + '/api/';

        requirejs.config({
            waitSeconds: 0
        });
    }])

    ///////////////////////////////////////////////////////////////////////////
    //
    //
    ///////////////////////////////////////////////////////////////////////////
    .config(
        ['$routeProvider', 'ViewAndDataProvider',
          function ($routeProvider, ViewAndDataProvider)
        {
            $routeProvider.otherwise({redirectTo: '/home'});

            ViewAndDataProvider.setTokenUrl(
                "http://" +
                window.location.host +
                config.host + '/api/token');
        }]);

