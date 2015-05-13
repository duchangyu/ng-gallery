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
angular.module('Autodesk.ADN.AngularView.Navbar.AppNavbar',
    [
        'Autodesk.ADN.AngularView.Dialog.About'
    ])

    ///////////////////////////////////////////////////////////////////////////
    //
    //
    ///////////////////////////////////////////////////////////////////////////
    .controller('Autodesk.ADN.AngularView.Navbar.AppNavbar.Controller',

        ['$scope', function($scope) {

            $scope.brand = "Autodesk";

            $scope.brandImg = "img/adsk/adsk-32x32-32.png";

            $scope.aboutItems = [
                {
                    text: 'Get an API key',
                    href: 'http://developer.autodesk.com',
                    icon: 'send',
                    style: 'fill: #abcdef',
                    size: '16'
                },
                {
                    text: 'API Support',
                    href: 'http://forums.autodesk.com/t5/Web-Services-API/ct-p/94',
                    icon: 'send',
                    style: 'fill: #abcdef',
                    size: '16'
                },
                {
                    text: 'Autodesk',
                    href: 'http://www.autodesk.com',
                    icon: 'send',
                    style: 'fill: #abcdef',
                    size: '16'
                },
                {
                    class: 'divider'
                },
                {
                    text: 'Source on Github',
                    href: 'https://github.com/Developer-Autodesk/angular-view',
                    icon: 'send',
                    style: 'fill: #abcdef',
                    size: '16'
                },
                {
                    text: 'About that sample',
                    href: '',
                    icon: 'send',
                    style: 'fill: #abcdef',
                    size: '16',
                    onClick: function() {
                        $('#aboutDlg').modal('show');
                    }
                }
            ]
        }]);