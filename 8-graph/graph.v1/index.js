
/*
  增加drag交互
*/
import {forceCenter,forceCollide,forceLink,forceManyBody,forceSimulation,forceX,forceY} from 'd3-force';
import {select, event} from 'd3-selection';
import {drag} from 'd3-drag';
import './index.css';
import * as d3Array from 'd3-array';
import * as d3Scale from 'd3-scale';

class Graph {
	constructor(container) {
		this.container = container;
		this.width = container.offsetWidth;
		this.height = container.offsetHeight;
	}
	data(ds){
		this.nodesData = ds.nodes.map(d => {
			d.value = parseFloat(d.value, 10);
			return d;
		});
		this.linksData = ds.links;
	}
	render(ds) {
		this.data(ds);

		const nodeMax = d3Array.max(this.nodesData, d => d.value);
		const {width, height} = this;
		const nodesizeScale = d3Scale.scalePow().exponent(.5).domain([0, nodeMax]).range([8,50]);
		const nodesize = d => {
			let v = parseFloat(d.value, 10);
			return 1.2 * nodesizeScale(v);
		};
			// const nodesize = (d) => Math.max(d.value / 50, 2)

		const g = 
			select(this.container).append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('fill', '#222');

		function dragstarted(d) {
			event.sourceEvent.stopPropagation();
			simulation.alphaTarget(.1).restart();
			select(this).classed('dragging', true);
		}

		function dragged(d) {
			 select(this).attr('cx', d.x = event.x).attr('cy', d.y = event.y);
		}

		function dragended(d) {
			select(this).classed('dragging', false);
			simulation.alphaTarget(.1).restart();
		}

	  const dragf = drag()
    .on('start', dragstarted)
    .on('drag',  dragged)
    .on('end',   dragended);


    //绘制边
		const getLinkId = (d) => `${d.source.id}_${d.target.id}`
		const lineWidthFunc = (d) => Math.sqrt(d.value)
		const link = this.link = g.selectAll('line')
      .data(this.linksData, getLinkId)
      .enter().append('line')
      .classed('link', true)
      .attr('stroke-width', lineWidthFunc)

    //绘制点
		const circle = this.circle = g
			.selectAll('circle')
			.data(this.nodesData, d => d.id)
			.enter()
			.append('circle')
			.classed('circle', true)
			.attr('r', nodesize)
			.call(dragf);

		const fManyBody = forceManyBody();
		const fCollide  = forceCollide(nodesize).strength(2);
		const fLink = forceLink().id(d => d.id);
		const fCenter = forceCenter(width / 2, height / 2);

		const update = () => {
      link
        .attr('x1', d => d.source.x)
        .attr('y1', d => d.source.y)
        .attr('x2', d => d.target.x)
        .attr('y2', d => d.target.y);
      circle
        .attr('cx', d => d.x)
        .attr('cy', d => d.y);
		};

		const simulation = this.simulation =
			forceSimulation(ds)
			// .velocityDecay(0.9)
			.force('link', fLink)
			.force('charge', fManyBody)
			// .force('collide', fCollide)
			.force('center', fCenter)
			.on('tick', update);

			simulation.nodes(this.nodesData);
      simulation.force('link').links(this.linksData);
	}
}


const container = document.getElementById('main-container')
const graph = new Graph(container)

fetch('/8-graph/data/dnc.json')
	.then(res => res.json())
	.then(ds => graph.render(ds));

