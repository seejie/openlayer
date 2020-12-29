import 'ol/ol.css';
/* eslint-disable no-console */

import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import {create as createVersionWorker} from 'ol/worker/version';

var map = new Map({
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

var worker = createVersionWorker();
worker.addEventListener('error', function (error) {
  console.error('worker error', error);
});

worker.addEventListener('message', function (event) {
  console.log('message from worker:', event.data);
});

map.on('moveend', function (event) {
  var state = event.frameState.viewState;
  worker.postMessage({zoom: state.zoom, center: state.center});
});
