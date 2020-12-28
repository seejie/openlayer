import 'ol/ol.css';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import {OSM, TileDebug} from 'ol/source';

var map = new Map({
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    new TileLayer({
      source: new TileDebug(),
    }) ],
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 1,
  }),
});
