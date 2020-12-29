import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';

var map = new Map({
  layers: [
    new TileLayer({
      source: new OSM(),
    }) ],
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});

map.setTarget('map1');

var teleportButton = document.getElementById('teleport');

teleportButton.addEventListener(
  'click',
  function () {
    var target = map.getTarget() === 'map1' ? 'map2' : 'map1';
    map.setTarget(target);
  },
  false
);
