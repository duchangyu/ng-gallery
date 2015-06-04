///////////////////////////////////////////////////////////////////////////////
// Demo Workshop Viewer Extension
// by Philippe Leefsma, April 2015
//
///////////////////////////////////////////////////////////////////////////////
AutodeskNamespace("Autodesk.ADN.Viewing.Extension");

Autodesk.ADN.Viewing.Extension.Workshop = function (viewer, options) {

  /////////////////////////////////////////////////////////////////
  //  base class constructor
  //
  /////////////////////////////////////////////////////////////////
  Autodesk.Viewing.Extension.call(this, viewer, options);

  var _self = this;

  var _viewer = viewer;

  /////////////////////////////////////////////////////////////////
  // load callback: invoked when viewer.loadExtension is called
  //
  /////////////////////////////////////////////////////////////////
  _self.load = function () {

    _viewer.addEventListener(
      Autodesk.Viewing.SELECTION_CHANGED_EVENT,
      _self.onSelectionChanged);

    _self.panel = new Autodesk.ADN.WorkshopPanel(
      _viewer.container,
      'WorkshopPanelId',
      'Workshop Panel');

    _self.interval = 0;

    console.log('Autodesk.ADN.Viewing.Extension.Workshop loaded');

    return true;
  };

  /////////////////////////////////////////////////////////////////
  // unload callback: invoked when viewer.unloadExtension is called
  //
  /////////////////////////////////////////////////////////////////
  _self.unload = function () {

    _self.panel.setVisible(false);

    _self.panel.uninitialize();

    clearInterval(_self.interval);

    console.log('Autodesk.ADN.Viewing.Extension.Workshop unloaded');

    return true;
  };

  /////////////////////////////////////////////////////////////////
  // selection changed callback
  //
  /////////////////////////////////////////////////////////////////
  _self.onSelectionChanged = function (event) {

    function propertiesHandler(result) {

      if (result.properties) {

        _self.panel.setProperties(
          result.properties);

        _self.panel.setVisible(true);
      }
    }

    if(event.dbIdArray.length) {

      var dbId = event.dbIdArray[0];

      _viewer.getProperties(
        dbId,
        propertiesHandler);

      _viewer.fitToView(dbId);

      _viewer.isolateById(dbId);

      _self.startRotation();
    }
    else {

      clearInterval(_self.interval);

      _viewer.isolateById([]);

      _viewer.fitToView();

      _self.panel.setVisible(false);
    }
  }

  /////////////////////////////////////////////////////////////////
  // rotates camera around axis with center origin
  //
  /////////////////////////////////////////////////////////////////
  _self.rotateCamera = function(angle, axis) {

    var pos = _viewer.navigation.getPosition();

    var position = new THREE.Vector3(
      pos.x, pos.y, pos.z);

    var rAxis = new THREE.Vector3(
      axis.x, axis.y, axis.z);

    var matrix = new THREE.Matrix4().makeRotationAxis(
      rAxis,
      angle);

    position.applyMatrix4(matrix);

    _viewer.navigation.setPosition(position);
  };

  /////////////////////////////////////////////////////////////////
  // start rotation effect
  //
  /////////////////////////////////////////////////////////////////
  _self.startRotation = function() {

    clearInterval(_self.interval);

    setTimeout(function() {

      _self.interval = setInterval(function () {

        _self.rotateCamera(0.05, {x:0, y:1, z:0});

      }, 100)}, 500);
  };

  /////////////////////////////////////////////////////////////////
  // creates panel and sets up inheritance
  //
  /////////////////////////////////////////////////////////////////
  Autodesk.ADN.WorkshopPanel = function(
    parentContainer,
    id,
    title,
    options)
  {
    Autodesk.Viewing.UI.PropertyPanel.call(
      this,
      parentContainer,
      id, title);
  };

  Autodesk.ADN.WorkshopPanel.prototype = Object.create(
    Autodesk.Viewing.UI.PropertyPanel.prototype);

  Autodesk.ADN.WorkshopPanel.prototype.constructor =
    Autodesk.ADN.WorkshopPanel;
};

/////////////////////////////////////////////////////////////////
// sets up inheritance for extension and register
//
/////////////////////////////////////////////////////////////////
Autodesk.ADN.Viewing.Extension.Workshop.prototype =
  Object.create(Autodesk.Viewing.Extension.prototype);

Autodesk.ADN.Viewing.Extension.Workshop.prototype.constructor =
  Autodesk.ADN.Viewing.Extension.Workshop;

Autodesk.Viewing.theExtensionManager.registerExtension(
  'Autodesk.ADN.Viewing.Extension.Workshop',
  Autodesk.ADN.Viewing.Extension.Workshop);

