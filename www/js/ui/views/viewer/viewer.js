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

require("../../../extensions/Autodesk.ADN.Viewing.Extension.ExtensionManager.js");
require("../../../extensions/Autodesk.ADN.Viewing.Extension.AnimationManager.js");
require("../../../extensions/Autodesk.ADN.Viewing.Extension.StateManager.js");
require("../../../extensions/Autodesk.ADN.Viewing.Extension.EmbedManager.js");
require("../../navbars/viewer-navbar/viewer-navbar");
require("../../../directives/viewer-directive");
require("../../controls/treeview/treeview");

var configClient = require("../../../config-client");

///////////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////////
angular.module('Autodesk.ADN.AngularView.View.Viewer',
    [
        'ngRoute',
        'treeControl',
        'Autodesk.ADN.AngularView.Control.Treeview',
        'Autodesk.ADN.Toolkit.Viewer.Directive.Viewer',
        'Autodesk.ADN.AngularView.Navbar.ViewerNavbar',
        'Autodesk.ADN.AngularView.Service.Toolkit',
        'Autodesk.ADN.AngularView.Service.Resource.Model'
    ])

    ///////////////////////////////////////////////////////////////////////
    //
    //
    ///////////////////////////////////////////////////////////////////////
    .config(['$routeProvider',

        function($routeProvider) {

            $routeProvider.when('/viewer', {
                templateUrl: './js/ui/views/viewer/viewer.html',
                controller: 'Autodesk.ADN.AngularView.View.Viewer.Controller'
            });
        }])

    ///////////////////////////////////////////////////////////////////////////
    //
    //
    ///////////////////////////////////////////////////////////////////////////
    .controller('Autodesk.ADN.AngularView.View.Viewer.Controller',

        ['$scope', '$timeout', 'Model', 'Toolkit', 'Extension', 'AppState',
            function($scope, $timeout, Model, Toolkit, Extension, AppState) {

                ///////////////////////////////////////////////////////////////////
                //
                //
                ///////////////////////////////////////////////////////////////////
                function loadFromId(id) {

                    if(id.length) {

                        Model.get({ id: id }, function(model) {
                            $scope.docUrn = model.urn;
                            $scope.currentModel = model;
                        });
                    }
                }

                ///////////////////////////////////////////////////////////////////
                //
                //
                ///////////////////////////////////////////////////////////////////
                function initializeView() {

                    $scope.tokenUrl = configClient.ApiURL +
                        (configClient.staging ? '/tokenstg' : '/token');

                    $( window ).resize(function() {
                        $timeout(function(){
                            resize($scope.viewerLayoutMode);
                        }, 500);
                    });

                    $scope.onGeometryLoaded = function (event) {

                        var viewer = event.target;

                        resize($scope.viewerLayoutMode);

                        var ctrlGroup = Toolkit.getGalleryControlGroup(viewer);

                        var viewerNavbarBtn = Toolkit.createButton(
                          'Autodesk.ADN.Gallery.Viewer.Button.Navbar',
                          'glyphicon glyphicon-modal-window',
                          'Viewer Navbar',
                          onViewerNavbarBtnClicked);

                        ctrlGroup.addControl(viewerNavbarBtn);

                        viewer.loadExtension(
                          'Autodesk.ADN.Viewing.Extension.AnimationManager');

                        viewer.loadExtension(
                          'Autodesk.ADN.Viewing.Extension.ExtensionManager',
                          {
                              apiUrl: configClient.ApiURL + '/extensions',
                              extensionsUrl: configClient.host + '/uploads/extensions'
                          });

                        viewer.loadExtension(
                          'Autodesk.ADN.Viewing.Extension.StateManager',
                          {
                              apiUrl: configClient.ApiURL +
                                '/states/' +
                                $scope.currentModel._id
                          });

                        viewer.loadExtension(
                          'Autodesk.ADN.Viewing.Extension.EmbedManager');

                        $scope.$broadcast('viewer.geometry-loaded', {
                            viewer: event.target
                        });

                        viewer.unloadExtension("Autodesk.Section");
                    }

                    $scope.onViewablePath = function(pathInfoCollection) {

                        $scope.$broadcast('viewer.viewable-path-loaded', {
                            pathInfoCollection: pathInfoCollection
                        });

                        if(pathInfoCollection.path3d.length > 0) {

                            $scope.selectedPath.push(
                                pathInfoCollection.path3d[0].path);

                            return;
                        }

                        if(pathInfoCollection.path2d.length > 0) {

                            $scope.selectedPath.push(
                                pathInfoCollection.path2d[0].path);

                            return;
                        }
                    }

                    $scope.onViewerInitialized = function (viewer) {

                        $scope.viewers[viewer.id] = viewer;

                        $timeout(function(){
                            resize($scope.viewerLayoutMode);
                        }, 1000);

                        viewer.addEventListener(
                            Autodesk.Viewing.GEOMETRY_LOADED_EVENT,
                            $scope.onGeometryLoaded);
                    }

                    function onViewerNavbarBtnClicked() {

                        $scope.viewerNavbarVisible = !$scope.viewerNavbarVisible;

                        showViewerNavbar($scope.viewerNavbarVisible);
                    }

                    $scope.onDestroy = function (viewer) {

                        delete $scope.viewers[viewer.id];

                        viewer.finish();
                    }

                    ///////////////////////////////////////////////////////////////////
                    //
                    //
                    ///////////////////////////////////////////////////////////////////
                    function resize(mode) {

                        var height = $('#viewer-container').height() - $scope.viewerNavbarHeight;

                        var width = $('#viewer-container').width();

                        var nb = $scope.selectedPath.length;

                        switch(mode) {

                            case 'VIEWER_LAYOUT_MODE_ROW_FITTED':

                                    $scope.viewerConfig.height = height / nb + 'px';

                                    $scope.viewerConfig.width = width + 'px';

                                    $scope.viewerConfig.splitterHeight =
                                        $scope.viewerConfig.splitterSize + 'px';

                                    $scope.viewerConfig.splitterWidth = width + 'px';

                                break;

                            case 'VIEWER_LAYOUT_MODE_ROW':

                                $scope.viewerConfig.height = height + 'px';

                                $scope.viewerConfig.width = width - 15 + 'px';

                                $scope.viewerConfig.splitterHeight =
                                    $scope.viewerConfig.splitterSize + 'px';

                                $scope.viewerConfig.splitterWidth = width + 'px';

                                break;

                            case 'VIEWER_LAYOUT_MODE_COLUMN_FITTED':

                                $scope.viewerConfig.height = height + 'px';

                                $scope.viewerConfig.width = width / nb +
                                    (1/nb - 1) * $scope.viewerConfig.splitterSize + 'px';

                                $scope.viewerConfig.splitterHeight = height + 'px';

                                $scope.viewerConfig.splitterWidth =
                                    $scope.viewerConfig.splitterSize + 'px';

                                break;
                        }

                        for(var id in $scope.viewers) {

                            $scope.viewers[id].resize();
                        }
                    }

                    ///////////////////////////////////////////////////////////////////
                    //
                    //
                    ///////////////////////////////////////////////////////////////////
                    $scope.$on('ui.layout.resize', function (event, data) {

                        resize($scope.viewerLayoutMode);
                    });

                    ///////////////////////////////////////////////////////////////////
                    //
                    //
                    ///////////////////////////////////////////////////////////////////
                    $scope.$on('viewer.viewable-path-selected',

                        function (event, data) {

                            $scope.selectedPath = data.selectedItems;
                        });

                    ///////////////////////////////////////////////////////////////////
                    //
                    //
                    ///////////////////////////////////////////////////////////////////
                    $scope.$on('viewer.layout-mode-changed',

                        function (event, data) {

                            $scope.viewerLayoutMode = data.selectedLayoutMode;

                            resize($scope.viewerLayoutMode);
                        });

                    ///////////////////////////////////////////////////////////////////
                    //
                    //
                    ///////////////////////////////////////////////////////////////////
                    $scope.$on('viewer.search-input-modified',

                      function (event, data) {

                          for(var id in $scope.viewers) {

                              var viewer = $scope.viewers[id];

                              viewer.isolateById([]);

                              viewer.search(data.searchInput, function(ids){

                                  viewer.isolateById(ids);
                              });
                          }
                      });

                    ///////////////////////////////////////////////////////////////////////
                    //
                    //
                    //////////////////////////////////////////////////////////////////////
                    function showViewerNavbar(visible) {

                        $scope.viewerNavbarVisible = visible;

                        $scope.viewerNavbarHeight = visible ? 50 : 0;

                        $timeout(function(){
                            resize($scope.viewerLayoutMode);
                        }, 500);
                    }

                    showViewerNavbar(false);

                    showAppNavbar(!Toolkit.mobile().isAny());

                    var id = Autodesk.Viewing.Private.getParameterByName("id");

                    if(id.length) {

                        loadFromId(id);
                    }
                    else {

                        $scope.$emit('app.onModal', {
                            dlgId: '#modelsDlg',
                            source: '/viewer'
                        });
                    }
                }

                ///////////////////////////////////////////////////////////////////////
                //
                //
                ///////////////////////////////////////////////////////////////////////
                function showAppNavbar(visible) {

                    AppState.showNavbar = visible;

                    $scope.viewerStyle = (visible ? "top:64px" : "top:0px");
                }

                ///////////////////////////////////////////////////////////////////////
                //
                //
                ///////////////////////////////////////////////////////////////////////
                $scope.viewerLayoutMode = 'VIEWER_LAYOUT_MODE_ROW_FITTED';

                AppState.activeView = 'viewer';

                $scope.selectedPath = [];

                $scope.viewers = {};

                $scope.viewerContainerConfig = {

                    environment: 'AutodeskProduction'
                    //environment: 'AutodeskStaging'
                }

                $scope.viewerConfig = {

                    viewerType: 'GuiViewer3D',
                    //viewerType: 'Viewer3D'

                    width: '100%',
                    height: '100px',
                    splitterSize: 2,
                    splitterWidth: '2px',
                    splitterHeight: '2px'
                }

                ///////////////////////////////////////////////////////////////////////
                //
                //
                //////////////////////////////////////////////////////////////////////
                initializeView();
            }]);