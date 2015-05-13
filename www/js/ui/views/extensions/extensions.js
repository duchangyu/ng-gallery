///////////////////////////////////////////////////////////////////////////
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
///////////////////////////////////////////////////////////////////////////
'use strict';

//////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////
angular.module('Autodesk.ADN.AngularView.View.Extensions',
  [
    'ngRoute',
  ])

  ///////////////////////////////////////////////////////////////////////
  //
  //
  ///////////////////////////////////////////////////////////////////////
  .config(['$routeProvider', function($routeProvider) {

    $routeProvider.when('/extensions', {
      templateUrl: './js/ui/views/extensions/extensions.html',
      controller: 'Autodesk.ADN.AngularView.View.Extensions.Controller'
    });
  }])

  ///////////////////////////////////////////////////////////////////////////
  //
  //
  ///////////////////////////////////////////////////////////////////////////
  .controller('Autodesk.ADN.AngularView.View.Extensions.Controller',

  ['$scope', 'Extension',
    function($scope, Extension) {

      $scope.$parent.activeView = 'extensions';

      $scope.$parent.showNavbar = true;


      $scope.extensionNodes = [];

      $scope.expandedExtensionNodes = [];

      $scope.treeOptions = {

        multiSelection: true,
        nodeChildren: "children",
        dirSelectable: true,

        injectClasses: {
          "ul": "c-ul",
          "li": "c-li",
          "liSelected": "c-liSelected",
          "iExpanded": "c-iExpanded",
          "iCollapsed": "c-iCollapsed",
          "iLeaf": "c-iLeaf",
          "label": "c-label",
          "labelSelected": "c-labelSelected"
        }
      }

      ///////////////////////////////////////////////////////////////////////
      //
      //
      ///////////////////////////////////////////////////////////////////////
      function createNode(label, parent) {

        var node = {
          label: label,
          children: [],
          parent: parent,
          selectable: false
        }

        if (parent)
          parent.children.push(node);

        return node;
      }

      function createExtensionNode(extension, parent) {

        var node = {
          label: extension.name,
          children: [],
          parent: parent,
          selectable: false
        }

        if (parent)
          parent.children.push(node);

        return node;
      }

      ///////////////////////////////////////////////////////////////////
      //
      //
      ///////////////////////////////////////////////////////////////////
      function loadExtensions() {

        $scope.extensionNodes = [];

        Extension.query(function (extensions) {

          var root = {
            label: 'Extensions',
            children:[]
          }

          $scope.extensionNodes.push(root);

          extensions.forEach(function (extension) {

            createExtensionNode(extension, root);
          });
        });
      }

      loadExtensions();
    }]);

