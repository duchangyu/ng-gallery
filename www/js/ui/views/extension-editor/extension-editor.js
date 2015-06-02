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

require("../../../directives/viewer-directive");

var config = require("../../../config-client");

angular.module('Autodesk.ADN.AngularView.View.ExtensionEditor',
    [
        'ngRoute',
        'js-data',
        'ngSanitize',
        'ui.select',
        'ui-layout-events',
        'Autodesk.ADN.AngularView.Service.Toolkit',
        'Autodesk.ADN.Toolkit.Viewer.Directive.Viewer',
        'Autodesk.ADN.AngularView.Service.Resource.Model'
    ])

    ///////////////////////////////////////////////////////////////////////////
    //
    //
    ///////////////////////////////////////////////////////////////////////////
    .config(['$routeProvider', function($routeProvider) {
      $routeProvider.when('/extension-editor', {
          templateUrl: './js/ui/views/extension-editor/extension-editor.html',
          controller: 'Autodesk.ADN.AngularView.View.ExtensionEditor.Controller'
      });
    }])

    ///////////////////////////////////////////////////////////////////////////
    //
    //
    ///////////////////////////////////////////////////////////////////////////
    .factory('store', function () {

        var store = new JSData.DS();

        store.registerAdapter(
            'localstorage',
            new DSLocalStorageAdapter(),
            { default: true });

        return store;
    })
    .factory('ExtensionSvc', function (store) {
        return store.defineResource('extension');
    })
    ///////////////////////////////////////////////////////////////////////////
    //
    //
    ///////////////////////////////////////////////////////////////////////////
    .controller('Autodesk.ADN.AngularView.View.ExtensionEditor.Controller',

        ['$scope', '$http', '$sce', 'ExtensionSvc', 'Model', 'Toolkit', 'AppState',
            function($scope, $http, $sce, ExtensionSvc, Model, Toolkit, AppState) {

        ///////////////////////////////////////////////////////////////////
        //
        //
        ///////////////////////////////////////////////////////////////////
        function loadFromId(id) {

            if(id.length) {

                Model.get({ id: id }, function(model) {
                    $scope.docUrn = model.urn;
                });
            }
        }

        ///////////////////////////////////////////////////////////////////
        //
        //
        ///////////////////////////////////////////////////////////////////
        function initializeViewer() {

            $scope.tokenUrl = config.ApiUrl +
                (config.staging ? '/tokenstg' : '/token');

            $scope.viewerContainerConfig = {

                environment: 'AutodeskProduction'
            }

            $scope.viewerConfig = {

                viewerType: 'GuiViewer3D'
                //viewerType: 'Viewer3D'
            }

            var id = Autodesk.Viewing.Private.getParameterByName("id");

            if(id.length) {

                loadFromId(id);
            }
            else {

                $scope.$emit('app.onModal', {
                    dlgId: '#modelsDlg',
                    source: '/extension-editor'
                });
            }
        }

        ///////////////////////////////////////////////////////////////////
        //
        //
        ///////////////////////////////////////////////////////////////////
        $scope.onViewablePath = function (pathInfoCollection) {

            $scope.$broadcast('viewer.viewable-path-loaded', {
                pathInfoCollection: pathInfoCollection
            });

            if (pathInfoCollection.path3d.length > 0) {

                $scope.selectedPath =
                  pathInfoCollection.path3d[0].path;

                return;
            }

            if (pathInfoCollection.path2d.length > 0) {

                $scope.selectedPath =
                  pathInfoCollection.path2d[0].path;

                return;
            }
        }

        ///////////////////////////////////////////////////////////////////
        //
        //
        ///////////////////////////////////////////////////////////////////
        $scope.onViewerInitialized = function (viewer) {

            $scope.viewer = viewer;

            $scope.viewer.resize();
        }

        ///////////////////////////////////////////////////////////////////
        //
        //
        ///////////////////////////////////////////////////////////////////
        $scope.onDestroy = function (viewer) {

            viewer.finish();
        }

        ///////////////////////////////////////////////////////////////////
        //
        //
        ///////////////////////////////////////////////////////////////////
        $scope.$on('ui.layout.resize', function (event, data) {

            resize();
        });

        function resize() {

            $('#viewer-extension-editor').height(
              $('#viewer-extension-editor-container').height());

            if($scope.viewer) {
                $scope.viewer.resize();
            }
        }

        ///////////////////////////////////////////////////////////////////
        //
        //
        ///////////////////////////////////////////////////////////////////
        function initializeEditor() {

            $scope.editor = ace.edit("dynamic-editor");
            $scope.editor.setTheme("ace/theme/chrome");
            $scope.editor.getSession().setMode("ace/mode/javascript");

            $scope.onResetEditor();

            ExtensionSvc.findAll().then(function (extensions) {

                $scope.extensions = extensions;

                if($scope.extensions.length === 0) {

                    ExtensionSvc.create({code:''});
                }
                else {

                    var code = $scope.extensions[0].code;

                    console.log($scope.extensions[0])

                    $scope.editor.setValue(code, 1);
                }
            });

            ExtensionSvc.bindAll({}, $scope, 'extensions');

            $scope.editor.on('input', function() {

                var code = $scope.editor.getValue();

                $scope.extensions[0].code = code;

                ExtensionSvc.update(
                  $scope.extensions[0].id,
                  {
                      label: 'edit',
                      name: 'edit',
                      code:code
                  })
            });
        }

        ///////////////////////////////////////////////////////////////////
        //
        //
        ///////////////////////////////////////////////////////////////////
        $scope.onResetEditor = function() {

            var defaultCode = [

                '///////////////////////////////////////////////////////////////////////',
                '// Basic viewer extension',
                '//',
                '///////////////////////////////////////////////////////////////////////',
                'AutodeskNamespace("Autodesk.ADN.Viewing.Extension");',
                '',
                'Autodesk.ADN.Viewing.Extension.Basic = function (viewer, options) {',
                '',
                '   Autodesk.Viewing.Extension.call(this, viewer, options);',
                '',
                '   var _this = this;',
                '',
                '   _this.load = function () {',
                '',
                '       alert("Autodesk.ADN.Viewing.Extension.Basic loaded");',
                '',
                '       viewer.setBackgroundColor(255,0,0, 255,255, 255);',
                '',
                '       return true;',
                '   };',
                '',
                '   _this.unload = function () {',
                '',
                '       viewer.setBackgroundColor(3,4,5, 250, 250, 250);',
                '',
                '       alert("Autodesk.ADN.Viewing.Extension.Basic unloaded");',
                '',
                '       Autodesk.Viewing.theExtensionManager.unregisterExtension(',
                '           "Autodesk.ADN.Viewing.Extension.Basic");',
                '',
                '       return true;',
                '   };',
                '};',
                '',
                'Autodesk.ADN.Viewing.Extension.Basic.prototype =',
                '   Object.create(Autodesk.Viewing.Extension.prototype);',
                '',
                'Autodesk.ADN.Viewing.Extension.Basic.prototype.constructor =',
                '   Autodesk.ADN.Viewing.Extension.Basic;',
                '',
                'Autodesk.Viewing.theExtensionManager.registerExtension(',
                '   "Autodesk.ADN.Viewing.Extension.Basic",',
                '   Autodesk.ADN.Viewing.Extension.Basic);'
              ];

            $scope.editor.setValue(defaultCode.join('\n'), 1);
        }

        ///////////////////////////////////////////////////////////////////
        //
        //
        ///////////////////////////////////////////////////////////////////
        function extractExtensionIds(str) {

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

                var ext = substr.replaceAll(
                  'theExtensionManager.registerExtension', '').
                    replaceAll('\n', '').
                    replaceAll('(', '').
                    replaceAll('\'', '').
                    replaceAll('"', '');

                extensions.push(ext.trim());

                start = end;
            }
        }

        ///////////////////////////////////////////////////////////////////
        //
        //
        ///////////////////////////////////////////////////////////////////
        function extractExtensionNameFromId(extId) {

            function UpperCaseArray(input) {
                var result = input.replace(/([A-Z]+)/g, ",$1").replace(/^,/, "");
                return result.split(",");
            }

            var idComponents = extId.split('.');

            var nameComponents =
              UpperCaseArray(idComponents[idComponents.length - 1]);

            var name = '';

            nameComponents.forEach(function(nameComp){
                name += nameComp + ' ';
            });

            return name;
        }

        ///////////////////////////////////////////////////////////////////
        //
        //
        ///////////////////////////////////////////////////////////////////
        $scope.onLoadExtension = function() {

            var code = $scope.editor.getValue();

            var extIds = extractExtensionIds(code);

            var res = eval(code);

            if(res) {

                loadExtensions(extIds);
            }
        }

        ///////////////////////////////////////////////////////////////////
        //
        //
        ///////////////////////////////////////////////////////////////////
        $scope.onUnloadExtension = function() {

            $scope.loadedExtIds.forEach(function(extId) {

                $scope.viewer.unloadExtension(extId);
            });

            $scope.loadedExtIds = [];
        }

        ///////////////////////////////////////////////////////////////////
        //
        //
        ///////////////////////////////////////////////////////////////////
        function loadExtensions(extIds) {

            if($scope.viewer) {

                extIds.forEach(function(extId) {

                    $scope.viewer.loadExtension(extId);

                    $scope.loadedExtIds.push(extId);
                });
            }
        }

        ///////////////////////////////////////////////////////////////////
        //
        //
        ///////////////////////////////////////////////////////////////////
        AppState.activeView = 'extension-editor';

        $scope.loadedExtIds = [];

        $scope.viewer = null;

        $scope.height = 500;

        initializeViewer();

        initializeEditor();
    }]);



