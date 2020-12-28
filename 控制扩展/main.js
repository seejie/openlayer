import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import {FullScreen, defaults as defaultControls} from 'ol/control';

var view = new View({
  center: [-9101767, 2822912],
  zoom: 14,
});

var map = new Map({
  controls: defaultControls().extend([
    new FullScreen({
      source: 'fullscreen',
    }) ]),
  layers: [
    new TileLayer({
      source: new OSM(),
    }) ],
  target: 'map',
  view: view,
});
