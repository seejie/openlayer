import 'ol/ol.css';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import XYZ from 'ol/source/XYZ';

// https://openlayers.org/en/latest/examples/reusable-source.html
var key = 'pk.eyJ1IjoiYWhvY2V2YXIiLCJhIjoiY2pzbmg0Nmk5MGF5NzQzbzRnbDNoeHJrbiJ9.7_-_gL8ur7ZtEiNwRfCy7Q';
var baseUrl = 'https://{a-c}.tiles.mapbox.com/v4';
var urls = [
  baseUrl + '/mapbox.blue-marble-topo-jan/{z}/{x}/{y}.png?access_token=' + key,
  baseUrl +
    '/mapbox.blue-marble-topo-bathy-jan/{z}/{x}/{y}.png?access_token=' +
    key,
  baseUrl + '/mapbox.blue-marble-topo-jul/{z}/{x}/{y}.png?access_token=' + key,
  baseUrl +
    '/mapbox.blue-marble-topo-bathy-jul/{z}/{x}/{y}.png?access_token=' +
    key ];

var source = new XYZ();

var map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: source,
    }) ],
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});

function updateUrl(index) {
  source.setUrl(urls[index]);
}

var buttons = document.getElementsByClassName('switcher');
for (var i = 0, ii = buttons.length; i < ii; ++i) {
  var button = buttons[i];
  button.addEventListener('click', updateUrl.bind(null, Number(button.value)));
}

updateUrl(0);
