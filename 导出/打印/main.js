import 'ol/ol.css';
import Map from 'ol/Map';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import WMTS, {optionsFromCapabilities} from 'ol/source/WMTS';
import WMTSCapabilities from 'ol/format/WMTSCapabilities';
import proj4 from 'proj4';
import {ScaleLine, defaults as defaultControls} from 'ol/control';
import {getPointResolution, get as getProjection} from 'ol/proj';
import {register} from 'ol/proj/proj4';

proj4.defs(
  'EPSG:27700',
  '+proj=tmerc +lat_0=49 +lon_0=-2 +k=0.9996012717 ' +
    '+x_0=400000 +y_0=-100000 +ellps=airy ' +
    '+towgs84=446.448,-125.157,542.06,0.15,0.247,0.842,-20.489 ' +
    '+units=m +no_defs'
);

register(proj4);

var proj27700 = getProjection('EPSG:27700');
proj27700.setExtent([0, 0, 700000, 1300000]);

var raster = new TileLayer();

var url =
  'https://tiles.arcgis.com/tiles/qHLhLQrcvEnxjtPr/arcgis/rest/services/OS_Open_Raster/MapServer/WMTS';
fetch(url)
  .then(function (response) {
    return response.text();
  })
  .then(function (text) {
    var result = new WMTSCapabilities().read(text);
    var options = optionsFromCapabilities(result, {
      layer: 'OS_Open_Raster',
    });
    options.attributions =
      'Contains OS data © Crown Copyright and database right ' +
      new Date().getFullYear();
    options.crossOrigin = '';
    options.projection = proj27700;
    options.wrapX = false;
    raster.setSource(new WMTS(options));
  });

var map = new Map({
  layers: [raster],
  controls: defaultControls({
    attributionOptions: {collapsible: false},
  }),
  target: 'map',
  view: new View({
    center: [373500, 436500],
    projection: proj27700,
    zoom: 7,
  }),
});

var scaleLine = new ScaleLine({bar: true, text: true, minWidth: 125});
map.addControl(scaleLine);

var dims = {
  a0: [1189, 841],
  a1: [841, 594],
  a2: [594, 420],
  a3: [420, 297],
  a4: [297, 210],
  a5: [210, 148],
};

// export options for html-to-image.
// See: https://github.com/bubkoo/html-to-image#options
var exportOptions = {
  filter: function (element) {
    var className = element.className || '';
    return (
      className.indexOf('ol-control') === -1 ||
      className.indexOf('ol-scale') > -1 ||
      (className.indexOf('ol-attribution') > -1 &&
        className.indexOf('ol-uncollapsible'))
    );
  },
};

var exportButton = document.getElementById('export-pdf');

exportButton.addEventListener(
  'click',
  function () {
    exportButton.disabled = true;
    document.body.style.cursor = 'progress';

    var format = document.getElementById('format').value;
    var resolution = document.getElementById('resolution').value;
    var scale = document.getElementById('scale').value;
    var dim = dims[format];
    var width = Math.round((dim[0] * resolution) / 25.4);
    var height = Math.round((dim[1] * resolution) / 25.4);
    var viewResolution = map.getView().getResolution();
    var scaleResolution =
      scale /
      getPointResolution(
        map.getView().getProjection(),
        resolution / 25.4,
        map.getView().getCenter()
      );

    map.once('rendercomplete', function () {
      exportOptions.width = width;
      exportOptions.height = height;
      domtoimage
        .toJpeg(map.getViewport(), exportOptions)
        .then(function (dataUrl) {
          var pdf = new jsPDF('landscape', undefined, format);
          pdf.addImage(dataUrl, 'JPEG', 0, 0, dim[0], dim[1]);
          pdf.save('map.pdf');
          // Reset original map size
          scaleLine.setDpi();
          map.getTargetElement().style.width = '';
          map.getTargetElement().style.height = '';
          map.updateSize();
          map.getView().setResolution(viewResolution);
          exportButton.disabled = false;
          document.body.style.cursor = 'auto';
        });
    });

    // Set print size
    scaleLine.setDpi(resolution);
    map.getTargetElement().style.width = width + 'px';
    map.getTargetElement().style.height = height + 'px';
    map.updateSize();
    map.getView().setResolution(scaleResolution);
  },
  false
);
