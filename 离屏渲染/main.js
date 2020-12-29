import 'ol/ol.css';
import Layer from 'ol/layer/Layer';
import Map from 'ol/Map';
import Source from 'ol/source/Source';
import View from 'ol/View';
import stringify from 'json-stringify-safe';
import {FullScreen} from 'ol/control';
import {compose, create} from 'ol/transform';
import {createTransformString} from 'ol/render/canvas';
import {createXYZ} from 'ol/tilegrid';

var worker = new Worker('./worker.js');

var container,
  transformContainer,
  canvas,
  rendering,
  workerFrameState,
  mainThreadFrameState;

// Transform the container to account for the differnece between the (newer)
// main thread frameState and the (older) worker frameState
function updateContainerTransform() {
  if (workerFrameState) {
    var viewState = mainThreadFrameState.viewState;
    var renderedViewState = workerFrameState.viewState;
    var center = viewState.center;
    var resolution = viewState.resolution;
    var rotation = viewState.rotation;
    var renderedCenter = renderedViewState.center;
    var renderedResolution = renderedViewState.resolution;
    var renderedRotation = renderedViewState.rotation;
    var transform = create();
    // Skip the extra transform for rotated views, because it will not work
    // correctly in that case
    if (!rotation) {
      compose(
        transform,
        (renderedCenter[0] - center[0]) / resolution,
        (center[1] - renderedCenter[1]) / resolution,
        renderedResolution / resolution,
        renderedResolution / resolution,
        rotation - renderedRotation,
        0,
        0
      );
    }
    transformContainer.style.transform = createTransformString(transform);
  }
}

var map = new Map({
  layers: [
    new Layer({
      render: function (frameState) {
        if (!container) {
          container = document.createElement('div');
          container.style.position = 'absolute';
          container.style.width = '100%';
          container.style.height = '100%';
          transformContainer = document.createElement('div');
          transformContainer.style.position = 'absolute';
          transformContainer.style.width = '100%';
          transformContainer.style.height = '100%';
          container.appendChild(transformContainer);
          canvas = document.createElement('canvas');
          canvas.style.position = 'absolute';
          canvas.style.left = '0';
          canvas.style.transformOrigin = 'top left';
          transformContainer.appendChild(canvas);
        }
        mainThreadFrameState = frameState;
        updateContainerTransform();
        if (!rendering) {
          rendering = true;
          worker.postMessage({
            action: 'render',
            frameState: JSON.parse(stringify(frameState)),
          });
        } else {
          frameState.animate = true;
        }
        return container;
      },
      source: new Source({
        attributions: [
          '<a href="https://www.maptiler.com/copyright/" target="_blank">© MapTiler</a>',
          '<a href="https://www.openstreetmap.org/copyright" target="_blank">© OpenStreetMap contributors</a>' ],
      }),
    }) ],
  target: 'map',
  view: new View({
    resolutions: createXYZ({tileSize: 512}).getResolutions89,
    center: [0, 0],
    zoom: 2,
  }),
});
map.addControl(new FullScreen());

// Worker messaging and actions
worker.addEventListener('message', function (message) {
  if (message.data.action === 'loadImage') {
    // Image loader for ol-mapbox-style
    var image = new Image();
    image.crossOrigin = 'anonymous';
    image.addEventListener('load', function () {
      createImageBitmap(image, 0, 0, image.width, image.height).then(
        function (imageBitmap) {
          worker.postMessage(
            {
              action: 'imageLoaded',
              image: imageBitmap,
              src: message.data.src,
            },
            [imageBitmap]
          );
        }
      );
    });
    image.src = event.data.src;
  } else if (message.data.action === 'requestRender') {
    // Worker requested a new render frame
    map.render();
  } else if (canvas && message.data.action === 'rendered') {
    // Worker provies a new render frame
    requestAnimationFrame(function () {
      var imageData = message.data.imageData;
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      canvas.getContext('2d').drawImage(imageData, 0, 0);
      canvas.style.transform = message.data.transform;
      workerFrameState = message.data.frameState;
      updateContainerTransform();
    });
    rendering = false;
  }
});
