import * as d3 from 'd3';
import { Fireworks } from 'fireworks-js';
import loadServiceWorker from './loadServiceWorker';
import audioControls from './audioControls';
import spinnerMp3 from './assets/spinner-sound.mp3';
import tadaMp3 from './assets/tada-fanfare.mp3';

require('./assets/favicon.ico');
require('./assets/android-chrome-192x192.png');
require('./assets/android-chrome-512x512.png');
require('./assets/apple-touch-icon.png');
require('./assets/favicon-16x16.png');
require('./assets/favicon-32x32.png');
require('./styles/main.scss');

const wheelSpinningSound = new Audio(spinnerMp3);
const tadaSound = new Audio(tadaMp3);
if (window.localStorage.audioMuteSetting) {
  wheelSpinningSound.muted = window.localStorage.audioMuteSetting;
  tadaSound.muted = window.localStorage.audioMuteSetting;
}

const fireworksContainer = document.getElementById('fireworks-container');
function fireworksContainerOnClick() {
  fireworksContainer.style.display = 'none';
  document.getElementById('chart').click();
  document.getElementsByClassName('chartholder')[0].dispatchEvent(new Event('click'));
}
fireworksContainer.onclick = fireworksContainerOnClick;

const fireworks = new Fireworks(fireworksContainer, {
  // sound: {
  //   enabled: !wheelSpinningSound.muted,
  // },
});

const padding = {
  top: 20,
  right: 40,
  bottom: 0,
  left: 0,
};

const baseSpinnerSizePx = 800;

const w = baseSpinnerSizePx - padding.left - padding.right;
const h = baseSpinnerSizePx - padding.top - padding.bottom;
const r = Math.min(w, h) / 2;
let rotation = 0;
let oldrotation = 0;
let picked = 100000;
let oldpick = [];
const color = d3.scaleOrdinal(d3.schemeCategory10);
let data = [];
const testData = ['Person 1', 'Person 2', 'Person 3', 'Person 4'];

let imageUrlForSpinner = '';

// eslint-disable-next-line no-unused-vars
function rotTween(to) {
  const i = d3.interpolate(oldrotation % 360, rotation);
  return (t) => `rotate(${i(t)})`;
}

function stopSpinning() {
  // console.log('done');
  const chartElement = document.getElementById('chart');
  chartElement.remove();
  const questionElement = document.getElementById('question');
  questionElement.remove();
  document.getElementById('input-lines').style.display = 'block';
  document.getElementById('startSpinning').style.display = 'block';
}

function makeArrowAndCircle(
  svg: d3.Selection<SVGSVGElement, any[], HTMLElement, any>,
  container: d3.Selection<SVGGElement, any[], HTMLElement, any>,
) {
  // make arrow
  svg
    .append('g')
    .attr(
      'transform',
      `translate(${w + padding.left + padding.right},${h / 2 + padding.top})`,
    )
    .append('path')
    .attr('d', `M-${r * 0.15},0L0,${r * 0.05}L0,-${r * 0.05}Z`)
    .style('fill', 'black');
  // draw spin circle
  if (imageUrlForSpinner.length > 0) {
    const defs = svg.append('svg:defs');

    defs.append('svg:pattern')
      .attr('id', 'image')
      .attr('width', 1)
      .attr('height', 1)
      .attr('patternContentUnits', 'objectBoundingBox')
      .append('svg:image')
      .attr('xlink:href', imageUrlForSpinner)
      .attr('width', 1)
      .attr('height', 1)
      .attr('x', 0)
      .attr('y', 0)
      .attr('preserveAspectRatio', 'xMaxYMax slice');

    container
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 60)
      .style('fill', 'white')
      .style('fill', 'url(#image)')
      .style('cursor', 'pointer');
  } else {
    container
      .append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 60)
      .style('fill', 'white')
      .style('cursor', 'pointer');
  }
}

