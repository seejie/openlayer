import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import {Control, defaults as defaultControls} from 'ol/control';

//
// Define rotate to north control.
//

var RotateNorthControl = /*@__PURE__*/(function (Control) {
  function RotateNorthControl(opt_options) {
    var options = opt_options || {};

    var button = document.createElement('button');
    button.innerHTML = 'N';

    var element = document.createElement('div');
    element.className = 'rotate-north ol-unselectable ol-control';
    element.appendChild(button);

    Control.call(this, {
      element: element,
      target: options.target,
    });

    button.addEventListener('click', this.handleRotateNorth.bind(this), false);
  }

  if ( Control ) RotateNorthControl.__proto__ = Control;
  RotateNorthControl.prototype = Object.create( Control && Control.prototype );
  RotateNorthControl.prototype.constructor = RotateNorthControl;

  RotateNorthControl.prototype.handleRotateNorth = function handleRotateNorth () {
    this.getMap().getView().setRotation(0);
  };

  return RotateNorthControl;
}(Control));

//
// Create map, giving it a rotate to north control.
//

var map = new Map({
  controls: defaultControls().extend([new RotateNorthControl()]),
  layers: [
    new TileLayer({
      source: new OSM(),
    }) ],
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 3,
    rotation: 1,
  }),
});
