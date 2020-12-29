import 'ol/ol.css';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import XYZ from 'ol/source/XYZ';
import {transform} from 'ol/proj';

var key = 'get_your_own_D6rA4zTHduk6KOKTXzGB';
var attributions =
  '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> ' +
  '<a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>';

var map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
    new TileLayer({
      source: new XYZ({
        attributions: attributions,
        url:
          'https://api.maptiler.com/maps/outdoor/256/{z}/{x}/{y}@2x.png?key=' +
          key,
        tilePixelRatio: 2, // THIS IS IMPORTANT
      }),
    }) ],
  view: new View({
    projection: 'EPSG:3857',
    center: transform([-112.18688965, 36.057944835], 'EPSG:4326', 'EPSG:3857'),
    zoom: 12,
  }),
});
