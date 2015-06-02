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
angular.module('Autodesk.ADN.AngularView.View.Home',
    [
        'ngRoute',
        'Autodesk.ADN.Toolkit.ViewData.Service.ViewAndData',
        'Autodesk.ADN.AngularView.Service.Resource.Model',
        'Autodesk.ADN.AngularView.Service.Resource.Thumbnail'
    ])

    ///////////////////////////////////////////////////////////////////////
    //
    //
    ///////////////////////////////////////////////////////////////////////
    .config(['$routeProvider', function($routeProvider) {

            $routeProvider.when('/home', {
                templateUrl: './js/ui/views/home/home.html',
                controller: 'Autodesk.ADN.AngularView.View.Home.Controller'
            });
        }])

    ///////////////////////////////////////////////////////////////////////////
    //
    //
    ///////////////////////////////////////////////////////////////////////////
    .controller('Autodesk.ADN.AngularView.View.Home.Controller',

        ['$scope', 'ViewAndData', 'Model', 'Thumbnail', 'AppState',
            function($scope, ViewAndData, Model, Thumbnail, AppState) {

              ///////////////////////////////////////////////////////////////////
              //
              //
              ///////////////////////////////////////////////////////////////////
              $scope.searchFilter = function (model) {

                  var regExp = new RegExp($scope.modelsFilterValue, 'i');

                  return !$scope.modelsFilterValue ||
                    regExp.test(model.name);
              };

              ///////////////////////////////////////////////////////////////////
              //
              //
              ///////////////////////////////////////////////////////////////////
              function loadModels() {

                //fetches 10 models at a time

                var limit = 10;

                var skip = 0;

                loadModelsRec(skip, limit)
              }

              function loadModelsRec(skip, limit) {

                  Model.query({skip: skip, limit:limit}, function(models) {

                    if(models.length) {

                      models.forEach(function(model) {

                          // set as default
                          model.thumbnail = "img/adsk/adsk-128x128-32.png";

                          $scope.models.push(model);

                          Thumbnail.get({modelId:model._id},
                            function(response){
                                model.thumbnail =
                                  "data:image/png;base64," + response.thumbnail.data;
                            });


                          var fileId = ViewAndData.client.fromBase64(model.urn);

                          // role
                          ViewAndData.client.getSubItemsWithProperties(
                            fileId,
                            { type: 'geometry'},
                            function (items){
                                if(items.length > 0) {
                                    model.type = items[0].role;
                                }
                            },
                            function (error) {

                            }
                          );

                          //progress
                          ViewAndData.client.getViewableAsync(
                            fileId,
                            function (viewable) {

                                model.progress = viewable.progress;
                            },
                            function (error) {

                            }, 'status');
                      });

                      loadModelsRec(skip + limit, limit);
                    }
                  });
              }

              ///////////////////////////////////////////////////////////////////
              //
              //
              ///////////////////////////////////////////////////////////////////
              ViewAndData.client.onInitialized(function() {

                loadModels();
              });

              ///////////////////////////////////////////////////////////////////
              //
              //
              ///////////////////////////////////////////////////////////////////
              AppState.activeView = 'home';

              AppState.showNavbar = true;

              $scope.models = [];
    }]);

