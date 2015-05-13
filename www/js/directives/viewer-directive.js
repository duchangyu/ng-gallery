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

angular.module('Autodesk.ADN.Toolkit.Viewer.Directive.Viewer', [])

    ///////////////////////////////////////////////////////////////////////////
    //
    //
    ///////////////////////////////////////////////////////////////////////////
    .directive('adnViewerContainer', function () {

        function link($scope, $element, $attributes) {

            $scope.viewerFactory =
                new Autodesk.ADN.Toolkit.Viewer.AdnViewerFactory(
                    $attributes.url,
                    ($attributes.hasOwnProperty('config') ?
                        JSON.parse($attributes.config) :
                        {}));

            $attributes.$observe('urn', function(urn) {

                if (urn.length) {

                    $scope.viewerFactory.getViewablePath(
                        urn,
                        function (pathInfoCollection) {

                            $scope.onViewablePath({
                                pathInfoCollection: pathInfoCollection
                            });
                        },
                        function (error) {
                            $scope.onError({
                                error: error
                            })
                        });
                }
            });
        };

        function controller ($scope) {

            this.getViewerFactory = function() {

                return $scope.viewerFactory;
            }
        }

        return {

            scope: {
                url: '@',
                urn: '@',
                onViewablePath: '&',
                onError: '&'
            },

            link: link,
            replace: true,
            restrict: 'E',
            transclude: true,
            controller: controller,
            template: '<div style="overflow:auto;position:relative;{{style}}">'
                + '<div ng-transclude></div><div/>'
        };
    })

    ///////////////////////////////////////////////////////////////////////////
    //
    //
    ///////////////////////////////////////////////////////////////////////////
    .directive('adnViewer', function () {

        function postlink($scope, $element, $attributes, parentController) {

            $scope.viewer = null;

            $attributes.$observe('path', function(path) {

                if (path.length) {

                    $scope.viewerFactory = parentController.getViewerFactory();

                    var config =  ($attributes.hasOwnProperty('config') ?
                        JSON.parse($attributes.config) : {});

                    $scope.viewer = $scope.viewerFactory.createViewer(
                        $element[0],
                        config);

                    $scope.viewer.id =
                        $scope.viewer.container.parentElement.id;

                     $scope.onViewerInitialized({
                        viewer: $scope.viewer
                     });

                     $scope.viewer.load(path);

                     $scope.$on('$destroy', function() {

                         $scope.onDestroy({
                             viewer: $scope.viewer
                         });
                     });
                }
            });
        }

        return {

            scope: {

                path: '@',
                onDestroy: '&',
                onViewerInitialized: '&',
                onError: '&'
            },
            link: {
                post: postlink
            },
            restrict: 'E',
            replace: true,
            require: '^adnViewerContainer',
            template: '<div style="overflow:auto;position:relative;{{style}}"> <div/>'
        };
    });


