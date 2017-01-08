
/*
  增加drag交互
*/
import {forceCenter,forceCollide,forceLink,forceManyBody,forceSimulation,forceX,forceY} from 'd3-force';
import {select, event} from 'd3-selection';
import {drag} from 'd3-drag';
import './index.css';
import * as d3Array from 'd3-array';
import * as d3Scale from 'd3-scale';
import * as d3Zoom from 'd3-zoom';

class Graph {
	constructor(container) {
		this.container = container;
		this.width = container.offsetWidth;
		this.height = container.offsetHeight;
	}
	data(ds){
		this.nodesData = ds.nodes
		.map(d => {
			d.value = parseFloat(d.value, 10);
			return d;
		})
		.sort(d => -d.value);
		this.linksData = ds.links;
	}
	render(ds) {
		this.data(ds);

		const {width, height} = this;
    
    const svg = this.svg = 
    select(this.container).append('svg')
			.attr('width', width)
			.attr('height', height);
		//
		const g = this.g =
		  svg
			.append('g')
			.attr('fill', '#222');

    //绘制边
		const getLinkId = (d) => `${d.source.id}_${d.target.id}`;
		const linkMax = d3Array.max(this.linksData, d => d.value);
		const linkScale = d3Scale.scalePow().exponent(1).domain([0, linkMax]).range([1,10]);
		const lineWidthFunc = (d) => linkScale(d.value);
		const link = this.link = g.selectAll('line')
      .data(this.linksData, getLinkId)
      .enter().append('line')
      .classed('link', true)
      .attr('stroke-width', lineWidthFunc)

    //绘制点
		const nodeMax = d3Array.max(this.nodesData, d => d.value);
		const nodesizeScale = d3Scale.scalePow().exponent(.5).domain([0, nodeMax]).range([8,50]);
		//数据和节点大小的关系
		const nodesize = this.nodesize = d => {
			let v = parseFloat(d.value, 10);
			return 1.2 * nodesizeScale(v);
		};
		const colors = d3Scale.schemeCategory20;
		const colorFunc = d3Scale.scaleOrdinal(colors);
		const nodeColor = d => colorFunc(d.id.split('@')[1]);
		const circle = this.circle = g
			.selectAll('circle')
			.data(this.nodesData, d => d.id)
			.enter()
			.append('circle')
			.classed('circle', true)
			.attr('r', nodesize)
			.attr('fill', nodeColor)
		this.initSimulation(ds);
		this.initEvents();
	}
	initSimulation(ds){
		const {width, height, linksData, nodesData} = this;
		const fManyBody = forceManyBody();
		const fLink = forceLink().id(d => d.id);
		const fCenter = forceCenter(width / 2, height / 2);
		const fCollide  = forceCollide(this.nodesize).strength(2);
		const simulation = this.simulation =
			forceSimulation(ds)
			.force('link', fLink)
			.force('charge', fManyBody)
			.force('center', fCenter)
			.force('collide', fCollide)
			.on('tick', d => this.updateTick(d));
		simulation.nodes(nodesData);
    simulation.force('link').links(linksData);
	}
	updateTick(d){
		const {link, circle} = this;
    link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);
    circle
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
	}
	initEvents(){
		this.initEventsDrag();
		this.initEventsZoom();
		this.container.addEventListener('wheel', e => e.preventDefault());
	}
	initEventsZoom(){
    const zoomed = () => this.g.attr('transform', event.transform)
    var zoom = d3Zoom.zoom()
    .scaleExtent([0.1, 20])
    .translateExtent([[-2000, -2000], [this.width + 2000, this.height + 2000]])
    .on('zoom', zoomed);
    //
    this.svg.call(zoom);
	}
	initEventsDrag(){
		const {simulation} = this;
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

    this.circle.call(dragf);
	}
}


const container = document.getElementById('main-container')
const graph = new Graph(container)

fetch('/8-graph/data/dnc.json')
	.then(res => res.json())
	.then(ds => graph.render(ds));

