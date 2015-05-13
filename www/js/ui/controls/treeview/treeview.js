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

///////////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////////
angular.module('Autodesk.ADN.AngularView.Control.Treeview',
    [
        'treeControl',
    ])

    ///////////////////////////////////////////////////////////////////////////
    //
    //
    ///////////////////////////////////////////////////////////////////////////
    .controller('Autodesk.ADN.AngularView.Control.Treeview.Controller',

        ['$scope', function($scope) {

            $scope.viewer = null;

            $scope.treeNodes = [];

            $scope.treeOptions = {

                nodeChildren: "children",
                dirSelectable: true,
                injectClasses: {
                    ul: "a1",
                    li: "a2",
                    liSelected: "a7",
                    iExpanded: "a3",
                    iCollapsed: "a4",
                    iLeaf: "a5",
                    label: "a6",
                    labelSelected: "a8"
                }
            }

            $scope.onNodeSelected = function(node, selected) {

                $scope.viewer.isolateById(node.id);

                $scope.viewer.fitToView(node.id);
            }

            function loadTreeNodes(viewer, resultCallback) {

                function createTreeNode(component) {

                    var node = {

                        'name': component.name,
                        'id': component.dbId,
                        'children': []
                    }

                    return node;
                }

                function loadTreeNodesRec(parentNode, component) {

                    if (component.children) {

                        var children = component.children;

                        for (var i = 0; i < children.length; i++) {

                            var childComponent = children[i];

                            var childNode = createTreeNode(
                                childComponent);

                            parentNode.children.push(childNode);

                            loadTreeNodesRec(childNode, childComponent);
                        }
                    }
                }

                viewer.getObjectTree(function (rootComponent) {

                    if(rootComponent) {

                        var rootNode = createTreeNode(
                            rootComponent);

                        loadTreeNodesRec(rootNode, rootComponent);

                        var treeData = [rootNode];

                        resultCallback(treeData);
                    }
                });
            }

            $scope.$on('viewer.geometry-loaded', function (event, data) {

                loadTreeNodes(data.viewer, function (treeNodes) {

                    $scope.viewer = data.viewer;

                    $scope.treeNodes = treeNodes;

                    $scope.expandedNodes = [$scope.treeNodes[0]];
                })
            });
    }]);