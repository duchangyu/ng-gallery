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
angular.module('Autodesk.ADN.AngularView.View.Upload',
  [
    'ngRoute',
  ])
  
  ///////////////////////////////////////////////////////////////////////
  //
  //
  ///////////////////////////////////////////////////////////////////////
  .config(['$routeProvider', function($routeProvider) {
    
    $routeProvider.when('/upload', {
      templateUrl: './js/ui/views/upload/upload.html',
      controller: 'Autodesk.ADN.AngularView.View.Upload.Controller'
    });
  }])
  
  ///////////////////////////////////////////////////////////////////////////
  //
  //
  ///////////////////////////////////////////////////////////////////////////
  .controller('Autodesk.ADN.AngularView.View.Upload.Controller',
  
  ['$scope', 'AppState',
    function($scope, AppState) {

      AppState.activeView = 'upload';

      AppState.showNavbar = true;

      if(!AppState.isAuthenticated) {

        $scope.$emit('app.onModal', {
          dlgId: '#loginDlg',
          caption: 'This feature requires log in ...'
        });
      }


      ///////////////////////////////////////////////////////////////////////
      //
      //
      ///////////////////////////////////////////////////////////////////////
      var dropzone = document.getElementById('upload-dropzone');

      dropzone.addEventListener('dragover', function (e) {
        e.preventDefault();
        e.currentTarget.classList.add('over-line');
      });

      dropzone.addEventListener('dragleave', function (e) {
        e.preventDefault();
        e.currentTarget.classList.remove('over-line');
      });

      dropzone.addEventListener('drop', function (e) {

        e.stopPropagation();
        e.preventDefault();

        var file = e.dataTransfer.files[0];

        console.log(file);

        if($scope.selectedNode) {

          createFileNode(file, $scope.selectedNode);
        }
        else {

          createFileNode(file);
        }

        e.currentTarget.classList.remove('over-line');
      });

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

      ///////////////////////////////////////////////////////////////////////
      //
      //
      ///////////////////////////////////////////////////////////////////////
      function createFileNode(file, parent) {

        var node = {
          label: file.name,
          children: [],
          parent: parent,
          selectable: true
        }

        if (parent) {

          parent.children.push(node);
        }
        else {

          $scope.nodes.push(node);
        }

        return node;
      }

      ///////////////////////////////////////////////////////////////////////
      //
      //
      ///////////////////////////////////////////////////////////////////////
      $scope.onNodeSelected = function(node, selected) {

        if($scope.selectedNode) {

          $scope.selectedNode.selected = false;

          $scope.selectedNode = null;
        }

        node.selected = selected && node.selectable;

        if(selected && node.selectable) {

          $scope.selectedNode = node;
        }
      }

      ///////////////////////////////////////////////////////////////////////
      //
      //
      ///////////////////////////////////////////////////////////////////////
      $scope.nodes = [];

      $scope.expandedNodes = [];

      $scope.treeOptions = {

        multiSelection: false,
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

    }]);
