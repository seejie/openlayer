import 'ol/ol.css';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import TileJSON from 'ol/source/TileJSON';
import TileLayer from 'ol/layer/Tile';
import UTFGrid from 'ol/source/UTFGrid';
import View from 'ol/View';

// https://openlayers.org/en/latest/examples/utfgrid.html
var key = 'pk.eyJ1IjoiYWhvY2V2YXIiLCJhIjoiY2pzbmg0Nmk5MGF5NzQzbzRnbDNoeHJrbiJ9.7_-_gL8ur7ZtEiNwRfCy7Q';

var mapLayer = new TileLayer({
  source: new TileJSON({
    url:
      'https://api.tiles.mapbox.com/v4/mapbox.geography-class.json?secure&access_token=' +
      key,
  }),
});

var gridSource = new UTFGrid({
  url:
    'https://api.tiles.mapbox.com/v4/mapbox.geography-class.json?secure&access_token=' +
    key,
});

var gridLayer = new TileLayer({source: gridSource});

var view = new View({
  center: [0, 0],
  zoom: 1,
});

var mapElement = document.getElementById('map');
var map = new Map({
  layers: [mapLayer, gridLayer],
  target: mapElement,
  view: view,
});

var infoElement = document.getElementById('country-info');
var flagElement = document.getElementById('country-flag');
var nameElement = document.getElementById('country-name');

var infoOverlay = new Overlay({
  element: infoElement,
  offset: [15, 15],
  stopEvent: false,
});
map.addOverlay(infoOverlay);

var displayCountryInfo = function (coordinate) {
  var viewResolution = /** @type {number} */ (view.getResolution());
  gridSource.forDataAtCoordinateAndResolution(
    coordinate,
    viewResolution,
    function (data) {
      // If you want to use the template from the TileJSON,
      //  load the mustache.js library separately and call
      //  info.innerHTML = Mustache.render(gridSource.getTemplate(), data);
      mapElement.style.cursor = data ? 'pointer' : '';
      if (data) {
        flagElement.src = 'data:image/png;base64,' + data['flag_png'];
        nameElement.innerHTML = data['admin'];
      }
      infoOverlay.setPosition(data ? coordinate : undefined);
    }
  );
};

map.on('pointermove', function (evt) {
  if (evt.dragging) {
    return;
  }
  var coordinate = map.getEventCoordinate(evt.originalEvent);
  displayCountryInfo(coordinate);
});

map.on('click', function (evt) {
  displayCountryInfo(evt.coordinate);
});
