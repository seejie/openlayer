import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import {
  DragRotateAndZoom,
  defaults as defaultInteractions,
} from 'ol/interaction';

var map = new Map({
  interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
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
