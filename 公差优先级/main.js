import 'ol/ol.css';
import CircleStyle from 'ol/style/Circle';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import {Fill, Stroke, Style} from 'ol/style';
import {Point} from 'ol/geom';

var map = new Map({
  target: 'map',
  view: new View({
    center: [0, 0],
    resolution: 1,
    resolutions: [1],
  }),
});

var vectorLayer = new VectorLayer({
  source: new VectorSource({
    features: [
      new Feature({
        geometry: new Point([0, 0]),
        color: 'white',
      }),
      new Feature({
        geometry: new Point([-10, 0]),
        color: 'fuchsia',
      }),
      new Feature({
        geometry: new Point([-10, -10]),
        color: 'orange',
      }),
      new Feature({
        geometry: new Point([-10, 10]),
        color: 'cyan',
      }) ],
  }),
  style: function (feature) {
    return new Style({
      image: new CircleStyle({
        radius: 5,
        fill: new Fill({
          color: feature.get('color'),
        }),
        stroke: new Stroke({
          color: 'gray',
          width: 1,
        }),
      }),
    });
  },
});
map.addLayer(vectorLayer);

var highlightFeature = new Feature(new Point([NaN, NaN]));
highlightFeature.setStyle(
  new Style({
    image: new CircleStyle({
      radius: 5,
      stroke: new Stroke({
        color: 'black',
        width: 2,
      }),
    }),
  })
);
vectorLayer.getSource().addFeature(highlightFeature);
map.on('pointermove', function (e) {
  var hit = map.forEachFeatureAtPixel(
    e.pixel,
    function (feature) {
      highlightFeature.setGeometry(feature.getGeometry().clone());
      return true;
    },
    {
      hitTolerance: 10,
    }
  );
  if (!hit) {
    highlightFeature.setGeometry(new Point([NaN, NaN]));
  }
});
