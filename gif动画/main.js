import 'ol/ol.css';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import Point from 'ol/geom/Point';
import View from 'ol/View';
import {Icon, Style} from 'ol/style';
import {Stamen, Vector as VectorSource} from 'ol/source';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';

var iconFeature = new Feature({
  geometry: new Point([0, 0]),
});

var vectorSource = new VectorSource({
  features: [iconFeature],
});

var vectorLayer = new VectorLayer({
  source: vectorSource,
});

var rasterLayer = new TileLayer({
  source: new Stamen({
    layer: 'toner',
  }),
});

var map = new Map({
  layers: [rasterLayer, vectorLayer],
  target: document.getElementById('map'),
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});

// var gifUrl = './globe.gif';
var gifUrl = 'https://openlayers.org/en/latest/examples/data/globe.gif';
var gif = gifler(gifUrl);
gif.frames(
  document.createElement('canvas'),
  function (ctx, frame) {
    if (!iconFeature.getStyle()) {
      iconFeature.setStyle(
        new Style({
          image: new Icon({
            img: ctx.canvas,
            imgSize: [frame.width, frame.height],
            opacity: 0.8,
          }),
        })
      );
    }
    ctx.clearRect(0, 0, frame.width, frame.height);
    ctx.drawImage(frame.buffer, frame.x, frame.y);
    map.render();
  },
  true
);

// change mouse cursor when over icon
map.on('pointermove', function (e) {
  var pixel = map.getEventPixel(e.originalEvent);
  var hit = map.hasFeatureAtPixel(pixel);
  map.getTarget().style.cursor = hit ? 'pointer' : '';
});
