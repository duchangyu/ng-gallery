///////////////////////////////////////////////////////////////////////////////
// Autodesk.ADN.Viewing.Extension.ExtensionManager
// by Philippe Leefsma, May 2015
//
///////////////////////////////////////////////////////////////////////////////
AutodeskNamespace("Autodesk.ADN.Viewing.Extension");

Autodesk.ADN.Viewing.Extension.ExtensionManager = function (viewer, options) {

    Autodesk.Viewing.Extension.call(this, viewer, options);

    var _panelBaseId = newGUID();

    var _extensionsMap = {};

    var _viewer = viewer;

    var _panel = null;

    var _this = this;

    /////////////////////////////////////////////////////////
    //
    //
    //////////////////////////////////////////////////////////
    _this.load = function () {

        var ctrlGroup = _this.getGalleryControlGroup();

        _this.createControls(ctrlGroup);

        _panel = new Autodesk.ADN.Viewing.Extension.ExtensionManager.Panel(
          _viewer.container,
          _panelBaseId);

        $.get(options.apiUrl , function(extensions){

            initStorage(extensions);

            _extensionsMap = _this.initializeExtensions(
              extensions);
        });

        console.log('Autodesk.ADN.Viewing.Extension.ExtensionManager loaded');

        return true;
    };

    /////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////
    _this.unload = function () {

        console.log('Autodesk.ADN.Viewing.Extension.ExtensionManager unloaded');

        return true;
    };

    /////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////
    _this.initializeExtensions = function(extensions) {

        var extensionsMap = {};

        extensions.forEach(function(extension){

            //hidden extensions start with '_'
            if(!extension.id.startsWith('_')) {

                extension.handler = function() {

                    extension.enabled = !extension.enabled;

                    storeExtensionState(extension);

                    if(extension.enabled) {

                        $('#' + extension.itemId).addClass('enabled');

                        loadExtension(extension);
                    }
                    else {

                        $('#' + extension.itemId).removeClass('enabled');

                        viewer.unloadExtension(extension.id);
                    }
                }

                extension.itemId = newGUID();

                extension.enabled = getExtensionState(extension);

                if(extension.enabled) {

                    loadExtension(extension);
                }

                extensionsMap[extension.id] = extension;
            }
        });

        return extensionsMap;
    }

    /////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////
    _this.getGalleryControlGroup = function() {

        var viewerToolbar = _viewer.getToolbar(true);

        var galleryControls = viewerToolbar.getControl(
            'Autodesk.ADN.Gallery.ControlGroup');

        if(!galleryControls) {

            galleryControls = new Autodesk.Viewing.UI.ControlGroup(
                'Autodesk.ADN.Gallery.ControlGroup');

            viewerToolbar.addControl(galleryControls);
        }

       return galleryControls;
    }

    /////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////
    _this.createControls = function(parentGroup) {

        var btn = createButton(
            'Autodesk.ADN.Gallery.ExtensionManager.Button.Manage',
            'glyphicon glyphicon-plus',
            'Manage Extensions',
            _this.onExtensionManagerClicked);

        parentGroup.addControl(btn);
    }

    /////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////
    _this.onExtensionManagerClicked = function() {

        _panel.setVisible(true);

        _extensionsMap = {};

        $.get(options.apiUrl , function(extensions){

            _panel.clearExtensions();

            initStorage(extensions);

            _extensionsMap = _this.initializeExtensions(
              extensions);

            for(var extensionId in _extensionsMap) {

                _panel.addExtension(_extensionsMap[extensionId]);
            }
        });
    }

    /////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////
    function createButton(id, className, tooltip, handler) {

        var button = new Autodesk.Viewing.UI.Button(id);

        //button.icon.style.backgroundImage = imgUrl;
        button.icon.className = className;

        button.icon.style.fontSize = "24px";

        button.setToolTip(tooltip);

        button.onClick = handler;

        return button;
    }

    /////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////
    function newGUID() {

        var d = new Date().getTime();

        var guid = 'xxxx-xxxx-xxxx-xxxx-xxxx'.replace(
          /[xy]/g,
          function (c) {
              var r = (d + Math.random() * 16) % 16 | 0;
              d = Math.floor(d / 16);
              return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
          });

        return guid;
    };

    /////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////
    function initStorage(extensions) {

        //window.localStorage.clear();

        if(!localStorage['gallery.extensions']) {

            localStorage['gallery.extensions'] = JSON.stringify({});
        }

        var storageObj = JSON.parse(localStorage['gallery.extensions']);

        extensions.forEach(function(extension) {

            if(!storageObj[extension.id]) {

                storageObj[extension.id] = false;
            }
        });

        localStorage['gallery.extensions'] = JSON.stringify(storageObj);
    }

    /////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////
    function getExtensionState(extension) {

        var storageObj = JSON.parse(
          localStorage['gallery.extensions']);

        return storageObj[extension.id];
    }

    /////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////
    function storeExtensionState(extension) {

        var storageObj = JSON.parse(localStorage['gallery.extensions']);

        storageObj[extension.id] = extension.enabled;

        localStorage['gallery.extensions'] = JSON.stringify(storageObj);
    }

    /////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////
    function loadExtension(extension) {

        $.getScript(options.extensionsUrl +'/' +
          extension.id + '/' + extension.file)

          .done(function () {

              viewer.loadExtension(extension.id);
          })
          .fail(function (jqxhr, settings, exception) {
              console.log("Load failed: " + extension.file);
          });
    }

    /////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////
    Autodesk.ADN.Viewing.Extension.ExtensionManager.Panel = function(
      parentContainer,
      baseId)
    {
        this.content = document.createElement('div');

        this.content.id = baseId + 'PanelContentId';
        this.content.className = 'extension-manager-panel-content';

        Autodesk.Viewing.UI.DockingPanel.call(
          this,
          parentContainer,
          baseId,
          "Extensions Manager",
          {shadow:true});

        this.container.style.top = "0px";
        this.container.style.left = "0px";

        this.container.style.width = "300px";
        this.container.style.height = "400px";

        this.container.style.resize = "auto";

        var html = [
            '<div class="extension-manager-panel-container" style="z-index: 1000">',
                '<div id="' + baseId + 'PanelContainerId" class="list-group extension-manager-panel-list-container">',
                '</div>',
            '</div>'
        ].join('\n');

        $('#' + baseId + 'PanelContentId').html(html);

        this.addExtension = function(extension) {

            var srcUrl = options.extensionsUrl + '/' + extension.id + '/' + extension.file;

            var html = [

                '<div class="row extension-manager-panel-row">',
                    '<a class="list-group-item extension-manager-panel-list-group-item col-md-6" id=' + extension.itemId + '>',
                        '<p class="list-group-item-text">',
                            extension.name,
                        '</p>',
                    '</a>',

                    '<a href="' + srcUrl + '" class="list-group-item extension-manager-panel-list-group-item-src col-md-2" target=_blank>',
                        '<p class="list-group-item-text">',
                            'Source',
                        '</p>',
                    '</a>',
                '</div>',

            ].join('\n');

            $('#' + baseId + 'PanelContainerId').append(html);

            $('#' + extension.itemId).click(extension.handler);

            $('#' + extension.itemId + 'src').click(extension.handlerSrc);

            if(extension.enabled) {
                $('#' + extension.itemId).addClass('enabled');
            }
        }

        this.clearExtensions = function () {

            $('#' + baseId + 'PanelContainerId > div').each(
              function (idx, child) {
                  $(child).remove();
              }
            )
        }
    };

    Autodesk.ADN.Viewing.Extension.ExtensionManager.Panel.prototype = Object.create(
      Autodesk.Viewing.UI.DockingPanel.prototype);

    Autodesk.ADN.Viewing.Extension.ExtensionManager.Panel.prototype.constructor =
      Autodesk.ADN.Viewing.Extension.ExtensionManager.Panel;

    Autodesk.ADN.Viewing.Extension.ExtensionManager.Panel.prototype.initialize = function()
    {
        // Override DockingPanel initialize() to:
        // - create a standard title bar
        // - click anywhere on the panel to move

        this.title = this.createTitleBar(
          this.titleLabel ||
          this.container.id);

        this.closer = this.createCloseButton();

        this.container.appendChild(this.title);
        this.title.appendChild(this.closer);
        this.container.appendChild(this.content);

        this.initializeMoveHandlers(this.title);
        this.initializeCloseHandler(this.closer);
    };

    var css = [

        'div.extension-manager-panel-content {',
            'height: calc(100% - 25px);',
        '}',

            'div.extension-manager-panel-container {',
            'height: calc(100% - 25px);',
            'margin: 10px;',
        '}',

        'div.extension-manager-panel-controls-container {',
            'margin-bottom: 10px;',
        '}',

        'div.extension-manager-panel-list-container {',
            'height: calc(100% - 25px);',
            'overflow-y: auto;',
        '}',

        'a.extension-manager-panel-list-group-item {',
            'color: #FFFFFF;',
            'background-color: #3F4244;',
            'margin-bottom: 5px;',
            'border-radius: 4px;',
        '}',

        'a.extension-manager-panel-list-group-item-src {',
            'color: #FFFFFF;',
            'background-color: #3F4244;',
            'margin-bottom: 5px;',
            'width: 45px;',
            'border-radius: 4px;',
        '}',

        'a.extension-manager-panel-list-group-item:hover {',
            'color: #FFFFFF;',
            'background-color: #5BC0DE;',
        '}',

        'a.extension-manager-panel-list-group-item.enabled {',
            'color: #000000;',
            'background-color: #00CC00;',
        '}',

        'div.extension-manager-panel-row {',
            'margin-left: 0;',
            'margin-right: 0;',
        '}'

    ].join('\n');

    $('<style type="text/css">' + css + '</style>').appendTo('head');
};

Autodesk.ADN.Viewing.Extension.ExtensionManager.prototype =
  Object.create(Autodesk.Viewing.Extension.prototype);

Autodesk.ADN.Viewing.Extension.ExtensionManager.prototype.constructor =
  Autodesk.ADN.Viewing.Extension.ExtensionManager;

Autodesk.Viewing.theExtensionManager.registerExtension(
  'Autodesk.ADN.Viewing.Extension.ExtensionManager',
  Autodesk.ADN.Viewing.Extension.ExtensionManager);

