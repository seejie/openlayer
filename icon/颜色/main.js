import 'ol/ol.css';
import Feature from 'ol/Feature';
import Map from 'ol/Map';
import Point from 'ol/geom/Point';
import TileJSON from 'ol/source/TileJSON';
import VectorSource from 'ol/source/Vector';
import View from 'ol/View';
import {Icon, Style} from 'ol/style';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {fromLonLat} from 'ol/proj';

var rome = new Feature({
  geometry: new Point(fromLonLat([12.5, 41.9])),
});

var london = new Feature({
  geometry: new Point(fromLonLat([-0.12755, 51.507222])),
});

var madrid = new Feature({
  geometry: new Point(fromLonLat([-3.683333, 40.4])),
});
var paris = new Feature({
  geometry: new Point(fromLonLat([2.353, 48.8566])),
});
var berlin = new Feature({
  geometry: new Point(fromLonLat([13.3884, 52.5169])),
});

rome.setStyle(
  new Style({
    image: new Icon({
      color: '#BADA55',
      crossOrigin: 'anonymous',
      // For Internet Explorer 11
      imgSize: [20, 20],
      // src: 'data/square.svg',
      src: 'https://openlayers.org/en/latest/examples/data/square.svg',
    }),
  })
);

london.setStyle(
  new Style({
    image: new Icon({
      color: 'rgba(255, 0, 0, .5)',
      crossOrigin: 'anonymous',
      // src: 'data/bigdot.png',
      src: 'https://openlayers.org/en/latest/examples/data/bigdot.png',
      scale: 0.2,
    }),
  })
);

madrid.setStyle(
  new Style({
    image: new Icon({
      crossOrigin: 'anonymous',
      // src: 'data/bigdot.png',
      src: 'https://openlayers.org/en/latest/examples/data/bigdot.png',
      scale: 0.2,
    }),
  })
);

paris.setStyle(
  new Style({
    image: new Icon({
      color: '#8959A8',
      crossOrigin: 'anonymous',
      // For Internet Explorer 11
      imgSize: [20, 20],
      // src: 'data/dot.svg',
      src: 'https://openlayers.org/en/latest/examples/data/dot.svg',
    }),
  })
);

berlin.setStyle(
  new Style({
    image: new Icon({
      crossOrigin: 'anonymous',
      // For Internet Explorer 11
      imgSize: [20, 20],
      // src: 'data/dot.svg',
      src: 'https://openlayers.org/en/latest/examples/data/dot.svg',
    }),
  })
);
var vectorSource = new VectorSource({
  features: [rome, london, madrid, paris, berlin],
});

var vectorLayer = new VectorLayer({
  source: vectorSource,
});

var rasterLayer = new TileLayer({
  source: new TileJSON({
    url: '/aj.1x1-degrees.json',
    crossOrigin: '',
  }),
});

var map = new Map({
  layers: [rasterLayer, vectorLayer],
  target: document.getElementById('map'),
  view: new View({
    center: fromLonLat([2.896372, 44.6024]),
    zoom: 3,
  }),
});
