import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import {DragPan, MouseWheelZoom, defaults} from 'ol/interaction';
import {platformModifierKeyOnly} from 'ol/events/condition';

var map = new Map({
  interactions: defaults({dragPan: false, mouseWheelZoom: false}).extend([
    new DragPan({
      condition: function (event) {
        return this.getPointerCount() === 2 || platformModifierKeyOnly(event);
      },
    }),
    new MouseWheelZoom({
      condition: platformModifierKeyOnly,
    }) ]),
  layers: [
    new TileLayer({
      source: new OSM(),
    }) ],
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});
