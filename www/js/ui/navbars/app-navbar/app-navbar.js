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

var config = require("../../../config-client");

///////////////////////////////////////////////////////////////////////////////
//
//
///////////////////////////////////////////////////////////////////////////////
angular.module('Autodesk.ADN.AngularView.Navbar.AppNavbar',
    [
        'Autodesk.ADN.AngularView.Dialog.About'
    ])

    ///////////////////////////////////////////////////////////////////////////
    //
    //
    ///////////////////////////////////////////////////////////////////////////
    .controller('Autodesk.ADN.AngularView.Navbar.AppNavbar.Controller',

        ['$scope', '$http', '$location', 'AppState',
            function($scope, $http, $location, AppState) {

                ///////////////////////////////////////////////////////////////////
                //
                //
                ///////////////////////////////////////////////////////////////////
                $scope.onLogin = function() {

                  if(AppState.isAuthenticated) {

                      $scope.logStatus = "Logging out ...";

                      $http.get(config.host + '/api/auth/logout').
                        success(function(res) {
                            $scope.logStatus = "Login";
                            AppState.isAuthenticated = false;
                        });
                  }
                  else {

                      $scope.$emit('app.onModal', {
                          dlgId: '#loginDlg',
                          caption: 'Log in with social media ...'
                      });
                  }
                }

                ///////////////////////////////////////////////////////////////////
                //
                //
                ///////////////////////////////////////////////////////////////////
                function initialize() {

                    $scope.logStatus = "";

                    $scope.brand = "Autodesk";

                    $scope.brandImg = "img/adsk/adsk-32x32-32.png";

                    $scope.aboutItems = [
                        {
                            text: 'Get an API key',
                            href: 'http://developer.autodesk.com',
                            icon: 'vpn_key',
                            style: 'fill: rgba(0, 0, 0, 0.6)',
                            size: '15'
                        },
                        {
                            text: 'API Support',
                            href: 'http://forums.autodesk.com/t5/Web-Services-API/ct-p/94',
                            icon: 'thumb_up',
                            style: 'fill: rgba(0, 0, 0, 0.6)',
                            size: '15'
                        },
                        {
                            text: 'Autodesk',
                            href: 'http://www.autodesk.com',
                            icon: 'spellcheck',
                            style: 'fill: rgba(0, 0, 0, 0.6)',
                            size: '15'
                        },
                        {
                            class: 'divider'
                        },
                        {
                            text: 'Source on Github',
                            href: 'https://github.com/Developer-Autodesk/ng-gallery',
                            icon: 'star',
                            style: 'fill: rgba(0, 0, 0, 0.6)',
                            size: '15'
                        },
                        {
                            text: 'About that sample',
                            href: '',
                            icon: 'info_outline',
                            style: 'fill: rgba(0, 0, 0, 0.6)',
                            size: '15',
                            onClick: function() {
                                $scope.$emit('app.onModal', {
                                    dlgId: '#aboutDlg'
                                });
                            }
                        }
                    ]

                    ///////////////////////////////////////////////////////////////////
                    //
                    //
                    ///////////////////////////////////////////////////////////////////
                    $http.get(config.host + '/api/auth/isauthenticated').
                      success(function (response) {

                          AppState.isAuthenticated = (response.user !== null);

                          if(AppState.isAuthenticated) {

                              switch(response.user.type) {
                                  case 'facebook':
                                      $scope.logStatus = response.user.facebook.name;
                                        break;
                                  case 'google':
                                      $scope.logStatus = response.user.google.name;
                                      break;
                                  case 'github':
                                      $scope.logStatus = response.user.github.name;
                                      break;
                                  case 'linkedin':
                                      $scope.logStatus = response.user.linkedin.name;
                                      break;
                              };

                              $scope.logStatus += ' (Logout)';
                          }
                          else {
                              $scope.logStatus = "Login";
                          }
                      });
                }

                ///////////////////////////////////////////////////////////////////
                //
                //
                ///////////////////////////////////////////////////////////////////
                $scope.onReload = function(source) {

                    $scope.$emit('app.onModal', {
                        dlgId: '#modelsDlg',
                        source: source
                    });
                }

                ///////////////////////////////////////////////////////////////////
                //
                //
                ///////////////////////////////////////////////////////////////////
                $scope.activeView = function() {

                    return AppState.activeView;
                }

                ///////////////////////////////////////////////////////////////////
                //
                //
                ///////////////////////////////////////////////////////////////////
                initialize();
        }]);