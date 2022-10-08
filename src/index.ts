import * as d3 from 'd3';
import loadServiceWorker from './loadServiceWorker';

require('./assets/favicon.ico');
require('./assets/android-chrome-192x192.png');
require('./assets/android-chrome-512x512.png');
require('./styles/main.scss');

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
  container
    .append('circle')
    .attr('cx', 0)
    .attr('cy', 0)
    .attr('r', 60)
    .style('fill', 'white')
    .style('cursor', 'pointer');
  // spin text
  container
    .append('text')
    .attr('x', 0)
    .attr('y', 10)
    .attr('text-anchor', 'middle')
    .text('SPIN')
    .style('font-weight', 'bold')
    .style('font-size', '30px');
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
      stopSpinning();
      return;
    }
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
        // populate question
        d3.select('#question h1').text(data[picked].label.trim());
        oldrotation = rotation;

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
  chartElement.appendChild(startOverElement);
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

if (process.env.NODE_ENV === 'production') {
  loadServiceWorker();
}
