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
angular.module('Autodesk.ADN.AngularView.Dialog.Models',[])

    ///////////////////////////////////////////////////////////////////////////
    //
    //
    ///////////////////////////////////////////////////////////////////////////
    .controller('Autodesk.ADN.AngularView.Dialog.Models.Controller',

        ['$scope', '$location', 'Model', 'Thumbnail',
            function($scope, $location, Model, Thumbnail) {

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

                    Model.query(function(models) {

                        models.forEach(function(model) {

                            // set as default
                            model.thumbnail = "img/adsk/adsk-128x128-32.png";

                            $scope.models.push(model);

                            Thumbnail.get({modelId:model._id},
                              function(response){
                                  model.thumbnail =
                                    "data:image/png;base64," + response.thumbnail.data;
                              });
                        });
                    });
                }

                ///////////////////////////////////////////////////////////////////
                //
                //
                ///////////////////////////////////////////////////////////////////
                $scope.$on('app.onModels', function (event, data) {

                    $scope.source = data.source;

                    $('#modelsDlg').modal('show');
                });

                ///////////////////////////////////////////////////////////////////
                //
                //
                ///////////////////////////////////////////////////////////////////
                $scope.onLoadModel = function(modelId) {

                    $('#modelsDlg').modal('hide');

                    $location.path($scope.source).search({id: modelId});
                }

                ///////////////////////////////////////////////////////////////////
                //
                //
                ///////////////////////////////////////////////////////////////////
                $scope.models = [];

                loadModels();
        }]);