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
require("../../../../lib/bower_components/ace/ace");
require("../../../../lib/bower_components/ace/theme-chrome");
require("../../../../lib/bower_components/ace/mode-javascript");

angular.module('Autodesk.ADN.AngularView.View.ExtensionEditor',
    [
      'ngRoute',
      'js-data',
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

        ['$scope', '$http', 'ExtensionSvc', 'Model', 'Toolkit',
            function($scope, $http, ExtensionSvc, Model, Toolkit) {

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

            $scope.tokenUrl = $scope.API_URL +
                ($scope.staging ? 'tokenstg' : 'token');

            $scope.viewerContainerConfig = {

                environment: 'AutodeskProduction'
            }

            $scope.viewerConfig = {

                viewerType: 'GuiViewer3D'
                //viewerType: 'Viewer3D'
            }

            loadFromId(Autodesk.Viewing.Private.getParameterByName("id"));
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

                    $scope.editor.setValue(code, 1);
                }
            });

            ExtensionSvc.bindAll({}, $scope, 'extensions');

            $scope.editor.on('input', function() {

                var code = $scope.editor.getValue();

                $scope.extensions[0].code = code;

                ExtensionSvc.update($scope.extensions[0].id, {code:code})
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

        ///////////////////////////////////////////////////////////////////
        //
        //
        ///////////////////////////////////////////////////////////////////
        $scope.onLoadExtension = function() {

        }

        ///////////////////////////////////////////////////////////////////
        //
        //
        ///////////////////////////////////////////////////////////////////
        function loadExtensions(extIds) {

            if($scope.viewer) {

                extIds.forEach(function(extId) {

                    $scope.viewer.loadExtension(extId);

                    addDropdownItem(extId);
                });

            }
        }

        ///////////////////////////////////////////////////////////////////
        //
        //
        ///////////////////////////////////////////////////////////////////
        function unloadExtension(extId) {

            $scope.viewer.unloadExtension(extId);
        }

        ///////////////////////////////////////////////////////////////////
        //
        //
        ///////////////////////////////////////////////////////////////////
        function initializeLayout () {

            var pstyle = 'border: 1px solid #dfdfdf;';

            var layout = Toolkit.newGUID();

            $('#layout-container').w2layout({
                name: layout,
                padding: 4,
                panels: [
                    {type: 'main', content: $('#viewer-dynamic')},
                    //{ type: 'top', size: 30, resizable: false, style: pstyle, content: '' },
                    {type: 'bottom', size: 30, resizable: false, style: pstyle, content: ''},
                    {
                        type: 'right', size: '45%', resizable: true, style: pstyle, content: $('#editor'),

                        toolbar: {
                            items: [
                                {
                                    type: 'button',
                                    id: 'bLoad',
                                    caption: 'Load',
                                    icon: 'w2ui-icon-plus',
                                    hint: 'Load'
                                },
                                {type: 'break', id: 'break0'},
                                {
                                    type: 'button',
                                    id: 'bUnload',
                                    caption: 'Unload ExtensionSvc:',
                                    icon: 'w2ui-icon-cross',
                                    hint: 'Unload'
                                },
                                { type: 'html',  id: 'item6', html:

                                    $('#extDropdownDivId').html()
                                    //'<input type="list">'
                                },
                                {type: 'break', id: 'break1'},
                                {
                                    type: 'button',
                                    id: 'bReset',
                                    caption: 'Reset',
                                    icon: 'w2ui-icon-reload',
                                    hint: 'Reset'
                                }
                            ],
                            onClick: function (event) {

                                switch (event.target) {

                                    case 'bLoad':

                                        var code = $scope.editor.getValue();

                                        var extensions = findExtensions(code);

                                        var res = eval(code);

                                        if(res) {

                                            loadExtensions(extensions);
                                        }

                                        break;

                                    case 'bUnload':

                                        var extId = $("#extDropdownId option:selected").val();

                                        unloadExtension(extId);


                                        var id = $("#extDropdownId option:selected").attr('id');

                                        removeDropdownItem(id);

                                        break;

                                    case 'bReset':
                                        onResetEditor();
                                        break;
                                }
                            }
                        }
                    }
                ]
            });

            /*w2ui[layout].on('resize', function (event) {

                event.onComplete = function () {

                    if ($scope.viewer)
                        $scope.viewer.resize();
                }
            });*/
        }

        function addDropdownItem(extId) {

            var idComponents = extId.split('.');

            var nameComponents =
                idComponents[idComponents.length - 1].
                    match(/[A-Z]?[a-z]+|[0-9]+/g);

            var name = '';

            nameComponents.forEach(function(nameComp){
                name += nameComp + ' ';
            });

            var option = '<option id=' + Toolkit.newGUID() +
                ' value=' + extId + '>' + name +
                '</option>';

            $("#extDropdownId").append(option);
        }

        function removeDropdownItem(id) {

            $("#" + id).remove();
        }

        ///////////////////////////////////////////////////////////////////
        //
        //
        ///////////////////////////////////////////////////////////////////
        $scope.$parent.activeView = 'extension-editor';

        $scope.viewer = null;

        $scope.height = 500;

        initializeViewer();
        initializeEditor();
    }]);



