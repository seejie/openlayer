import 'ol/ol.css';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import View from 'ol/View';
import {Circle} from 'ol/geom';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Style} from 'ol/style';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';

var circleFeature = new Feature({
  geometry: new Circle([12127398.797692968, 4063894.123105166], 50),
});
circleFeature.setStyle(
  new Style({
    renderer: function renderer(coordinates, state) {
      var coordinates_0 = coordinates[0];
      var x = coordinates_0[0];
      var y = coordinates_0[1];
      var coordinates_1 = coordinates[1];
      var x1 = coordinates_1[0];
      var y1 = coordinates_1[1];
      var ctx = state.context;
      var dx = x1 - x;
      var dy = y1 - y;
      var radius = Math.sqrt(dx * dx + dy * dy);

      var innerRadius = 0;
      var outerRadius = radius * 1.4;

      var gradient = ctx.createRadialGradient(
        x,
        y,
        innerRadius,
        x,
        y,
        outerRadius
      );
      gradient.addColorStop(0, 'rgba(255,0,0,0)');
      gradient.addColorStop(0.6, 'rgba(255,0,0,0.2)');
      gradient.addColorStop(1, 'rgba(255,0,0,0.8)');
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.arc(x, y, radius, 0, 2 * Math.PI, true);
      ctx.strokeStyle = 'rgba(255,0,0,1)';
      ctx.stroke();
    },
  })
);

new Map({
  layers: [
    new TileLayer({
      source: new OSM(),
      visible: true,
    }),
    new VectorLayer({
      source: new VectorSource({
        features: [circleFeature],
      }),
    }) ],
  target: 'map',
  view: new View({
    center: [12127398.797692968, 4063894.123105166],
    zoom: 19,
  }),
});