function drawWheel() {
  const svg = d3
    .select('#chart')
    .append('svg')
    .data([data])
    .attr('preserveAspectRatio', 'xMinYMin meet')
    .attr('viewBox', `0 0 ${w + padding.left + padding.right} ${h + padding.top + padding.bottom}`);
  const container = svg
    .append('g')
    .attr('class', 'chartholder')
    .attr(
      'transform',
      `translate(${w / 2 + padding.left},${h / 2 + padding.top})`,
    );
  const vis = container.append('g');

  const pie = d3
    .pie()
    .sort(null)
    // eslint-disable-next-line no-unused-vars
    .value((d) => 1);
  // declare an arc generator function
  const arc = d3.arc().outerRadius(r).innerRadius(60);

  // select paths, use arc generator to draw
  const arcs = vis
    .selectAll('g.slice')
    .data(pie)
    .enter()
    .append('g')
    .attr('class', 'slice');

  arcs
    .append('path')
    .attr('fill', (d, i) => color(i))
    .attr('d', (d) => arc(d));
  // add the text
  arcs
    .append('text')
    .attr('transform', (d) => {
      // eslint-disable-next-line no-param-reassign
      d.innerRadius = 0;
      // eslint-disable-next-line no-param-reassign
      d.outerRadius = r;
      // eslint-disable-next-line no-param-reassign
      d.angle = (d.startAngle + d.endAngle) / 2;
      return `rotate(${(d.angle * 180) / Math.PI - 90})translate(${
        d.outerRadius - 10
      })`;
    })
    .attr('text-anchor', 'end')
    .text((d, i) => data[i].label);

  // eslint-disable-next-line no-unused-vars
  function spin(d) {
    container.on('click', null);
    // all slices have been seen, all done
    // console.log(`OldPick: ${oldpick.length}`, `Data length: ${data.length}`);
    if (oldpick.length === data.length) {
      fireworksContainer.style.display = 'none';
      fireworks.clear();
      stopSpinning();
      return;
    }

    audioControls.stopAudio(tadaSound);
    audioControls.playAudio(wheelSpinningSound);
    fireworksContainer.style.display = 'none';
    fireworks.stop();
    const ps = 360 / data.length;
    const rng = Math.floor(Math.random() * 1440 + 360);

    rotation = Math.round(rng / ps) * ps;

    picked = Math.round(data.length - (rotation % 360) / ps);
    picked = picked >= data.length ? picked % data.length : picked;
    if (oldpick.indexOf(picked) !== -1) {
      d3.select(this).call(spin);
      return;
    }
    oldpick.push(picked);

    rotation += 90 - Math.round(ps / 2);
    vis
      .transition()
      .duration(3000)
      .attrTween('transform', rotTween)
      .on('end', () => {
        // mark question as seen
        d3.select(`.slice:nth-child(${picked + 1}) path`).attr('fill', '#111');
        d3.select(`.slice:nth-child(${picked + 1}) text`).attr('fill', '#ffffff');
        // populate question
        d3.select('#question h1').text(data[picked].label.trim());
        oldrotation = rotation;

        audioControls.stopAudio(wheelSpinningSound);
        audioControls.playAudio(tadaSound);
        fireworksContainer.style.display = 'block';
        const sizes = {
          width: window.innerWidth,
          height: window.innerHeight,
        };
        fireworks.updateSize(sizes);
        fireworks.start();

        /* Get the result value from object "data" */
        // console.log(data[picked].value);

        /* Comment the below line for restrict spin to single time */
        container.on('click', spin);
      });
  }

  container.on('click', spin);

  makeArrowAndCircle(svg, container);
}

function startOver() {
  stopSpinning();
  audioControls.stopAudio(wheelSpinningSound);
}

function toggleMute() {
  audioControls.toggleMute(wheelSpinningSound);
  audioControls.toggleMute(tadaSound);
  this.textContent = wheelSpinningSound.muted ? 'Unmute' : 'Mute';
  window.localStorage.audioMuteSetting = wheelSpinningSound.muted;
  // TODO - toggle muting the fireworks from here
}

function startSpinning() {
  const textArea = <HTMLInputElement>document.getElementById('input-lines');
  const inputData = textArea.value.trim()
    ? textArea.value.split('\n').filter((elm) => elm)
    : testData;
  const tempData = [];
  for (let index = 0; index < inputData.length; index += 1) {
    const datum = inputData[index];
    tempData.push({
      label: datum,
      value: index + 1,
      question: datum,
    });
  }
  data = tempData;

  oldpick = [];

  // Make the elements
  const chartElement = document.createElement('div');
  chartElement.setAttribute('id', 'chart');
  chartElement.setAttribute('class', 'spinner-items');
  document.getElementById('spinner-container').appendChild(chartElement);
  const startOverElement = document.createElement('button');
  startOverElement.setAttribute('id', 'start-over');
  startOverElement.setAttribute('class', 'button button-blue');
  startOverElement.setAttribute('role', 'button');
  startOverElement.onclick = startOver;
  startOverElement.textContent = 'Start over';
  const muteElement = document.createElement('button');
  muteElement.setAttribute('id', 'mute');
  muteElement.setAttribute('class', 'button button-black');
  muteElement.setAttribute('role', 'button');
  muteElement.onclick = toggleMute;
  muteElement.textContent = wheelSpinningSound.muted ? 'Unmute' : 'Mute';
  chartElement.appendChild(startOverElement);
  chartElement.appendChild(muteElement);
  document.getElementById('spinner-container').appendChild(chartElement);
  const questionElement = document.createElement('div');
  questionElement.setAttribute('id', 'question');
  questionElement.setAttribute('class', 'spinner-items');
  const h1Element = document.createElement('h1');
  questionElement.appendChild(h1Element);
  document.getElementById('spinner-container').appendChild(questionElement);

  drawWheel();

  document.getElementById('chart').style.display = 'block';
  document.getElementById('question').style.display = 'block';
  document.getElementById('input-lines').style.display = 'none';
  document.getElementById('startSpinning').style.display = 'none';
}

const button = document.getElementById('startSpinning');
button.onclick = startSpinning;

const textArea = <HTMLInputElement>document.getElementById('input-lines');
if (window.localStorage.TextEditorData) {
  textArea.value = window.localStorage.TextEditorData;
}

textArea.addEventListener('keyup', () => {
  window.localStorage.TextEditorData = textArea.value;
});

const urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('imgUrl')) {
  imageUrlForSpinner = urlParams.get('imgUrl');
}

if (process.env.NODE_ENV === 'production') {
  loadServiceWorker();
}
