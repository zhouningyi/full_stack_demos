
/*
  增加drag交互
*/
import {forceCenter,forceCollide,forceLink,forceManyBody,forceSimulation,forceX,forceY} from 'd3-force';
import {select, event} from 'd3-selection';
import {drag} from 'd3-drag';
import './circle.v1.css';

class Circles {
	constructor(container) {
		this.container = container;
		this.width = container.offsetWidth;
		this.height = container.offsetHeight;
	}
	render(ds) {
		const {width, height} = this;
		const nodesize = (d) => Math.max(d.value / 100, 2)

		const g = 
			select(this.container).append('svg')
			.attr('width', width)
			.attr('height', height)
			.append('g')
			.attr('fill', '#222');

		function dragstarted(d) {
			event.sourceEvent.stopPropagation();
			simulation.alpha(.1).restart();
			select(this).classed('dragging', true);
		}

		function dragged(d) {
			 select(this).attr('cx', d.x = event.x).attr('cy', d.y = event.y);
		}

		function dragended(d) {
			select(this).classed('dragging', false);
			simulation.alpha(.2).restart();
		}

	  const dragf = drag()
    .on('start', dragstarted)
    .on('drag', dragged)
    .on('end', dragended);

		const node = this.nodes = g
			.selectAll("circle")
			.data(ds, d => d.id)
			.enter()
			.append('circle')
			.classed('circle', true)
			.attr('r', nodesize)
			.call(dragf);

		const fManyBody = forceManyBody().strength(() => 15);
		const fCollide = forceCollide(nodesize).strength(1);

		const update = () => node.attr('cx', d => d.x).attr('cy', d => d.y);

		const simulation = this.simulation =
			forceSimulation(ds)
			.velocityDecay(0.9)
			.force('charge', fManyBody)
			.force('collide', fCollide)
			.force('center', forceCenter(width / 2, height / 2))
			.on('tick', update);
	}
}

const container = document.getElementById('main-container')
const circles = new Circles(container)

fetch('/8-graph/nodes.json')
	.then(res => res.json())
	.then(ds => ds.filter(d => d.value > 100))
	.then(ds => circles.render(ds));

