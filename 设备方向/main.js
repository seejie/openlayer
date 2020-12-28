import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import {toRadians} from 'ol/math';

var view = new View({
  center: [0, 0],
  zoom: 2,
});
var map = new Map({
  layers: [
    new TileLayer({
      source: new OSM(),
    }) ],
  target: 'map',
  view: view,
});

function el(id) {
  return document.getElementById(id);
}

var gn = new GyroNorm();

gn.init().then(function () {
  gn.start(function (event) {
    var center = view.getCenter();
    var resolution = view.getResolution();
    var alpha = toRadians(event.do.alpha);
    var beta = toRadians(event.do.beta);
    var gamma = toRadians(event.do.gamma);

    el('alpha').innerText = alpha + ' [rad]';
    el('beta').innerText = beta + ' [rad]';
    el('gamma').innerText = gamma + ' [rad]';

    center[0] -= resolution * gamma * 25;
    center[1] += resolution * beta * 25;

    view.setCenter(center);
  });
});
