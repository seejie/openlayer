import 'ol/ol.css';
import BingMaps from 'ol/source/BingMaps';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';

// https://openlayers.org/en/latest/examples/preload.html
var view = new View({
  center: [-4808600, -2620936],
  zoom: 8,
});

var map1 = new Map({
  layers: [
    new TileLayer({
      preload: Infinity,
      source: new BingMaps({
        key: 'Your Bing Maps Key from http://www.bingmapsportal.com/ here',
        imagerySet: 'Aerial',
      }),
    }) ],
  target: 'map1',
  view: view,
});

var map2 = new Map({
  layers: [
    new TileLayer({
      preload: 0, // default value
      source: new BingMaps({
        key: 'Your Bing Maps Key from http://www.bingmapsportal.com/ here',
        imagerySet: 'AerialWithLabelsOnDemand',
      }),
    }) ],
  target: 'map2',
  view: view,
});
