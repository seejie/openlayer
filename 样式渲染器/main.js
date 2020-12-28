import 'ol/ol.css';
import GeoJSON from 'ol/format/GeoJSON';
import Map from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import {Fill, Stroke, Style} from 'ol/style';
import {getBottomLeft, getHeight, getWidth} from 'ol/extent';
import {toContext} from 'ol/render';

var fill = new Fill();
var stroke = new Stroke({
  color: 'rgba(255,255,255,0.8)',
  width: 2,
});
var style = new Style({
  renderer: function (pixelCoordinates, state) {
    var context = state.context;
    var geometry = state.geometry.clone();
    geometry.setCoordinates(pixelCoordinates);
    var extent = geometry.getExtent();
    var width = getWidth(extent);
    var height = getHeight(extent);
    var flag = state.feature.get('flag');
    if (!flag || height < 1 || width < 1) {
      return;
    }

    // Stitch out country shape from the blue canvas
    context.save();
    var renderContext = toContext(context, {
      pixelRatio: 1,
    });
    renderContext.setFillStrokeStyle(fill, stroke);
    renderContext.drawGeometry(geometry);
    context.clip();

    // Fill transparent country with the flag image
    var bottomLeft = getBottomLeft(extent);
    var left = bottomLeft[0];
    var bottom = bottomLeft[1];
    context.drawImage(flag, left, bottom, width, height);
    context.restore();
  },
});

var vectorLayer = new VectorLayer({
  source: new VectorSource({
    url:
      'https://openlayersbook.github.io/openlayers_book_samples/assets/data/countries.geojson',
    format: new GeoJSON(),
  }),
  style: style,
});

// Load country flags and set them as `flag` attribute on the country feature
vectorLayer.getSource().on('addfeature', function (event) {
  var feature = event.feature;
  var img = new Image();
  img.onload = function () {
    feature.set('flag', img);
  };
  img.src =
    'https://flagcdn.com/w320/' + feature.get('iso_a2').toLowerCase() + '.png';
});

new Map({
  layers: [vectorLayer],
  target: 'map',
  view: new View({
    center: [0, 0],
    zoom: 1,
  }),
});
