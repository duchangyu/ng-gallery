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

angular.module('Autodesk.ADN.AngularView.Service.Toolkit', []).

  provider('Toolkit', {

    $get: function() {

      return {

        newGUID:  function() {

          var d = new Date().getTime();

          var guid = 'xxxx-xxxx-xxxx-xxxx-xxxx'.replace(
            /[xy]/g,
            function (c) {
              var r = (d + Math.random() * 16) % 16 | 0;
              d = Math.floor(d / 16);
              return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
            });

          return guid;
        },

        createButton: function (id, className, tooltip, handler) {

          var button = new Autodesk.Viewing.UI.Button(id);

          button.icon.className = className;

          button.icon.style.fontSize = "26px";

          button.setToolTip(tooltip);

          button.onClick = handler;

          return button;
        },

        getGalleryControlGroup: function (viewer) {

          var viewerToolbar = viewer.getToolbar(true);

          var galleryControls = viewerToolbar.getControl(
            'Autodesk.ADN.Gallery.ControlGroup');

          if(!galleryControls) {

            galleryControls = new Autodesk.Viewing.UI.ControlGroup(
              'Autodesk.ADN.Gallery.ControlGroup');

            viewerToolbar.addControl(galleryControls);
          }

          return galleryControls;
        },

        //@author SM@K<smali.kazmi@hotmail.com>
        //@description website: smak.pk
        mobile: function () {

          var mobile = {

            getUserAgent: function () {
              return navigator.userAgent;
            },
            isAndroid: function () {
              return this.getUserAgent().match(/Android/i);
            },
            isBlackBerry: function () {
              return this.getUserAgent().match(/BlackBerry/i);
            },
            isIOS: function () {
              return this.getUserAgent().match(/iPhone|iPad|iPod/i);
            },
            isOpera: function () {
              return this.getUserAgent().match(/Opera Mini/i);
            },
            isWindows: function () {
              return this.isWindowsDesktop() || this.isWindowsMobile();
            },
            isWindowsMobile: function () {
              return this.getUserAgent().match(/IEMobile/i);
            },
            isWindowsDesktop: function () {
              return this.getUserAgent().match(/WPDesktop/i);
              ;
            },
            isAny: function () {

              var foundAny = false;

              var getAllMethods = Object.getOwnPropertyNames(mobile).filter(
                function (property) {
                  return typeof mobile[property] == 'function';
                });

              for (var index in getAllMethods) {

                if (getAllMethods[index] === 'getUserAgent' ||
                  getAllMethods[index] === 'isAny' ||
                  getAllMethods[index] === 'isWindows') {
                  continue;
                }
                if (mobile[getAllMethods[index]]()) {
                  foundAny = true;
                  break;
                }
              }

              return foundAny;
            }
          }

          return mobile;
        }

      }
    }
  });
