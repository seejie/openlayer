import 'ol/ol.css';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';
import Point from 'ol/geom/Point';
import TileJSON from 'ol/source/TileJSON';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import {Icon, Style, Text} from 'ol/style';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {fromLonLat} from 'ol/proj';
import {getVectorContext} from 'ol/render';

var rasterLayer = new TileLayer({
  source: new TileJSON({
    url: '/aj.1x1-degrees.json',
    crossOrigin: '',
  }),
});

var iconFeature = new Feature({
  geometry: new Point(fromLonLat([0, -10])),
  name: 'Fish.1',
});

var feature1 = new Feature({
  geometry: new Point(fromLonLat([0, -10])),
  name: 'Fish.1 Island',
});

var feature2 = new Feature({
  geometry: new Point(fromLonLat([-30, 10])),
  name: 'Fish.2 Island',
});

var iconStyle = new Style({
  image: new Icon({
    anchor: [0.5, 0.9],
    // src: 'data/fish.png',
    src: 'https://openlayers.org/en/latest/examples/data/fish.png',
    crossOrigin: '',
    scale: [0, 0],
    rotation: Math.PI / 4,
  }),
  text: new Text({
    text: 'FISH\nTEXT',
    scale: [0, 0],
    rotation: Math.PI / 4,
    textAlign: 'center',
    textBaseline: 'top',
  }),
});

var i = 0;
var j = 45;

iconFeature.setStyle(function () {
  var x = Math.sin((i * Math.PI) / 180) * 3;
  var y = Math.sin((j * Math.PI) / 180) * 4;
  iconStyle.getImage().setScale([x, y]);
  iconStyle.getText().setScale([x, y]);
  return iconStyle;
});

rasterLayer.on('postrender', function (event) {
  var vectorContext = getVectorContext(event);
  var x = Math.cos((i * Math.PI) / 180) * 3;
  var y = Math.cos((j * Math.PI) / 180) * 4;
  iconStyle.getImage().setScale([x, y]);
  iconStyle.getText().setScale([x, y]);
  vectorContext.drawFeature(feature2, iconStyle);
});

var vectorSource = new VectorSource({
  features: [iconFeature, feature1, feature2],
});

var vectorLayer = new VectorLayer({
  source: vectorSource,
});

var map = new Map({
  layers: [rasterLayer, vectorLayer],
  target: document.getElementById('map'),
  view: new View({
    center: fromLonLat([-15, 0]),
    zoom: 3,
  }),
});

setInterval(function () {
  i = (i + 4) % 360;
  j = (j + 5) % 360;
  vectorSource.changed();
}, 1000);

var element = document.getElementById('popup');

var popup = new Overlay({
  element: element,
  positioning: 'bottom-center',
  stopEvent: false,
  offset: [0, -50],
});
map.addOverlay(popup);

// display popup on click
map.on('click', function (evt) {
  var feature = map.forEachFeatureAtPixel(evt.pixel, function (feature) {
    return feature;
  });
  $(element).popover('dispose');
  if (feature) {
    var coordinates = feature.getGeometry().getCoordinates();
    popup.setPosition(coordinates);
    $(element).popover({
      placement: 'top',
      html: true,
      animation: false,
      content: feature.get('name'),
    });
    $(element).popover('show');
  }
});

// change mouse cursor when over marker
map.on('pointermove', function (e) {
  if (e.dragging) {
    $(element).popover('dispose');
    return;
  }
  var pixel = map.getEventPixel(e.originalEvent);
  var hit = map.hasFeatureAtPixel(pixel);
  map.getTarget().style.cursor = hit ? 'pointer' : '';
});
